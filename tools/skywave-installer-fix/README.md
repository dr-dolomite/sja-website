# Skywave X62 Installer — SSL Fix Module

## Quick Start

### 1. Diagnose first (on the affected machine)

```bash
cd tools/skywave-installer-fix
python diagnose.py
```

This tells you exactly what's happening — TLS interception by AV? Truly self-signed cert? HTTPS not even listening?

### 2. Set the certificate fingerprint (one-time)

If the diagnostic confirms a self-signed cert, pin it:

```bash
# Linux/macOS
export SKYWAVE_CERT_FINGERPRINT="SHA256:AA:BB:CC:DD:..."

# Windows PowerShell
$env:SKYWAVE_CERT_FINGERPRINT = "SHA256:AA:BB:CC:DD:..."
```

The diagnostic output includes the exact command with your router's fingerprint.

### 3. Integrate into the installer

In the installer code that currently calls `urllib.request.urlopen()`:

```python
# BEFORE (broken):
import urllib.request
response = urllib.request.urlopen("https://192.168.1.1/login", data=payload)

# AFTER (fixed):
from ssl_fix import create_router_connection
response = create_router_connection("https://192.168.1.1/login", data=payload)
```

That's it. The `create_router_connection` function:
- Uses **certificate pinning** if `SKYWAVE_CERT_FINGERPRINT` is set (most secure)
- Falls back to **unverified SSL scoped only to 192.168.1.1** if no fingerprint is set
- Falls back to **HTTP** if the URL scheme is `http://`

### 4. What to do based on diagnostic results

| Diagnostic says... | Action |
|---|---|
| TLS interception detected (Fortinet/Sophos/etc.) | Configure your AV/firewall to bypass `192.168.1.1`, OR add the AV's root CA to Python's trust store |
| Self-signed cert, TCP :443 open | Set `SKYWAVE_CERT_FINGERPRINT` → done |
| TCP :443 closed, HTTP :80 available | Use `http://192.168.1.1` URLs + verify firmware checksums independently |
| Both ports closed | Router is unreachable — check cables, IP, firewall rules |

## Security Notes

- **Never** globally disable SSL verification (`ssl._create_default_https_context = ssl._create_unverified_context`). This affects ALL connections in the process.
- **Always** verify firmware integrity with a separate SHA-256 checksum when using HTTP.
- The certificate pinning approach is **more secure** than CA-based trust for LAN devices — it verifies the exact device you're talking to.
