// app/page.tsx
"use client";

import Link from "next/link";
import { indicators } from "@/data/indicators";
import { useState, useEffect, useMemo } from "react";

function WorldMap() {
  const [svgContent, setSvgContent] = useState<string>("");
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const supportedCountries: Record<string, { name: string; color: string }> = useMemo(() => ({
    'US': { name: 'United States', color: '#3e7ebb' },
    'CN': { name: 'China', color: '#e14d42' },
    'IN': { name: 'India', color: '#73b67b' },
    'DE': { name: 'Germany', color: '#dcb958' },
    'AE': { name: 'United Arab Emirates', color: '#b37bb2' }
  }), []);

  useEffect(() => {
    fetch('/world.svg')
      .then(response => response.text())
      .then(svg => {
        // Modify the SVG to color supported countries
        let modifiedSvg = svg;
        
        // Color by ID (India, Germany, UAE) and add data attribute for hover
        modifiedSvg = modifiedSvg.replace(/id="IN"/g, `id="IN" fill="${supportedCountries['IN'].color}" data-country="IN" style="cursor:pointer;transition:opacity 0.2s ease"`);
        modifiedSvg = modifiedSvg.replace(/id="DE"/g, `id="DE" fill="${supportedCountries['DE'].color}" data-country="DE" style="cursor:pointer;transition:opacity 0.2s ease"`);
        modifiedSvg = modifiedSvg.replace(/id="AE"/g, `id="AE" fill="${supportedCountries['AE'].color}" data-country="AE" style="cursor:pointer;transition:opacity 0.2s ease"`);
        
        // Color by class (US, China) and add data attribute for hover
        modifiedSvg = modifiedSvg.replace(/class="United States"/g, `class="United States" fill="${supportedCountries['US'].color}" data-country="US" style="cursor:pointer;transition:opacity 0.2s ease"`);
        modifiedSvg = modifiedSvg.replace(/class="China"/g, `class="China" fill="${supportedCountries['CN'].color}" data-country="CN" style="cursor:pointer;transition:opacity 0.2s ease"`);
        
        // Make SVG responsive
        modifiedSvg = modifiedSvg.replace(/width="2000"/, 'width="100%"');
        modifiedSvg = modifiedSvg.replace(/height="857"/, 'height="auto"');
        
        setSvgContent(modifiedSvg);
      });
  }, [supportedCountries]);

  const handleMouseOver = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const country = target.getAttribute('data-country');
    if (country && supportedCountries[country]) {
      setHoveredCountry(country);
      // Highlight all paths with the same country code
      const container = (e.currentTarget as HTMLElement);
      const allPaths = container.querySelectorAll(`[data-country="${country}"]`);
      allPaths.forEach(path => {
        (path as HTMLElement).style.opacity = '0.7';
      });
    }
  };

  const handleMouseOut = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const country = target.getAttribute('data-country');
    if (country) {
      setHoveredCountry(null);
      // Reset opacity for all paths with the same country code
      const container = (e.currentTarget as HTMLElement);
      const allPaths = container.querySelectorAll(`[data-country="${country}"]`);
      allPaths.forEach(path => {
        (path as HTMLElement).style.opacity = '1';
      });
    }
  };

  return (
    <div style={{ 
      width: "100%", 
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      position: "relative"
    }}>
      {/* Tooltip */}
      {hoveredCountry && supportedCountries[hoveredCountry] && (
        <div style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          padding: "8px 16px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 500,
          zIndex: 10,
          pointerEvents: "none"
        }}>
          {supportedCountries[hoveredCountry].name}
        </div>
      )}

      {/* SVG Map */}
      <div 
        style={{ 
          width: "100%", 
          maxWidth: "1200px",
          display: "flex",
          justifyContent: "center"
        }}
        dangerouslySetInnerHTML={{ __html: svgContent }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
      />

      {/* Legend */}
      <div style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: "16px",
        marginTop: "20px",
        padding: "12px 20px",
        backgroundColor: "#f8fafc",
        borderRadius: "8px",
        border: "1px solid #e2e8f0"
      }}>
        {Object.entries(supportedCountries).map(([code, { name, color }]) => (
          <div key={code} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{
              width: "16px",
              height: "16px",
              backgroundColor: color,
              borderRadius: "4px",
              border: "1px solid rgba(0,0,0,0.1)"
            }} />
            <span style={{ fontSize: "14px", color: "#374151" }}>{name}</span>
          </div>
        ))}
      </div>
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
              Our predictor tool currently supports five countries, carefully selected to help you understand a diverse range of economic conditions and gain broad insights into global wealth. 
              <br/> <br/>
              Each country represents a distinct position in the global economy: the United States, with its large, mature, and highly developed economy, serves as a benchmark for long-term stability and innovation-driven growth. 
              China showcases the impact of rapid industrial expansion and global economic influence, offering a look into fast-paced market evolution. 
              India, as an emerging market with immense growth potential, highlights the dynamics of population-driven development and expanding industries. 
              Germany provides a model of a stable European economy, known for strong manufacturing, fiscal discipline, and resilient market structures. 
              Finally, the United Arab Emirates represents a wealthy, resource-rich economy with unique dynamics shaped by diversification efforts and strategic global positioning. 
              <br/> <br/>
              Together, these countries offer a comprehensive and well-rounded foundation for exploring how wealth is created, sustained, and transformed across different economic landscapes.
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
              Steering from traditional economic indicators, we incorporate a diverse set of non-traditional metrics (with traditional GDP as the base) to provide a holistic view of a country&apos;s economic health and growth potential.
            </p>

            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "2rem"
            }}>
              <IndicatorGroup 
                title="Non-Traditional Indicators" 
                codes={["birth_rate", "literacy_rate", "population", "tourism_arrivals", "tourism_departures", "political_stability", "energy_use"]} 
              />
              <IndicatorGroup 
                title="Traditional Indicators" 
                codes={["gdp", "gdp_growth", "exports_pct_gdp", "imports_pct_gdp", "inflation", "unemployment", "fdi", "household_consumption", "govt_consumption", "investment", "net_exports"]} 
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
              where countries are going. We use a linear model, a random
              forest, and a hybrid model to guide our prediction. You can select between each
              model to get a varying look on our forecast for the future GDP.
            </p>
          </div>
        </section>
      </main>
    </>
  );
}
