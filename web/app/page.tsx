// app/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { indicators } from "@/data/indicators";
import { useState } from "react";

function WorldMap() {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const countryColors: Record<string, string> = {
    'IN': '#73b67b',
    'CN': '#e14d42',
    'DE': '#dcb958',
    'US': '#3e7ebb',
    'AE': '#b37bb2'
  };

  const handleCountryHover = (countryCode: string | null) => {
    setHoveredCountry(countryCode);
  };

  const getCountryFill = (countryId: string) => {
    if (hoveredCountry === countryId && countryColors[countryId]) {
      return countryColors[countryId];
    }
    return '#ececec';
  };

  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "100%",
      display: "flex",
      justifyContent: "center"
    }}>
      <svg 
        baseProfile="tiny" 
        fill="#ececec" 
        stroke="black" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth=".2" 
        version="1.2" 
        viewBox="0 0 2000 857" 
        width="100%"
        height="auto"
        style={{ maxWidth: "800px" }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <style>{`
          .country-hover {
            transition: fill 0.3s ease;
            cursor: pointer;
          }
        `}</style>
        
        {/* India */}
        <path 
          className="country-hover"
          d="M1433.7 379.1l-3.3 2.1 0.3 6.7-2.8-1.5-5.9-0.8-6.5 2.3-4.6-1.3-3.3 0.9-3.2 4.7-6.8 2.1 0.2 5.3 1.8 2.5-7.5-0.8-7.7-6.9-2.6 1.9-3.5-1.5-3.3-0.2 0.7-5.1-5.1-3.4-3 2.4-9.5-1.8-2.6 0.8-0.5 8.4 7.1 4.2 6.9 2.2-3.7 3.5-0.7 5.1-2.4 3.8-7.5 4.4-5.3 7.5-3.8 4.1-5 4.2 0.3 2.9-2.6 1.6-4.8 2.3-2.6 0.3-1.2 4.9 1.9 8.4 0.7 5.3-1.9 6.1 0.7 10.9-2.9 0.3-2.3 4.9 1.9 2.2-5.1 1.8-1.7 4.3-2.2 1.9-5.6-6-3.1-9-2.5-6.5-2.2-3-3.4-6.2-2-8-1.4-4-5.9-8.8-3.5-12.5-2.6-8.2-0.8-7.8-1.7-6-7.7 3.9-4-0.8-8.1-7.8 2.4-2.3-1.9-2.5-7.1-5.5 3.2-4.3 12.1 0-1.8-5.5-3.5-3.2-1.4-5-4-2.8 4.9-6.8 6.5 0.5 4.5-6.7 2.2-6.5 3.9-6.5-1-4.6 3.8-3.7-5.1-3.1-2.9-4.4-3.3-5.6 2-2.8 8.5 1.6 5.7-1 3.8-5.4 7.7 7.6 0.8 5.2 3 3.3 0.6 3.3-4.1-0.9 3.2 7.1 6.2 4 8.6 4.5z"
          fill={hoveredCountry === 'IN' ? countryColors['IN'] : '#ececec'}
          onMouseEnter={() => handleCountryHover('IN')}
          onMouseLeave={() => handleCountryHover(null)}
        />
        
        {/* China - Main */}
        <path 
          className="country-hover"
          d="M1625.6 185.5l9 4.5 6 5.8 7.6 0 2.6-2.4 6.9-1.9 1.3 5.7-0.3 2.3 2.8 6.8 0.6 6.2-6.9-1.1-2.9 2.2 4.7 5.4 3.9 7.5-2.5 0.1 1.9 3.3-5.5-3.8 0 3.6-6.4 2.7 2.8 3.4-4.6-0.3-3.6-2 1.1 4.6-3.9 3.4-2.1 4.1-6.3 1.8-2.4 3-4.8 1.8 1.3-3 2.5-2.5-1.9 1.8-2.9 6.4-5.2 3.3 0.3-6.7-10-0.3-11.5-3.5-6.1-2.9-0.1-8-2.5-3.6-4.5 0.5-1.7-3.4-3.5-2.9-6.2-0.3-1.8 2.3 2.6 5.3-3.4-1.3-2.3 0.4-3.8-6.1-3-5.6-2.5 0.6 3.7-4.2-3.9-1.1-3.5-3.4-5.4 4.4-0.5-3.4 2.6-5.6-2.2-3.2 2-2.3 4.4 0.6-3.9-4.7-3.7 1.6-6.3-2.1-1.5-2.8-6.9 0.4 0.5-7.5-2.8-4.8-8.2-3.1-4.8-4.5-0.4-6.3-1.4-1.9-5.8-3.5 3.1-2.5-7.1 4.5-3.5-0.8-5.4-3.6 0.2-2.3 8.1-1.3 1.8-3.1 5.1 2.4 2.9-2.4 2.3-8.7 3.7 1.3 3.4-2.9-2.9-6 3-1.5 0.9-5.5 5.2-1.8 4.3-5.4 3.3-0.2 0.6-3.9 6.3 1.7 1.3 4 7.8 3.6 3.7 6.4 6.4 3.7 9.8 2.1 2.8 4.7 6.7 3.7 3.6-1.6 7.2 1 4.8 3.4 6.5 0.7 8.1-2.9 5.4-4.2 1.8 0.2 2.4 2.9 3.5-0.8 3.5-5.6-3.6-7.2 2.7-2.5-2-6.5-4-1.2-3.8 3.8 2.2 2.1-3.4 1.7 3.7 4.2 0.6 5-3.9 4.6 1.4 5.7-4.4 2 0.5 2.5-3.8 5.1 1.6 4.5 3.8 2.4-2.4 5.4 1.4 5.9-3.4z"
          fill={hoveredCountry === 'CN' ? countryColors['CN'] : '#ececec'}
          onMouseEnter={() => handleCountryHover('CN')}
          onMouseLeave={() => handleCountryHover(null)}
        />
        
        {/* Germany */}
        <path 
          className="country-hover"
          d="M1053.9 158.9l1.4 3.1-1.2 1.7 1.9 2.1 1.5 3.3-0.2 2.2 2.4 3.9-2.2 0.6-1.3-0.7-1.1 1.2-3.5 1.2-1.7 1.6-3.4 1.3 1 1.8 0.7 2.7 2.6 1.5 3 2.6-1.6 2.9-1.7 0.8 1 4.1-0.4 1.1-1.7-1.3-2.4-0.2-3.5 1.1-4.4-0.3-0.6 1.7-2.7-1.7-1.4 0.3-5.5-1.9-1 1.3-4.2 0 0.4-4.5 2.4-4.2-7.2-1.2-2.4-1.6 0.2-2.7-1-1.4 0.4-4.2-1.1-6.5 2.9 0 1.2-2.3 0.9-5.6-0.9-2.1 0.8-1.3 4-0.3 1 1.3 3.1-3-1.3-2.3-0.4-3.4 3.7 0.8 2.9-0.9 0.3 2.3 4.9 1.4 0.1 2.2 4.7-1.2 2.6-1.6 5.6 2.4 2.4 1.9z"
          fill={hoveredCountry === 'DE' ? countryColors['DE'] : '#ececec'}
          onMouseEnter={() => handleCountryHover('DE')}
          onMouseLeave={() => handleCountryHover(null)}
        />
        
        {/* United States - Main */}
        <path 
          className="country-hover"
          d="M410 66.6l-24.6 20.4-35.6 32.7 4.2 0.2 2.8 1.6 0.5 2.6 0.3 3.8 7.6-3.3 6.5-1.9-0.6 3.1 0.8 2.4 1.6 2.7-1.1 4.2-1.4 6.9 4.6 3.8-3.2 3.8-5.1 2.9-0.6-2.2-2.5-2-3.3 4.8-2.2-0.5 1.9-5.9-0.6-6.1-6.1 0.2-3.5-1.9-3.3-6.1-3.7 0.9-6.7-1.1-5.7 2.6-6-2.5-3.3-3-6.8 1.2-3.5 4.1-2.4 0.4-6.6 1.2-6.2 2-6.4 1.3 3.2-3.5 8.2-5.8 6.8-1.9 0.4-1.4-8.3 3.2-6.2 4-2.3 1.4 6.8-1.5 0.3-5.1 3.4-0.2 4.9-0.2 11.7-0.8 0.9-4.5 3.8-2.9 7.5 1.4 0.6 4.7 2.2 0.3 3.3-5.3 4.1-1.5 5.6 2 3.6 1 3.4-0.7 7.8 0.8 2.3 6.1 1 1.2 6.5 6.9 5.2 0.2 2.7-4.7 4.4 3.3 1.8 6.6-0.5 2.8 6.4 0.2 9.9 1.9 6.4 0.5 4.1 8.1 0.3 3.4 7.6 1.8 1.3 3.9 5.5-1.2 4.6 3.4 5.6-1.4 8.2 0.5 4.1-8.2 6.2-2.3 3.9-0.1 5.2-2.6 5.1 0.9 10.4-4.2 2.2-1.9 2.8-5.6 4.8-3.2 5.8 3 0.5 3.9-1.2 7.8-0.9 2.8 1.9 3.8-1.7 1.9-0.2 5.2-2.7 1-1.8 5.1-6.8 2.3-2.2 2.6 3.7 4.6-1.7 2-0.6 4 3.4 0.6 7.3-1.9 5.7 1.2 2.8-3.7 2.4-5.4 0.5-2.9 3.2-2.1 6.2 0 0.4-7.6 7.5-2.5 4.5-0.3 0.6 2.6 6.1-2.6 2.1-3 1.1-5.2 6.4-3.9 3.9-0.9-2.1-4.7-4.3-3.6 0.3-2.8 6.7-6.4 3.9-5.1 0.3-3.4-4.2-1.8 2.2-4.7-1.1-5.9 1.3-1.9 2.9-3.5 1.2-6-2.5-2.8-4.2-5.1-2.7-10.4-1.1-3.8-3.2-2.4-5.3-1.5-6.9 0.5-5.7-2.3-3.8-5.1 0.2-4.3-2.9-7.2-5.1-3.2 0.2-3.2-3.2-7-3.9-2.9 1.8-2.5-6.7 1.5-3.1 0.1-6.9 3.6-3.3-1.2-2.7-4.7-1.1-4.6 0.1-6.4-2.5-8.6-0.1-8.5 4.1-1.5-0.6-6.2-4-4.1 0.6-4.3-2.5-4.4-0.7-6.8 2.4-3.1-0.6-4.7-1.9-6.5 4.3-2.1-5.6-3.8-3.9-6.6-5-8.9-2.3-2.3-0.5-7.6-2.5-5.5 4.4-0.4-0.6-7.1 3.1-5.5-0.9-7.5 1.7-3.3-3.3-4.7 1.8-5.5 11.8-10.3 5.9-2.3 0.5-3.9 2-1 3 2.3 0.5 3.6-1.8 2.8-5 2.1-1.7 3.4 0.6 4.1-7.3 0-3.3 2.2-6.6 4.2-1.9 4.3 0.8 4.9-4.7 1.7-4.6 4.9 0.9 3.8-3 4 1.3 3.6-0.2 8.8 2.9 3.1-2.4 6.5 3 8.2 0.3 5.8-2.6 5.7 0.9 2.1-4.1 4.2 2.1 9.9-0.9 2.3-1.9 5-0.3 4.7 2.2 4.8 2.6 4.8-4.7 1.6-5.9 3.4-6.4 0.2-7.8-4.3-4.3-1.8-6.7-3.5-9.5 2.8-5.9-0.7-5 1.6-4.2 5.3-2.5 4.1 0.4 4.2-3.7 2-4.9 5-2.4 3.9 1.4 8.2 5.3 3.4 2.9 3.8 1.8 3.9-4.2 4.9-1.6 3.8-6.5 8.6 1 12.3-8.4 5.5-3 7 0.2 8.8-0.8 4.8-7.7 5.5-2.9 5.3-1.4 3.7 2.9 4.2-0.5 4.3-4.8 6.8 0.9 2.6-4.1 10.5-0.4 0-5.6 5-1.8 9.5 0.7 3-4.7 4.9-0.3 1.5-5.4 6.1-5.1 9.1-8.4 3.8-5.9 7.5-0.6 4.9-3.8 8.6-2.5z"
          fill={hoveredCountry === 'US' ? countryColors['US'] : '#ececec'}
          onMouseEnter={() => handleCountryHover('US')}
          onMouseLeave={() => handleCountryHover(null)}
        />
        
        {/* UAE */}
        <path 
          className="country-hover"
          d="M1296.2 336.7l1.3 5.1-2.8 0 0 4.2 1.1 0.9-2.4 1.3 0.2 2.6-1.3 2.6 0 2.6-1 1.4-16.9-3.2-2.7-6.6-0.3-1.4 0.9-0.4 0.4 1.8 4.2-1 4.6 0.2 3.4 0.2 3.3-4.4 3.7-4.1 3-4 1.3 2.2z"
          fill={hoveredCountry === 'AE' ? countryColors['AE'] : '#ececec'}
          onMouseEnter={() => handleCountryHover('AE')}
          onMouseLeave={() => handleCountryHover(null)}
        />
        
        {/* Rest of countries - default paths */}
        <path d="M1383 261.6l1.5 1.8-2.9 0.8-2.4 1.1-5.9 0.8-5.3 1.3-2.4 2.8 1.9 2.7 1.4 3.2-2 2.7 0.8 2.5-0.9 2.3-5.2-0.2 3.1 4.2-3.1 1.7-1.4 3.8 1.1 3.9-1.8 1.8-2.1-0.6-4 0.9-0.2 1.7-4.1 0-2.3 3.7 0.8 5.4-6.6 2.7-3.9-0.6-0.9 1.4-3.4-0.8-5.3 1-9.6-3.3 3.9-5.8-1.1-4.1-4.3-1.1-1.2-4.1-2.7-5.1 1.6-3.5-2.5-1 0.5-4.7 0.6-8 5.9 2.5 3.9-0.9 0.4-2.9 4-0.9 2.6-2-0.2-5.1 4.2-1.3 0.3-2.2 2.9 1.7 1.6 0.2 3 0 4.3 1.4 1.8 0.7 3.4-2 2.1 1.2 0.9-2.9 3.2 0.1 0.6-0.9-0.2-2.6 1.7-2.2 3.3 1.4-0.1 2 1.7 0.3 0.9 5.4 2.7 2.1 1.5-1.4 2.2-0.6 2.5-2.9 3.8 0.5 5.4 0z" />
      </svg>
    </div>
  );
}

function IndicatorGroup({ title, codes }: { title: string; codes: string[] }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const groupIndicators = indicators.filter(ind => codes.includes(ind.code));

  return (
    <div style={{
      border: "1px solid #e2e8f0",
      borderRadius: "8px",
      overflow: "hidden",
      transition: "all 0.3s ease"
    }}>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          width: "100%",
          padding: "1rem 1.25rem",
          backgroundColor: isExpanded ? "#e0f2fe" : "#f8fafc",
          border: "none",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          cursor: "pointer",
          transition: "background-color 0.2s ease"
        }}
      >
        <span style={{
          fontSize: "1.1rem",
          fontWeight: 600,
          color: "#2E5A7F"
        }}>
          {title}
        </span>
        <span style={{
          fontSize: "1.25rem",
          color: "#2E5A7F",
          transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.3s ease",
          display: "inline-block"
        }}>
          ▼
        </span>
      </button>
      
      <div style={{
        maxHeight: isExpanded ? "2000px" : "0",
        overflow: "hidden",
        transition: "max-height 0.5s ease-in-out"
      }}>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "white",
          borderTop: isExpanded ? "1px solid #e2e8f0" : "none"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "1.25rem"
          }}>
            {groupIndicators.map((indicator, index) => (
              <IndicatorCard 
                key={indicator.id} 
                indicator={indicator} 
                index={index}
                isExpanded={isExpanded}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function IndicatorCard({ indicator, index, isExpanded }: { 
  indicator: typeof indicators[0]; 
  index: number;
  isExpanded: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      style={{
        padding: "1.25rem",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 8px 16px rgba(0, 0, 0, 0.1)" : "0 2px 4px rgba(0, 0, 0, 0.05)",
        opacity: isExpanded ? 1 : 0,
        animation: isExpanded ? `fadeInUp 0.4s ease-out ${index * 0.1}s forwards` : "none"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 style={{
        fontSize: "1.1rem",
        fontWeight: 600,
        color: "#2E5A7F",
        marginBottom: "0.75rem"
      }}>
        {indicator.label}
      </h4>
      <p style={{
        fontSize: "0.95rem",
        lineHeight: "1.6",
        color: "#64748b"
      }}>
        {indicator.long}
      </p>
      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

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
              <WorldMap />
            </div>
          </div>
        </section>

        {/* Indicators */}
        <section className="section section-indicators">
          <div className="container">
            <h2 className="section-title">Indicators</h2>
            <p className="section-subtitle">
              We know GDP is a generalizing number, so our team has narrowed
              down a list of key economic indicators to help you understand the full picture:
            </p>

            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "2rem"
            }}>
              <IndicatorGroup 
                title="Economic Output" 
                codes={["gdp", "gdp_growth", "net_exports"]} 
              />
              <IndicatorGroup 
                title="Demographics" 
                codes={["population", "birth_rate", "literacy_rate"]} 
              />
              <IndicatorGroup 
                title="Trade & Globalization" 
                codes={["exports_pct_gdp", "imports_pct_gdp", "tourism_arrivals", "tourism_departures"]} 
              />
              <IndicatorGroup 
                title="Investment & Spending" 
                codes={["fdi", "household_consumption", "govt_consumption", "investment"]} 
              />
              <IndicatorGroup 
                title="Governance & Stability" 
                codes={["political_stability", "unemployment", "inflation"]} 
              />
              <IndicatorGroup 
                title="Energy & Environment" 
                codes={["energy_use"]} 
              />
            </div>
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
