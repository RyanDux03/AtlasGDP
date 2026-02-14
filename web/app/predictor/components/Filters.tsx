"use client";

import React, { useEffect, useRef } from "react";

interface FiltersProps {
  openDropdown: string | null;
  setOpenDropdown: (name: string | null) => void;
  selectedCountry: string;
  setSelectedCountry: (country: string) => void;
  selectedComposition: string | null;
  setSelectedComposition: (composition: string | null) => void;
  selectedIndicators: string[];
  setSelectedIndicators: (indicators: string[]) => void;
  selectedTimeFrame: string | null;
  setSelectedTimeFrame: (timeFrame: string | null) => void;
  selectedModels: string[];
  setSelectedModels: (models: string[]) => void;
  onCountryChange: (isoCode: string) => void;
  onReset: () => void;
  onExportGraph: () => void;
}

const Filters = React.memo(({
  openDropdown,
  setOpenDropdown,
  selectedCountry,
  setSelectedCountry,
  selectedComposition,
  setSelectedComposition,
  selectedIndicators,
  setSelectedIndicators,
  selectedTimeFrame,
  setSelectedTimeFrame,
  selectedModels,
  setSelectedModels,
  onCountryChange,
  onReset,
  onExportGraph,
}: FiltersProps) => {
  const countriesList = ["USA", "China", "Germany", "India", "UAE"];
  const compositionList = ["All", "Consumer Spending", "Investment", "Government Spending"];
  const indicatorsList = [
    "Political Stability",
    "Energy Use",
    "Birth Rate",
    "Literacy Rate",
    "Population",
    "Foreign Direct Investment (FDI)"
  ];
  const timeFrames = ["All Time", "Last 5 Years", "Last 10 Years", "Last 15 Years"];
  const models = ["Linear Regression", "Random Forest", "Hybrid Model"];

  // Map ISO codes to display names
  const countryIsoMap: Record<string, string> = {
    "USA": "USA",
    "China": "CHN",
    "Germany": "DEU",
    "India": "IND",
    "UAE": "UAE"
  };

  // Ref for dropdown container to detect outside clicks
  const filtersRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [setOpenDropdown]);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(
      selectedIndicators.includes(indicator)
        ? selectedIndicators.filter(i => i !== indicator)
        : [...selectedIndicators, indicator]
    );
  };

  const handleModelToggle = (model: string) => {
    setSelectedModels(
      selectedModels.includes(model)
        ? selectedModels.filter(m => m !== model)
        : [...selectedModels, model]
    );
  };

  return (
    <section className="predictor-filters" aria-label="GDP Prediction Filters">
      <div className="predictor-filters-container" ref={filtersRef}>
        {/* Countries Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown" 
            onClick={() => toggleDropdown("countries")}
            aria-expanded={openDropdown === "countries"}
            aria-haspopup="listbox"
            aria-label="Select country"
          >
            <span className="dropdown-label">{selectedCountry}</span>
            <span className="dropdown-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </button>
          {openDropdown === "countries" && (
            <ul className="dropdown-menu" role="listbox" aria-label="Countries">
              {countriesList.map((country) => (
                <li
                  key={country}
                  role="option"
                  aria-selected={selectedCountry === country}
                  className={`dropdown-item ${selectedCountry === country ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedCountry(country);
                    const isoCode = countryIsoMap[country];
                    onCountryChange(isoCode);
                    setOpenDropdown(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedCountry(country);
                      const isoCode = countryIsoMap[country];
                      onCountryChange(isoCode);
                      setOpenDropdown(null);
                    }
                  }}
                  tabIndex={0}
                >
                  {country}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Composition Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown" 
            onClick={() => toggleDropdown("composition")}
            aria-expanded={openDropdown === "composition"}
            aria-haspopup="listbox"
            aria-label="Select GDP composition"
          >
            <span className="dropdown-label">{selectedComposition || "GDP Composition"}</span>
            <span className="dropdown-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </button>
          {openDropdown === "composition" && (
            <ul className="dropdown-menu" role="listbox" aria-label="GDP Composition">
              {compositionList.map((comp) => (
                <li
                  key={comp}
                  role="option"
                  aria-selected={selectedComposition === comp}
                  className={`dropdown-item ${selectedComposition === comp ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedComposition(comp);
                    setOpenDropdown(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedComposition(comp);
                      setOpenDropdown(null);
                    }
                  }}
                  tabIndex={0}
                >
                  {comp}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Indicators Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown" 
            onClick={() => toggleDropdown("indicators")}
            aria-expanded={openDropdown === "indicators"}
            aria-haspopup="listbox"
            aria-label={`Select indicators, ${selectedIndicators.length} currently selected`}
          >
            <span className="dropdown-label">
              {selectedIndicators.length > 0
                ? `${selectedIndicators.length} Selected`
                : "Indicators"}
            </span>
            <span className="dropdown-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </button>
          {openDropdown === "indicators" && (
            <ul className="dropdown-menu" role="listbox" aria-label="Indicators" aria-multiselectable="true">
              {indicatorsList.map((indicator) => (
                <li
                  key={indicator}
                  role="option"
                  aria-selected={selectedIndicators.includes(indicator)}
                  className={`dropdown-item ${selectedIndicators.includes(indicator) ? "selected" : ""}`}
                  onClick={() => handleIndicatorToggle(indicator)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleIndicatorToggle(indicator);
                    }
                  }}
                  tabIndex={0}
                >
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "100%" }}>
                    <input
                      type="checkbox"
                      checked={selectedIndicators.includes(indicator)}
                      onChange={() => handleIndicatorToggle(indicator)}
                      style={{ marginRight: "8px" }}
                      aria-label={indicator}
                      tabIndex={-1}
                    />
                    {indicator}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Time Frames Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown" 
            onClick={() => toggleDropdown("timeFrames")}
            aria-expanded={openDropdown === "timeFrames"}
            aria-haspopup="listbox"
            aria-label="Select time frame"
          >
            <span className="dropdown-label">{selectedTimeFrame || "Timeframe"}</span>
            <span className="dropdown-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </button>
          {openDropdown === "timeFrames" && (
            <ul className="dropdown-menu" role="listbox" aria-label="Time Frames">
              {timeFrames.map((frame) => (
                <li
                  key={frame}
                  role="option"
                  aria-selected={selectedTimeFrame === frame}
                  className={`dropdown-item ${selectedTimeFrame === frame ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedTimeFrame(frame);
                    setOpenDropdown(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedTimeFrame(frame);
                      setOpenDropdown(null);
                    }
                  }}
                  tabIndex={0}
                >
                  {frame}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Models Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown" 
            onClick={() => toggleDropdown("models")}
            aria-expanded={openDropdown === "models"}
            aria-haspopup="listbox"
            aria-label={`Select prediction models, ${selectedModels.length} currently selected`}
          >
            <span className="dropdown-label">
              {selectedModels.length > 0
                ? `${selectedModels.length} Selected`
                : "Prediction Model"}
            </span>
            <span className="dropdown-arrow" aria-hidden="true">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none" aria-hidden="true">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </button>
          {openDropdown === "models" && (
            <ul className="dropdown-menu" role="listbox" aria-label="Prediction Models" aria-multiselectable="true">
              {models.map((model) => (
                <li
                  key={model}
                  role="option"
                  aria-selected={selectedModels.includes(model)}
                  className={`dropdown-item ${selectedModels.includes(model) ? "selected" : ""}`}
                  onClick={() => handleModelToggle(model)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleModelToggle(model);
                    }
                  }}
                  tabIndex={0}
                >
                  <label style={{ display: "flex", alignItems: "center", cursor: "pointer", width: "100%" }}>
                    <input
                      type="checkbox"
                      checked={selectedModels.includes(model)}
                      onChange={() => handleModelToggle(model)}
                      style={{ marginRight: "8px" }}
                      aria-label={model}
                      tabIndex={-1}
                    />
                    {model}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reset Button */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown reset-button" 
            onClick={onReset}
            aria-label="Reset all filters to default values"
          >
            <span className="dropdown-label">RESET</span>
          </button>
        </div>

        {/* Export Graph Button */}
        <div className="predictor-dropdown-wrapper">
          <button 
            className="predictor-dropdown reset-button" 
            onClick={onExportGraph}
            aria-label="Export graph as image"
          >
            <span className="dropdown-label">EXPORT GRAPH</span>
          </button>
        </div>
      </div>
    </section>
  );
});

Filters.displayName = 'Filters';

export default Filters;
