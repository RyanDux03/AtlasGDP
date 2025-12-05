"use client";

import { useEffect, useRef } from "react";

interface FiltersProps {
  openDropdown: string | null;
  setOpenDropdown: (name: string | null) => void;
  selectedGdpType: string | null;
  setSelectedGdpType: (type: string | null) => void;
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
}

export default function Filters({
  openDropdown,
  setOpenDropdown,
  selectedGdpType,
  setSelectedGdpType,
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
}: FiltersProps) {
  const gdpTypes = ["Overall GDP", "GDP Growth Rate"];
  const countriesList = ["USA", "China", "Germany", "India", "UAE"];
  const compositionList = ["All", "Consumer Spending", "Investment", "Government Spending", "Net Exports"];
  const indicatorsList = [
    "Political Instability",
    "Energy Consumption",
    "Tourist Arrivals",
    "Tourist Departures"
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
    <section className="predictor-filters">
      <div className="predictor-filters-container" ref={filtersRef}>
        {/* GDP Types Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <div className="predictor-dropdown" onClick={() => toggleDropdown("gdpTypes")}>
            <span className="dropdown-label">{selectedGdpType || "GDP Type"}</span>
            <span className="dropdown-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </div>
          {openDropdown === "gdpTypes" && (
            <div className="dropdown-menu">
              {gdpTypes.map((type) => (
                <div
                  key={type}
                  className={`dropdown-item ${selectedGdpType === type ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedGdpType(type);
                    setOpenDropdown(null);
                  }}
                >
                  {type}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Countries Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <div className="predictor-dropdown" onClick={() => toggleDropdown("countries")}>
            <span className="dropdown-label">{selectedCountry}</span>
            <span className="dropdown-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </div>
          {openDropdown === "countries" && (
            <div className="dropdown-menu">
              {countriesList.map((country) => (
                <div
                  key={country}
                  className={`dropdown-item ${selectedCountry === country ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedCountry(country);
                    const isoCode = countryIsoMap[country];
                    onCountryChange(isoCode);
                    setOpenDropdown(null);
                  }}
                >
                  {country}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Composition Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <div className="predictor-dropdown" onClick={() => toggleDropdown("composition")}>
            <span className="dropdown-label">{selectedComposition || "GDP Composition"}</span>
            <span className="dropdown-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </div>
          {openDropdown === "composition" && (
            <div className="dropdown-menu">
              {compositionList.map((comp) => (
                <div
                  key={comp}
                  className={`dropdown-item ${selectedComposition === comp ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedComposition(comp);
                    setOpenDropdown(null);
                  }}
                >
                  {comp}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Indicators Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <div className="predictor-dropdown" onClick={() => toggleDropdown("indicators")}>
            <span className="dropdown-label">
              {selectedIndicators.length > 0
                ? `${selectedIndicators.length} Selected`
                : "Indicators"}
            </span>
            <span className="dropdown-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </div>
          {openDropdown === "indicators" && (
            <div className="dropdown-menu">
              {indicatorsList.map((indicator) => (
                <div
                  key={indicator}
                  className={`dropdown-item ${selectedIndicators.includes(indicator) ? "selected" : ""}`}
                  onClick={() => handleIndicatorToggle(indicator)}
                >
                  <input
                    type="checkbox"
                    checked={selectedIndicators.includes(indicator)}
                    onChange={() => {}}
                    style={{ marginRight: "8px" }}
                  />
                  {indicator}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Time Frames Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <div className="predictor-dropdown" onClick={() => toggleDropdown("timeFrames")}>
            <span className="dropdown-label">{selectedTimeFrame || "Timeframe"}</span>
            <span className="dropdown-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </div>
          {openDropdown === "timeFrames" && (
            <div className="dropdown-menu">
              {timeFrames.map((frame) => (
                <div
                  key={frame}
                  className={`dropdown-item ${selectedTimeFrame === frame ? "selected" : ""}`}
                  onClick={() => {
                    setSelectedTimeFrame(frame);
                    setOpenDropdown(null);
                  }}
                >
                  {frame}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Models Dropdown */}
        <div className="predictor-dropdown-wrapper">
          <div className="predictor-dropdown" onClick={() => toggleDropdown("models")}>
            <span className="dropdown-label">
              {selectedModels.length > 0
                ? `${selectedModels.length} Selected`
                : "Prediction Model"}
            </span>
            <span className="dropdown-arrow">
              <svg xmlns="http://www.w3.org/2000/svg" width="13" height="9" viewBox="0 0 13 9" fill="none">
                <path d="M7.82333 7.68242C7.05054 8.41986 5.83465 8.41986 5.06186 7.68242L0.623348 3.44691C-0.682106 2.20117 0.199625 0 2.00409 0L10.8811 0C12.6856 0 13.5673 2.20117 12.2618 3.44692L7.82333 7.68242Z" fill="#2E5A7F"/>
              </svg>
            </span>
          </div>
          {openDropdown === "models" && (
            <div className="dropdown-menu">
              {models.map((model) => (
                <div
                  key={model}
                  className={`dropdown-item ${selectedModels.includes(model) ? "selected" : ""}`}
                  onClick={() => handleModelToggle(model)}
                >
                  <input
                    type="checkbox"
                    checked={selectedModels.includes(model)}
                    onChange={() => {}}
                    style={{ marginRight: "8px" }}
                  />
                  {model}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
