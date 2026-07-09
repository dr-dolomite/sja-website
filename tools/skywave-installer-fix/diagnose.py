"""
Standalone diagnostic script — run this FIRST on the affected machine.

Usage:
    python diagnose.py

This will inspect the router's certificate and tell you exactly what's wrong
before you apply any fix.
"""

import sys
import os

# Allow running from any directory
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from ssl_fix import diagnose, setup


if __name__ == "__main__":
    print("Skywave X62 — SSL Diagnostic Tool")
    print("=================================\n")
    setup()  # runs diagnose() and prints the report
