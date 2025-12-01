// app/about/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function AboutPage() {
  return (
    <>
      {/* Header / Navbar */}
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

      <main>
        <section className="section">
          <div className="container">
            <h1 className="section-title">About Us</h1>
            <p className="section-subtitle">
              AtlasGDP is a tool designed to help visualize and predict GDP trends
              across different countries. Our team is passionate about making
              economic data accessible and understandable for everyone.
            </p>

            <h2 className="section-title" style={{ marginTop: "2rem" }}>Our Mission</h2>
            <p className="section-subtitle">
              We aim to provide insights into global wealth by analyzing key
              economic indicators and using predictive models to forecast future
              GDP trends.
            </p>

            <h2 className="section-title" style={{ marginTop: "2rem" }}>The Team</h2>
            <p className="section-subtitle">
              Our team consists of data scientists, economists, and developers
              working together to bring you accurate and meaningful economic
              predictions.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer">
        <div className="container footer-inner">
          <div className="footer-logo">AtlasGDP</div>
          <div className="footer-links">
            <Link href="/about" className="footer-link">
              About Us
            </Link>
            <Link href="/predictor" className="footer-link">
              Predictor Tool
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
