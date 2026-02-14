// app/predictor/IndicatorsTable.tsx
"use client";

import React, { useState, useCallback } from "react";
import { indicators as indicatorsData } from "@/data/indicators";

interface IndicatorsTableProps {
  selectedCountry: string;
  indicatorTableData: Array<{
    year: number;
    values: { [indicatorCode: string]: number | null };
  }>;
}

const IndicatorsTable = React.memo(({
  selectedCountry,
  indicatorTableData,
}: IndicatorsTableProps) => {
  const [hoveredIndicator, setHoveredIndicator] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number; left: number } | null>(null);

  // Filter to show only GDP and non-traditional indicators
  const displayedIndicators = indicatorsData.filter(ind => 
    ["gdp", "birth_rate", "literacy_rate", "population", "political_stability", "energy_use", "fdi"].includes(ind.code)
  );

  // Export table data as CSV
  const handleExportCSV = useCallback(() => {
    if (indicatorTableData.length === 0) return;

    // Build CSV header
    const headers = ["Year", ...displayedIndicators.map(ind => ind.label + (ind.unit ? ` (${ind.unit})` : ""))];
    
    // Build CSV rows
    const rows = indicatorTableData.map(row => {
      const values = [row.year.toString()];
      displayedIndicators.forEach(ind => {
        const value = row.values[ind.code];
        values.push(value != null ? value.toString() : "");
      });
      return values;
    });

    // Combine into CSV string
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");

    // Create and download file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${selectedCountry}_indicators.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [indicatorTableData, displayedIndicators, selectedCountry]);

  return (
    <section className="section" style={{ paddingTop: "2rem", paddingBottom: "3rem" }} aria-labelledby="indicators-table-title">
      <div className="container">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <h3 id="indicators-table-title" className="section-title" style={{ fontSize: "36px", color: "#2E5A7F", marginBottom: "0" }}>
            Indicators per Year – {selectedCountry}
          </h3>
          <button
            onClick={handleExportCSV}
            aria-label={`Export ${selectedCountry} indicators data as CSV`}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2E5A7F",
              color: "white",
              border: "none",
              borderRadius: "15px",
              fontSize: "14px",
              fontWeight: 700,
              cursor: "pointer",
              textTransform: "uppercase",
              transition: "background-color 0.2s ease"
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1e3a5f")}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2E5A7F")}
          >
            Export CSV
          </button>
        </div>
        <p style={{ fontSize: "1rem", color: "#64748b", marginBottom: "1.5rem" }}>
          Hover over column headers to see indicator definitions
        </p>
        
        {/* Global tooltip that appears below hovered column */}
        {hoveredIndicator && tooltipPosition && (() => {
          const indicator = indicatorsData.find(ind => ind.code === hoveredIndicator);
          if (!indicator) return null;
          
          return (
            <div 
              id={`tooltip-${indicator.code}`}
              role="tooltip"
              aria-live="polite"
              style={{
              position: "fixed",
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              transform: "translateX(-50%)",
              padding: "16px",
              backgroundColor: "#1e293b",
              color: "white",
              borderRadius: "8px",
              fontSize: "0.875rem",
              lineHeight: "1.5",
              width: "320px",
              maxWidth: "90vw",
              zIndex: 9999,
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.3)",
              pointerEvents: "none",
            }}>
              <div style={{
                position: "absolute",
                top: "-8px",
                left: "50%",
                transform: "translateX(-50%)",
                width: "0",
                height: "0",
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderBottom: "8px solid #1e293b",
              }} />
              <strong style={{ display: "block", marginBottom: "8px", fontSize: "0.95rem" }}>
                {indicator.label}
              </strong>
              <div style={{ color: "#e2e8f0" }}>
                {indicator.short}
              </div>
            </div>
          );
        })()}

        {indicatorTableData.length === 0 ? (
          <p style={{ marginTop: "1rem" }} role="alert" aria-live="polite">
            No indicator data available yet for this country.
          </p>
        ) : (
          <div
            style={{
              marginTop: "1rem",
              overflowX: "auto",
              width: "100%",
              position: "relative",
            }}
            role="region"
            aria-label="Economic indicators table"
            tabIndex={0}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                tableLayout: "auto",
              }}
              aria-label={`Economic indicators for ${selectedCountry} by year`}
            >
              <caption style={{ 
                position: "absolute", 
                left: "-10000px", 
                width: "1px", 
                height: "1px", 
                overflow: "hidden" 
              }}>
                Economic indicators data for {selectedCountry}, showing values across multiple years
              </caption>
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f8fafc",
                    textAlign: "left",
                  }}
                >
                  <th
                    scope="col"
                    style={{
                      padding: "0.75rem 1rem",
                      fontSize: "0.9rem",
                      fontWeight: 600,
                    }}
                  >
                    Year
                  </th>
                  {displayedIndicators.map((ind) => {
                    return (
                      <th
                        key={ind.id}
                        scope="col"
                        abbr={ind.label}
                        style={{
                          padding: "0.75rem 1rem",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                          cursor: "help",
                          position: "relative",
                          transition: "background-color 0.2s",
                          backgroundColor: hoveredIndicator === ind.code ? "#e0f2fe" : "transparent",
                          whiteSpace: "nowrap",
                        }}
                        aria-describedby={`tooltip-${ind.code}`}
                        onMouseEnter={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          setTooltipPosition({
                            top: rect.bottom,
                            left: rect.left + rect.width / 2,
                          });
                          setHoveredIndicator(ind.code);
                        }}
                        onMouseLeave={() => {
                          setHoveredIndicator(null);
                          setTooltipPosition(null);
                        }}
                      >
                        <div style={{ 
                          display: "flex", 
                          alignItems: "center", 
                          gap: "4px"
                        }}>
                          {ind.label}
                          {ind.unit ? ` (${ind.unit})` : ""}
                          <span 
                            style={{ 
                              fontSize: "0.75rem", 
                              color: "#94a3b8",
                              fontWeight: "normal"
                            }}
                            role="img"
                            aria-label="Information"
                          >ⓘ</span>
                        </div>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {indicatorTableData.map((row, rowIndex) => (
                  <tr 
                    key={row.year}
                    style={{
                      backgroundColor: rowIndex % 2 === 0 ? "white" : "#f8fafc",
                    }}
                  >
                    <th
                      scope="row"
                      style={{
                        padding: "0.75rem 1rem",
                        fontWeight: 600,
                        fontSize: "0.9rem",
                      }}
                    >
                      {row.year}
                    </th>
                    {displayedIndicators.map((ind) => {
                      const value = row.values[ind.code];
                      let formattedValue = "—";
                      
                      if (value != null) {
                        // Format based on indicator type
                        if (ind.code === "gdp" || ind.code === "fdi") {
                          // Convert to billions for GDP and FDI
                          formattedValue = `$${(value / 1_000_000_000).toFixed(2)}B`;
                        } else if (ind.code === "population") {
                          // Format population with commas
                          formattedValue = value.toLocaleString();
                        } else if (ind.code === "tourism_arrivals" || ind.code === "tourism_departures") {
                          // Format large numbers with K/M
                          if (value >= 1_000_000) {
                            formattedValue = `${(value / 1_000_000).toFixed(1)}M`;
                          } else if (value >= 1_000) {
                            formattedValue = `${(value / 1_000).toFixed(1)}K`;
                          } else {
                            formattedValue = value.toFixed(0);
                          }
                        } else if (
                          ind.code.includes("pct") || 
                          ind.code.includes("growth") || 
                          ind.code === "inflation" ||
                          ind.code === "unemployment" ||
                          ind.code === "literacy_rate" ||
                          ind.code === "household_consumption" ||
                          ind.code === "govt_consumption" ||
                          ind.code === "investment" ||
                          ind.code === "net_exports"
                        ) {
                          // Percentages
                          formattedValue = `${value.toFixed(2)}%`;
                        } else {
                          // Default: 2 decimal places
                          formattedValue = value.toFixed(2);
                        }
                      }
                      
                      return (
                        <td
                          key={ind.id}
                          style={{
                            padding: "0.75rem 1rem",
                            fontSize: "0.85rem",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {formattedValue}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
});

IndicatorsTable.displayName = 'IndicatorsTable';

export default IndicatorsTable;
