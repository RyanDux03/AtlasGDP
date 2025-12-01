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
        {/* About Us Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">About Us</h1>
          </div>
        </section>

        {/* White space for About Us content */}
        <section style={{ minHeight: "200px" }}></section>

        {/* Inspiration Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Inspiration</h1>
          </div>
        </section>

        {/* White space for Inspiration content */}
        <section style={{ minHeight: "200px" }}></section>

        {/* Challenges Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Challenges</h1>
          </div>
        </section>

        {/* White space for Challenges content */}
        <section style={{ minHeight: "200px" }}></section>

        {/* Sources Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Sources</h1>
          </div>
        </section>

        {/* White space for Sources content */}
        <section style={{ minHeight: "200px" }}></section>
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
