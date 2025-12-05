"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-left">
        <div className="footer-logo">AtlasGDP</div>
      </div>
      <div className="footer-right">
        <div className="footer-labels">
          <div className="footer-label-content">
            <Link href="/about" className="footer-link">
              About Us
            </Link>
            <Link href="/predictor" className="footer-link">
              Predictor Tool
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
