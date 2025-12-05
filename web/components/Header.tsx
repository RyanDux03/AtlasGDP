"use client";

import Link from "next/link";
import Image from "next/image";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="logo">
          <Link href="/">
            <Image 
              src="/atlas_logo.png"      
              alt="AtlasGDP Logo" 
              width={100}                
              height={100}
              priority                 
            />
          </Link>
          <Link href="/" className="logo-text">AtlasGDP</Link>
        </div>
        <nav className="nav-links">
          <Link href="/predictor" className="nav-link">
            Predictor Tool
          </Link>
          <Link href="/about" className="nav-link">
            About Us
          </Link>
        </nav>
      </div>
    </header>
  );
}
