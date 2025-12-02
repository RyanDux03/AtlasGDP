// app/about/page.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const challenges = [
  {
    id: 1,
    title: "Data Availability & Cleaning",
    description: "Not all countries had consistent historical data. Missing values, inconsistent formats, and varying indicator definitions required extensive preprocessing and validation."
  },
  {
    id: 2,
    title: "Model Accuracy & Comparison",
    description: "Determining which model performed best required rigorous testing against historical GDP trends. Each model excelled in different scenarios, adding complexity to our accuracy metrics."
  },
  {
    id: 3,
    title: "Complex Feature Selection",
    description: "Choosing indicators like political instability, environmental factors, population, FDI, and literacy rate required justification and experimentation to ensure they contributed meaningful predictive value."
  },
  {
    id: 4,
    title: "Integration Between Systems",
    description: "Coordinating backend models, database structures, and the user interface required tight communication between subteams. Ensuring the dashboard responded quickly and accurately was a core challenge."
  },
  {
    id: 5,
    title: "Team Coordination & Time Management",
    description: "With multiple subgroups (frontend, backend/ML, database), staying aligned through weekly meetings, progress check-ins, and risk planning was essential to keep the project on schedule."
  }
];

function ChallengeDropdown({ challenge }: { challenge: typeof challenges[0] }) {
  const [isExpanded, setIsExpanded] = useState(false);

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
          {challenge.title}
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
        maxHeight: isExpanded ? "500px" : "0",
        overflow: "hidden",
        transition: "max-height 0.5s ease-in-out"
      }}>
        <div style={{
          padding: "1.5rem",
          backgroundColor: "white",
          borderTop: isExpanded ? "1px solid #e2e8f0" : "none"
        }}>
          <p style={{
            fontSize: "1rem",
            lineHeight: "1.7",
            color: "#555"
          }}>
            {challenge.description}
          </p>
        </div>
      </div>
    </div>
  );
}

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

        {/* About Us Content */}
        <section className="about-content-section">
          <div className="about-content">
            <h2 className="about-subtitle">Meet the Team Behind Atlas GDP</h2>
            <p className="about-paragraph">
              Atlas GDP was created by a dedicated team of Computer Science students at the University of Texas at Dallas, each bringing specialized skills to build a robust ML–driven economic insight platform.
            </p>

            <h3 className="about-section-title">Team Members</h3>
            
            <div className="team-member">
              <strong>Yousuf Stanikzay</strong> – Team Lead & Database Developer
              <p>Coordinates team progress, oversees communication, and manages database design and backend data interactions.</p>
            </div>

            <div className="team-member">
              <strong>Maunika Achanta</strong> – Machine Learning Engineer & Backend Developer
              <p>Leads model research, development, training, and accuracy evaluation.</p>
            </div>

            <div className="team-member">
              <strong>Ryan Duxstad</strong> – Machine Learning Engineer & Backend Developer
              <p>Works on model development, predictive analysis, and backend functionality.</p>
            </div>

            <div className="team-member">
              <strong>Gabriela Huerta</strong> – Machine Learning Engineer, Backend Developer & Scribe
              <p>Contributes to data processing, ML training, accuracy validation, and team documentation.</p>
            </div>

            <div className="team-member">
              <strong>Marilyn Mathews</strong> – UX/UI Developer
              <p>Creates the interface design, develops user-friendly visuals, and integrates front-end components.</p>
            </div>

            <div className="team-member">
              <strong>Annie Nguyen</strong> – UX/UI Developer & Database Developer
              <p>Designs UI components, implements front-end frameworks, and assists with database schema development and integration.</p>
            </div>

            <div className="team-member">
              <strong>Professor Muhammad Ikram</strong> – Faculty Advisor
              <p>Provides guidance, feedback, and technical oversight throughout the project lifecycle.</p>
            </div>

            <h3 className="about-section-title">About the Project</h3>
            <p className="about-paragraph">
              Atlas GDP is a tool that utlizes machine learning to forecast GDP and visualize global economic trends across multiple countries. Using publicly available data from the World Bank, IMF, and other open sources, the system allows users to:
            </p>
            <ul className="about-list">
              <li>Compare countries across chosen time spans</li>
              <li>Explore how economic indicators influence growth</li>
              <li>Visualize GDP using interactive, intuitive charts</li>
              <li>Assess factor-specific impacts such as literacy rate, foreign direct investment, political instability, population, and more</li>
            </ul>
            <p className="about-paragraph">
              The platform uses two models, Linear Regression and Random Forest, to generate accurate, data-driven predictions. By focusing on transparency and usability, Atlas GDP provides a valuable resource for policymakers, researchers, educators, economists, investors, and students.
            </p>
          </div>
        </section>

        {/* Inspiration Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Inspiration</h1>
          </div>
        </section>

        {/* Inspiration Content */}
        <section className="about-content-section">
          <div className="about-content">
            <p className="about-paragraph">
              The inspiration for Atlas GDP came from a desire to provide clearer, more flexible insights into global economic performance. Traditional econometric models struggled with the nonlinear patterns found in modern datasets, and accessible GDP forecasting tools were limited.
            </p>
            <p className="about-paragraph">Our goals included:</p>
            <ul className="about-list">
              <li>Creating a more robust forecasting method using machine learning</li>
              <li>Allowing users to visualize how individual economic factors impact GDP</li>
              <li>Making comparative economic analysis simple, interactive, and informative</li>
              <li>Providing a learning tool that blends data science, economics, and real-world application</li>
            </ul>
            <p className="about-paragraph">
              To challenge our models and capture diverse economic behavior, we selected five countries — United States, China, India, Germany, and United Arab Emirates. This variety allowed Atlas GDP to better highlight how different global conditions affect economic trajectories.
            </p>
            <p className="about-paragraph">
              Ultimately, Atlas GDP was inspired by the belief that economic forecasting should be accessible, transparent, and backed by modern data-driven techniques.
            </p>
          </div>
        </section>

        {/* Challenges Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Challenges</h1>
          </div>
        </section>

        {/* Challenges Content */}
        <section className="about-content-section">
          <div className="about-content">
            <p className="about-paragraph">
              Throughout development, the team encountered several major challenges that helped refine the final product:
            </p>

            <div style={{ 
              display: "flex",
              flexDirection: "column",
              gap: "1rem",
              marginTop: "1.5rem",
              marginBottom: "1.5rem"
            }}>
              {challenges.map((challenge) => (
                <ChallengeDropdown key={challenge.id} challenge={challenge} />
              ))}
            </div>

            <p className="about-paragraph">
              These challenges strengthened Atlas GDP and shaped it into a reliable and user-centered analysis tool.
            </p>
          </div>
        </section>

        {/* Sources Section */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Sources</h1>
          </div>
        </section>

        {/* Sources Content */}
        <section className="about-content-section">
          <div className="about-content">
            <p className="about-paragraph">
              Atlas GDP uses only public, ethically sourced, and academically appropriate data:
            </p>
            <ul className="about-list">
              <li>World Bank Open Data Repository</li>
              <li>International Monetary Fund (IMF) Macroeconomic Indicators</li>
              <li>Open-source machine learning tools and statistical libraries</li>
              <li>Team-created datasets, documentation, and evaluation procedures</li>
              <li>Project files, planning documents, risk analysis, and performance metrics (from the original proposal)</li>
            </ul>
            <p className="about-paragraph">
              All data is openly available and free for educational and research use. No personal or sensitive information is collected or processed.
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
