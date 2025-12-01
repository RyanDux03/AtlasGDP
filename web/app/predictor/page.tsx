// app/predictor/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function PredictorPage() {
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
            <span className="logo-text">AtlasGDP</span>
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
            <h1 className="section-title">GDP Predictor Tool</h1>
            <p className="section-subtitle">
              Use our predictor tool to explore GDP trends and forecasts for
              different countries. Select a country and model below to get started.
            </p>

            <div className="predictor-controls" style={{ marginTop: "2rem" }}>
              <h2 className="section-title">Select a Country</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <button className="hero-button">United States</button>
                <button className="hero-button">Germany</button>
                <button className="hero-button">India</button>
                <button className="hero-button">China</button>
                <button className="hero-button">Brazil</button>
              </div>
            </div>

            <div className="predictor-models" style={{ marginTop: "2rem" }}>
              <h2 className="section-title">Select a Model</h2>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button className="hero-button">Linear Model</button>
                <button className="hero-button">Random Forest Model</button>
              </div>
            </div>

            <div className="predictor-results" style={{ marginTop: "3rem" }}>
              <h2 className="section-title">Results</h2>
              <div className="map-placeholder" style={{ height: "400px" }}>
                GDP prediction chart will appear here
              </div>
            </div>
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
