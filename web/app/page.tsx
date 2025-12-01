// app/page.tsx
import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
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
        {/* Hero */}
        <section className="hero">
          <video
          src="/globe_rotate.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="hero-globe"
        />
          <div className="hero-overlay" />
          <div className="container hero-content">
            <h1 className="hero-title">
              visualizing the why
              <br />
              in world wealth
            </h1>
            <Link href="/predictor" className="hero-button">
              go to predictor
            </Link>
          </div>
        </section>

        {/* Supported Countries */}
        <section className="section">
          <div className="container">
            <h2 className="section-title">Supported Countries</h2>
            <p className="section-subtitle">
              Our predictor tool currently supports 5 different countries with
              varying economies to give a wide range of insights on the world’s
              wealth.
            </p>

            <div className="map">
                <Image
                  src="/world.svg"
                  alt="World Map"
                  width={800}
                  height={400}
                  priority
                />
              </div>
            </div>
        </section>

        {/* Indicators */}
        <section className="section section-indicators">
          <div className="container">
            <h2 className="section-title">Indicators</h2>
            <p className="section-subtitle">
              We know GDP is a generalizing number, so our team has narrowed
              down a list of indicators from our tool including:
            </p>

            <ul className="indicator-list">
              <li>Political instability</li>
              <li>Direct foreign investment</li>
              <li>Literacy rate</li>
              <li>Country age</li>
              <li>Birth rates</li>
              <li>Environmental factors</li>
              <li>Population</li>
            </ul>
          </div>
        </section>

        {/* Prediction Models */}
        <section className="section section-models">
          <div className="container">
            <h2 className="section-title">Prediction Models</h2>
            <p className="section-subtitle">
              Unlike other tools, we want to use current data and trends to see
              where countries are going. We use a linear model and a random
              forest model to guide our prediction. You can toggle between each
              model to get a varying look on our forecast for the future GDP.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
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
    </>
  );
}
