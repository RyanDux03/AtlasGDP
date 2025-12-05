"use client";

import React, { useState } from "react";

interface ModelAccuracyCardsProps {
  selectedCountry: string;
}

// Map country display names to ISO codes
const countryToIso: Record<string, string> = {
  "USA": "USA",
  "China": "CHN",
  "Germany": "DEU",
  "India": "IND",
  "UAE": "ARE"
};

// R² accuracies by model and country ISO code
const rfAccuracies: Record<string, number> = {
  "ARE": 0.967343649933759,
  "CHN": 0.9554461185372651,
  "DEU": 0.979967184446301,
  "IND": 0.9630735896828855,
  "USA": 0.9731906377679994
};

const hybridAccuracies: Record<string, number> = {
  "ARE": 0.9916400784411488,
  "CHN": 0.6925342935435479,
  "DEU": 0.9422555862878881,
  "IND": 0.9124693477535333,
  "USA": 0.9435587262747313
};

function ModelCard({ 
  title, 
  accuracy, 
  description,
  isEmpty = false 
}: { 
  title: string; 
  accuracy?: number; 
  description?: string;
  isEmpty?: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  const formatAccuracy = (acc: number) => {
    return (acc * 100).toFixed(2) + "%";
  };

  const getAccuracyRating = (acc: number) => {
    if (acc >= 0.98) return { text: "Excellent", color: "#22c55e" };
    if (acc >= 0.95) return { text: "Very Good", color: "#84cc16" };
    if (acc >= 0.90) return { text: "Good", color: "#eab308" };
    if (acc >= 0.85) return { text: "Moderate", color: "#f97316" };
    return { text: "Fair", color: "#ef4444" };
  };

  return (
    <div 
      style={{
        padding: "1.5rem",
        backgroundColor: "#f8fafc",
        borderRadius: "12px",
        border: "1px solid #e2e8f0",
        transition: "all 0.3s ease",
        transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: isHovered ? "0 8px 16px rgba(0, 0, 0, 0.1)" : "0 2px 4px rgba(0, 0, 0, 0.05)",
        minHeight: "200px",
        display: "flex",
        flexDirection: "column"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h4 style={{
        fontSize: "1.25rem",
        fontWeight: 700,
        color: "#2E5A7F",
        marginBottom: "1rem",
        textAlign: "center"
      }}>
        {title}
      </h4>
      
      {isEmpty ? (
        <div style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#94a3b8",
          fontSize: "0.95rem",
          fontStyle: "italic",
          textAlign: "center"
        }}>
          Accuracy data coming soon
        </div>
      ) : accuracy !== undefined ? (
        <>
          <div style={{
            textAlign: "center",
            marginBottom: "1rem"
          }}>
            <div style={{
              fontSize: "2.5rem",
              fontWeight: 700,
              color: "#2E5A7F",
              lineHeight: 1.2
            }}>
              {formatAccuracy(accuracy)}
            </div>
            <div style={{
              fontSize: "0.9rem",
              color: "#64748b",
              marginTop: "0.25rem"
            }}>
              R² Score
            </div>
            <div style={{
              marginTop: "0.5rem",
              display: "inline-block",
              padding: "4px 12px",
              borderRadius: "20px",
              backgroundColor: getAccuracyRating(accuracy).color + "20",
              color: getAccuracyRating(accuracy).color,
              fontSize: "0.85rem",
              fontWeight: 600
            }}>
              {getAccuracyRating(accuracy).text}
            </div>
          </div>
          
          <p style={{
            fontSize: "0.85rem",
            lineHeight: "1.5",
            color: "#64748b",
            textAlign: "center",
            marginTop: "auto"
          }}>
            {description}
          </p>
        </>
      ) : null}
    </div>
  );
}

const ModelAccuracyCards = React.memo(({ selectedCountry }: ModelAccuracyCardsProps) => {
  const isoCode = countryToIso[selectedCountry] || "USA";
  const rfAccuracy = rfAccuracies[isoCode];
  const hybridAccuracy = hybridAccuracies[isoCode];

  return (
    <div style={{
      marginTop: "2rem",
      marginBottom: "2rem"
    }}>
      <h3 style={{
        fontSize: "36px",
        fontWeight: 700,
        color: "#2E5A7F",
        marginBottom: "0.5rem",
        textAlign: "left"
      }}>
        Model Accuracy for {selectedCountry}
      </h3>
      <p style={{
        fontSize: "0.95rem",
        color: "#64748b",
        textAlign: "left",
        marginBottom: "2.5rem"
      }}>
        R² (coefficient of determination) measures how well the model&apos;s predictions match actual GDP values. 
        A score of 100% means perfect predictions; higher scores indicate better model performance.
      </p>
      
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "1.5rem",
        maxWidth: "1000px",
        margin: "0 auto"
      }}>
        <ModelCard
          title="Linear Regression"
          isEmpty={true}
        />
        <ModelCard
          title="Random Forest"
          accuracy={rfAccuracy}
          description="Uses multiple decision trees to capture complex, non-linear relationships in economic data for robust predictions."
        />
        <ModelCard
          title="Hybrid Model"
          accuracy={hybridAccuracy}
          description="Combines multiple modeling approaches to leverage their strengths and provide balanced GDP forecasts."
        />
      </div>
    </div>
  );
});

ModelAccuracyCards.displayName = 'ModelAccuracyCards';

export default ModelAccuracyCards;
