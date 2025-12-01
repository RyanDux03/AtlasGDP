// app/predictor/page.tsx
"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
export default function PredictorPage() {
    type Country = {
    id: number;
    name: string;
    iso_code: string;
  };

  type Indicator = {
    id: number;
    code: string;
    label: string;
    unit: string | null;
  };

  type TimeSeriesRow = {
    id: number;
    country_id: number;
    indicator_id: number;
    year: number;
    value: number | null;
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    null
  );
  const [timeSeries, setTimeSeries] = useState<TimeSeriesRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedGdpType, setSelectedGdpType] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("USA");
  const [selectedComposition, setSelectedComposition] = useState<string | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const gdpTypes = ["Overall GDP", "Real GDP", "Nominal GDP", "GDP Per Capita"];
  const countriesList = ["USA", "China", "Germany", "India", "UAE"];
  const compositionList = ["All", "Consumer Spending", "Investment", "Government Spending", "Net Exports"];
  const indicatorsList = [
    "Political Instability",
    "Energy Consumption", 
    "Tourist Arrivals",
    "Tourist Departures"
  ];
  const timeFrames = ["Last Year", "Last 5 Years", "Last 10 Years", "Last 15 Years"];
  const models = ["Linear Regression", "Random Forest"];

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
  }, []);

  const toggleDropdown = (name: string) => {
    setOpenDropdown(openDropdown === name ? null : name);
  };

  const handleIndicatorToggle = (indicator: string) => {
    setSelectedIndicators(prev => 
      prev.includes(indicator) 
        ? prev.filter(i => i !== indicator)
        : [...prev, indicator]
    );
  };

  // Load countries + indicators once
  useEffect(() => {
    const loadMeta = async () => {
      setErrorMsg(null);

      const [{ data: countryData, error: countryErr }, { data: indicatorData, error: indicatorErr }] =
        await Promise.all([
          supabase.from("countries").select("*").order("name"),
          supabase.from("indicators").select("*"),
        ]);

     if (countryErr || indicatorErr) {
  console.error("countriesErr:", countryErr);
  console.error("indicatorsErr:", indicatorErr);
  setErrorMsg(
    (countryErr || indicatorErr)?.message || "Failed to load metadata from database."
  );
  return;
}


      setCountries(countryData || []);
      setIndicators(indicatorData || []);

      if (countryData && countryData.length > 0) {
        setSelectedCountryId(countryData[0].id);
      }
    };

    loadMeta();
  }, []);

  // Load time_series when country changes
  useEffect(() => {
    if (!selectedCountryId) return;

    const loadSeries = async () => {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from("time_series")
        .select("*")
        .eq("country_id", selectedCountryId)
        .order("year", { ascending: true });

      setLoading(false);

      if (error) {
        console.error(error);
        setErrorMsg("Failed to load time series data.");
        setTimeSeries([]);
        return;
      }

      setTimeSeries(data || []);
    };

    loadSeries();
  }, [selectedCountryId]);

  // GDP-only data for chart
  const gdpIndicator = useMemo(
    () => indicators.find((ind) => ind.code === "gdp"),
    [indicators]
  );

  const gdpChartData = useMemo(() => {
    if (!gdpIndicator) return [];

    return timeSeries
      .filter((row) => row.indicator_id === gdpIndicator.id && row.value != null)
      .map((row) => ({
        year: row.year,
        gdp: row.value,
      }));
  }, [timeSeries, gdpIndicator]);

  // Indicators per year table
  const indicatorMap = useMemo(() => {
    const map = new Map<number, Indicator>();
    indicators.forEach((ind) => map.set(ind.id, ind));
    return map;
  }, [indicators]);

  const indicatorTableData = useMemo(() => {
    const yearMap: Record<number, { [indicatorCode: string]: number | null }> =
      {};

    for (const row of timeSeries) {
      const ind = indicatorMap.get(row.indicator_id);
      if (!ind) continue;

      if (!yearMap[row.year]) yearMap[row.year] = {};
      yearMap[row.year][ind.code] = row.value;
    }

    const years = Object.keys(yearMap)
      .map((y) => parseInt(y, 10))
      .sort((a, b) => a - b);

    return years.map((year) => ({
      year,
      values: yearMap[year],
    }));
  }, [timeSeries, indicatorMap]);

  const currentCountry = countries.find((c) => c.id === selectedCountryId);


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
        {/* GDP Subsection */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">GDP Predictor</h1>
          </div>
        </section>

        {/* Dropdown Filters */}
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
              <span className="dropdown-label">{selectedModel || "Prediction Model"}</span>
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
                    className={`dropdown-item ${selectedModel === model ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedModel(model);
                      setOpenDropdown(null);
                    }}
                  >
                    {model}
                  </div>
                ))}
              </div>
            )}
          </div>
          </div>
        </section>

        <section className="section" style={{ paddingTop: "1rem" }}>
          <div className="container">
            <div className="predictor-results" style={{ marginTop: "0" }}>
              <h2 className="section-title" style={{ fontSize: "50px", color: "#093824" }}>
                Results – {selectedCountry}
              </h2>

              {/* Status / errors */}
              {errorMsg && (
                <p style={{ color: "red", marginTop: "0.75rem" }}>{errorMsg}</p>
              )}
              {loading && (
                <p style={{ marginTop: "0.75rem" }}>Loading data…</p>
              )}

              {/* Live GDP Chart */}
              <div
                className="map-placeholder"
                style={{ height: "400px", marginTop: "1.5rem" }}
              >
                {gdpChartData.length === 0 && !loading ? (
                  <p style={{ marginTop: "1rem" }}>
                    No GDP data available yet for this country.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={gdpChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="gdp"
                        name="GDP"
                        stroke="#8884d8"
                        dot={{ r: 3 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>

              {/* Indicators per year table */}
              <div style={{ marginTop: "2.5rem" }}>
                <h3 className="section-title" style={{ fontSize: "36px", color: "#2E5A7F" }}>
                  Indicators per Year – {selectedCountry}
                </h3>

                {indicatorTableData.length === 0 ? (
                  <p style={{ marginTop: "1rem" }}>
                    No indicator data available yet for this country.
                  </p>
                ) : (
                  <div
                    style={{
                      marginTop: "1rem",
                      overflowX: "auto",
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <table
                      style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        minWidth: "700px",
                      }}
                    >
                      <thead>
                        <tr
                          style={{
                            backgroundColor: "#f8fafc",
                            textAlign: "left",
                          }}
                        >
                          <th
                            style={{
                              padding: "0.75rem 1rem",
                              borderBottom: "1px solid #e2e8f0",
                            }}
                          >
                            Year
                          </th>
                          {indicators.map((ind) => (
                            <th
                              key={ind.id}
                              style={{
                                padding: "0.75rem 1rem",
                                borderBottom: "1px solid #e2e8f0",
                                fontSize: "0.85rem",
                              }}
                            >
                              {ind.label}
                              {ind.unit ? ` (${ind.unit})` : ""}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {indicatorTableData.map((row) => (
                          <tr key={row.year}>
                            <td
                              style={{
                                padding: "0.75rem 1rem",
                                borderBottom: "1px solid #e2e8f0",
                                fontWeight: 600,
                              }}
                            >
                              {row.year}
                            </td>
                            {indicators.map((ind) => (
                              <td
                                key={ind.id}
                                style={{
                                  padding: "0.75rem 1rem",
                                  borderBottom: "1px solid #e2e8f0",
                                  fontSize: "0.85rem",
                                }}
                              >
                                {row.values[ind.code] ?? "—"}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* Understanding Your Graph Section */}
        <section className="gdp-subsection" style={{ marginTop: "3rem" }}>
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Understanding Your Graph</h1>
          </div>
        </section>

        {/* White space for future content */}
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
