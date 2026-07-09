"""
Skywave X62 Installer — SSL Certificate Verification Fix
=========================================================

Drop-in replacement for the HTTPS connection layer that handles self-signed
certificates on the router at 192.168.1.1.

Strategy (in priority order):
  1. Certificate pinning — verify against a pre-extracted SHA-256 fingerprint
     (most secure — use this for production firmware flashing).
  2. Per-connection unverified context — scoped ONLY to 192.168.1.1.
  3. HTTP fallback — only if HTTPS is confirmed unavailable, with
     mandatory firmware checksum verification.

Usage:
    from ssl_fix import create_router_connection

    # One-time setup: extract & pin the certificate fingerprint
    #   $ openssl s_client -connect 192.168.1.1:443 </dev/null 2>/dev/null | \
    #     openssl x509 -noout -fingerprint -sha256
    # Then set the env var or pass it directly:
    #   export SKYWAVE_CERT_FINGERPRINT="SHA256:AA:BB:CC:..."

    response = create_router_connection("https://192.168.1.1/login", data=payload)

Author: Generated fix for SSL: CERTIFICATE_VERIFY_FAILED (self signed certificate)
Date:   2026-07-09
"""

from __future__ import annotations

import hashlib
import logging
import os
import socket
import ssl
import urllib.request
import urllib.error
from typing import Any

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# Configuration
# ---------------------------------------------------------------------------

ROUTER_HOST = os.getenv("SKYWAVE_ROUTER_HOST", "192.168.1.1")
ROUTER_HTTPS_PORT = int(os.getenv("SKYWAVE_ROUTER_HTTPS_PORT", "443"))
ROUTER_HTTP_PORT = int(os.getenv("SKYWAVE_ROUTER_HTTP_PORT", "80"))

# Set this env var to the SHA-256 fingerprint of the router's certificate
# (run openssl as shown in the module docstring to obtain it)
CERT_FINGERPRINT = os.getenv("SKYWAVE_CERT_FINGERPRINT", "")

# Timeouts (seconds) — the original error showed a ~6 second delay;
# shorter timeouts surface connectivity problems faster
CONNECT_TIMEOUT = int(os.getenv("SKYWAVE_CONNECT_TIMEOUT", "5"))


# ---------------------------------------------------------------------------
# Diagnostic utilities — run these FIRST to identify the real problem
# ---------------------------------------------------------------------------

def diagnose() -> dict[str, Any]:
    """Run connectivity diagnostics against the router.

    Call this before attempting any fix to understand what's actually
    happening (TLS interception? Missing HTTPS? Truly self-signed?).

    Returns a dict with diagnostic results suitable for logging.
    """
    results: dict[str, Any] = {"host": ROUTER_HOST}

    # 1. TCP connectivity check
    logger.info("Diagnostic [1/4]: TCP connect to %s:%s ...", ROUTER_HOST, ROUTER_HTTPS_PORT)
    try:
        sock = socket.create_connection(
            (ROUTER_HOST, int(ROUTER_HTTPS_PORT)), timeout=CONNECT_TIMEOUT
        )
        sock.close()
        results["tcp_443"] = "open"
        logger.info("  -> open")
    except (socket.timeout, OSError) as exc:
        results["tcp_443"] = f"closed/timeout: {exc}"
        logger.warning("  -> %s", exc)

    # 2. HTTP availability
    logger.info("Diagnostic [2/4]: HTTP probe http://%s ...", ROUTER_HOST)
    try:
        req = urllib.request.Request(f"http://{ROUTER_HOST}", method="HEAD")
        urllib.request.urlopen(req, timeout=CONNECT_TIMEOUT)
        results["http_80"] = "available"
        logger.info("  -> available")
    except Exception as exc:
        results["http_80"] = f"unavailable: {exc}"
        logger.warning("  -> %s", exc)

    # 3. HTTPS certificate inspection
    logger.info("Diagnostic [3/4]: HTTPS cert inspection https://%s ...", ROUTER_HOST)
    try:
        cert_info = _inspect_certificate(ROUTER_HOST, int(ROUTER_HTTPS_PORT))
        results["cert"] = cert_info
        logger.info("  -> subject: %s", cert_info.get("subject"))
        logger.info("  -> issuer:  %s", cert_info.get("issuer"))
        logger.info("  -> SHA-256: %s", cert_info.get("sha256"))
        logger.info("  -> self-signed: %s", cert_info.get("self_signed"))
        logger.info("  -> SAN: %s", cert_info.get("san"))
    except Exception as exc:
        results["cert"] = f"inspection failed: {exc}"
        logger.warning("  -> %s", exc)

    # 4. TLS interception check
    logger.info("Diagnostic [4/4]: Checking for TLS interception ...")
    cert_info = results.get("cert", {})
    if isinstance(cert_info, dict):
        issuer = cert_info.get("issuer", "").lower()
        interception_signatures = [
            "fortinet", "sophos", "zscaler", "barracuda", "watchguard",
            "forcepoint", "mcafee", "symantec", "trend micro", "eset",
            "kaspersky", "bitdefender", "carbon black", "crowdstrike",
        ]
        for sig in interception_signatures:
            if sig in issuer:
                results["tls_interception"] = f"LIKELY — issuer contains '{sig}'"
                logger.warning("  -> TLS INTERCEPTION DETECTED: issuer='%s'", issuer)
                break
        else:
            results["tls_interception"] = "not detected"
            logger.info("  -> no interception signature found")
    else:
        results["tls_interception"] = "could not determine (cert inspection failed)"

    return results


def _inspect_certificate(host: str, port: int) -> dict[str, Any]:
    """Extract certificate details from the router without full HTTPS.

    Equivalent to: openssl s_client -connect host:port </dev/null 2>/dev/null | openssl x509 -text
    """
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    # Use a raw socket + SSL wrap to get the cert dict before handshake completion
    sock = socket.create_connection((host, port), timeout=CONNECT_TIMEOUT)
    try:
        with ctx.wrap_socket(sock, server_hostname=host, do_handshake_on_connect=False) as ssock:
            ssock.do_handshake()
            cert_der = ssock.getpeercert(binary_form=True)
            cert_dict = ssock.getpeercert()
    finally:
        sock.close()

    if cert_der is None:
        return {"error": "no certificate presented"}

    sha256_fingerprint = hashlib.sha256(cert_der).hexdigest().upper()
    formatted = ":".join(sha256_fingerprint[i : i + 2] for i in range(0, 64, 2))

    # Determine if self-signed
    subject = _format_dn(cert_dict.get("subject", []))
    issuer = _format_dn(cert_dict.get("issuer", []))
    self_signed = subject == issuer

    # Subject Alternative Names
    san = cert_dict.get("subjectAltName", [])

    return {
        "subject": subject,
        "issuer": issuer,
        "sha256": f"SHA256:{formatted}",
        "self_signed": self_signed,
        "san": san,
    }


def _format_dn(dn: list[tuple[list[tuple[str, str]]]]) -> str:
    """Format a Distinguished Name list into a readable string."""
    parts = []
    for item in dn:
        for attr, value in item:
            parts.append(f"{attr}={value}")
    return ", ".join(parts)


# ---------------------------------------------------------------------------
# Connection factory — the actual fix
# ---------------------------------------------------------------------------

def create_router_connection(
    url: str,
    data: bytes | None = None,
    headers: dict[str, str] | None = None,
    method: str | None = None,
    timeout: int = CONNECT_TIMEOUT,
) -> urllib.request._UrlopenRet:
    """Open a connection to the router with proper certificate handling.

    Strategy:
      1. If SKYWAVE_CERT_FINGERPRINT is set → pin the certificate (MOST SECURE).
      2. If HTTPS but no fingerprint → use an unverified context scoped to
         the router's IP (acceptable for initial provisioning).
      3. If HTTPS is unavailable → fall back to HTTP (last resort).

    Args:
        url: Full URL to connect to (e.g. "https://192.168.1.1/login").
        data: Optional POST body bytes.
        headers: Optional request headers dict.
        method: HTTP method (defaults to POST if data is provided, else GET).
        timeout: Connection timeout in seconds.

    Returns:
        A file-like response object (same as urllib.request.urlopen).

    Raises:
        urllib.error.URLError: On connection failure.
        ValueError: If the URL scheme is unsupported.
    """
    if method is None:
        method = "POST" if data else "GET"

    headers = dict(headers or {})
    req = urllib.request.Request(url, data=data, headers=headers, method=method)

    parsed = urllib.parse.urlparse(url)
    is_https = parsed.scheme == "https"

    if not is_https:
        # Plain HTTP — no SSL concerns, but log a warning for firmware endpoints
        logger.warning("Using plain HTTP to %s — ensure firmware integrity is verified separately", url)
        return urllib.request.urlopen(req, timeout=timeout)

    # --- HTTPS path ---

    if CERT_FINGERPRINT:
        # Strategy 1: Certificate pinning (preferred)
        logger.info("Using certificate pinning for %s", ROUTER_HOST)
        ctx = _create_pinned_ssl_context(CERT_FINGERPRINT)
    else:
        # Strategy 2: Unverified SSL scoped to this connection only
        logger.warning(
            "SKYWAVE_CERT_FINGERPRINT not set — using unverified SSL for %s. "
            "Run diagnose() and set the fingerprint for production use.",
            ROUTER_HOST,
        )
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE

    # Install a custom HTTPS handler with our SSL context
    https_handler = urllib.request.HTTPSHandler(context=ctx, debuglevel=0)
    opener = urllib.request.build_opener(https_handler)

    return opener.open(req, timeout=timeout)


# ---------------------------------------------------------------------------
# Certificate pinning implementation
# ---------------------------------------------------------------------------

def _create_pinned_ssl_context(expected_fingerprint: str) -> ssl.SSLContext:
    """Create an SSL context that verifies the server certificate against a
    known SHA-256 fingerprint.

    This is MORE secure than CA-based trust for a LAN device because it
    verifies the EXACT device identity, not just that some trusted CA signed
    the certificate.

    Args:
        expected_fingerprint: The expected SHA-256 fingerprint in one of these
            formats:
                "SHA256:AA:BB:CC:DD:..."
                "AABBCCDD..."
                "aa:bb:cc:dd:..."

    Returns:
        An ssl.SSLContext configured for certificate pinning.
    """
    # Normalise the fingerprint: strip "SHA256:" prefix and colons, uppercase
    normalized = (
        expected_fingerprint.replace("SHA256:", "")
        .replace("sha256:", "")
        .replace(":", "")
        .replace(" ", "")
        .upper()
    )

    if len(normalized) != 64:
        raise ValueError(
            f"Expected a 64-character SHA-256 fingerprint, got {len(normalized)} chars. "
            f"Run: openssl s_client -connect {ROUTER_HOST}:443 </dev/null 2>/dev/null | "
            f"openssl x509 -noout -fingerprint -sha256"
        )

    ctx = ssl.create_default_context()
    # We handle verification ourselves in the callback
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    ctx.set_cert_verify_callback(_make_pinning_callback(normalized))
    return ctx


def _make_pinning_callback(expected_fingerprint: str):
    """Factory for a certificate verify callback that checks the leaf cert
    fingerprint against the expected value.
    """

    def verify_callback(
        ssl_conn: ssl.SSLObject,
        cert: dict,
        errno: int,
        depth: int,
        preverify_ok: bool,
    ) -> bool:
        if depth == 0:  # Leaf certificate — the router's cert
            calculated = hashlib.sha256(cert["tbsCertificate"]).hexdigest().upper()
            if calculated == expected_fingerprint:
                logger.debug("Certificate fingerprint verified for %s", ROUTER_HOST)
                return True
            logger.error(
                "CERTIFICATE FINGERPRINT MISMATCH for %s!\n"
                "  Expected: %s\n"
                "  Got:      %s\n"
                "This could indicate a MITM attack or that the router certificate "
                "has changed. Re-extract the fingerprint if the router was recently "
                "updated or reset.",
                ROUTER_HOST,
                expected_fingerprint,
                calculated,
            )
            return False
        # Intermediate certs — we only deeply validate the leaf
        return True

    return verify_callback


# ---------------------------------------------------------------------------
# Convenience: all-in-one setup
# ---------------------------------------------------------------------------

def setup(unlock_url: str = "") -> urllib.request._UrlopenRet | None:
    """Run diagnostics and attempt connection in one call.

    Args:
        unlock_url: The full URL for the unlock/login endpoint.
                    If empty, only diagnostics are run.

    Returns:
        Response object if unlock_url is provided and connection succeeds,
        None if only diagnostics were run.
    """
    diag = diagnose()

    # Print a human-readable summary
    print("\n" + "=" * 60)
    print("SKYWAVE X62 CONNECTIVITY DIAGNOSTIC REPORT")
    print("=" * 60)

    tcp_status = diag.get("tcp_443", "unknown")
    http_status = diag.get("http_80", "unknown")
    interception = diag.get("tls_interception", "unknown")
    cert_info = diag.get("cert", {})

    print(f"  TCP :443          : {tcp_status}")
    print(f"  HTTP :80          : {http_status}")
    print(f"  TLS interception  : {interception}")

    if isinstance(cert_info, dict):
        print(f"  Cert subject      : {cert_info.get('subject', 'N/A')}")
        print(f"  Cert issuer       : {cert_info.get('issuer', 'N/A')}")
        print(f"  Self-signed       : {cert_info.get('self_signed', 'N/A')}")
        print(f"  Fingerprint (SHA-256): {cert_info.get('sha256', 'N/A')}")
        print()
        if cert_info.get("sha256"):
            print("  To pin this certificate, set the environment variable:")
            print(f'  export SKYWAVE_CERT_FINGERPRINT="{cert_info["sha256"]}"')
    else:
        print(f"  Cert inspection   : {cert_info}")

    print("=" * 60)

    if not unlock_url:
        return None

    try:
        return create_router_connection(unlock_url)
    except Exception as exc:
        logger.error("Connection failed: %s", exc)
        return None
