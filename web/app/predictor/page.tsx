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

  const gdpTypes = ["Overall GDP", "GDP Growth Rate"];
  const countriesList = ["USA", "China", "Germany", "India", "UAE"];

  // Map ISO codes to display names
  const countryIsoMap: Record<string, string> = {
    "USA": "USA",
    "China": "CHN",
    "Germany": "DEU",
    "India": "IND",
    "UAE": "UAE"
  };
  const compositionList = ["All", "Consumer Spending", "Investment", "Government Spending", "Net Exports"];
  const indicatorsList = [
    "Political Instability",
    "Energy Consumption", 
    "Tourist Arrivals",
    "Tourist Departures"
  ];
  
  // Map display names to indicator codes
  const indicatorCodeMap = useMemo<Record<string, string>>(() => ({
    "Political Instability": "political_stability",
    "Energy Consumption": "energy_use",
    "Tourist Arrivals": "tourism_arrivals",
    "Tourist Departures": "tourism_departures"
  }), []);
  
  // Map composition display names to indicator codes
  const compositionCodeMap = useMemo<Record<string, string[]>>(() => ({
    "All": ["household_consumption", "govt_consumption", "investment", "net_exports"],
    "Consumer Spending": ["household_consumption"],
    "Investment": ["investment"],
    "Government Spending": ["govt_consumption"],
    "Net Exports": ["net_exports"]
  }), []);
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

  // GDP indicator reference
  const gdpIndicator = useMemo(
    () => indicators.find((ind) => ind.code === "gdp"),
    [indicators]
  );

  // Combined chart data with all filters applied
  const combinedChartData = useMemo(() => {
    if (!gdpIndicator) return [];

    // Determine which GDP metric to show
    const gdpGrowthIndicator = indicators.find(ind => ind.code === 'gdp_growth');
    const primaryGdpIndicatorId = selectedGdpType === 'GDP Growth Rate' && gdpGrowthIndicator 
      ? gdpGrowthIndicator.id 
      : gdpIndicator.id;
    const primaryGdpCode = selectedGdpType === 'GDP Growth Rate' ? 'gdp_growth' : 'gdp';

    // Get composition codes if composition filter is active
    const compositionCodes = selectedComposition ? compositionCodeMap[selectedComposition] || [] : [];
    const compositionIndicatorObjs = indicators.filter(ind => compositionCodes.includes(ind.code));

    // Get indicator codes for selected indicators
    const selectedCodes = selectedIndicators.map(name => indicatorCodeMap[name]);
    const selectedIndicatorObjs = indicators.filter(ind => selectedCodes.includes(ind.code));

    // Group all data by year
    const yearMap: Record<number, Record<string, number>> = {};

    for (const row of timeSeries) {
      if (row.value == null) continue;

      // Add primary GDP data (overall or growth)
      if (row.indicator_id === primaryGdpIndicatorId) {
        if (!yearMap[row.year]) {
          yearMap[row.year] = { year: row.year } as Record<string, number>;
        }
        yearMap[row.year][primaryGdpCode] = row.value;
      }

      // Add composition data
      const compInd = compositionIndicatorObjs.find(i => i.id === row.indicator_id);
      if (compInd) {
        if (!yearMap[row.year]) {
          yearMap[row.year] = { year: row.year } as Record<string, number>;
        }
        yearMap[row.year][compInd.code] = row.value;
      }

      // Add selected indicator data
      const ind = selectedIndicatorObjs.find(i => i.id === row.indicator_id);
      if (ind) {
        if (!yearMap[row.year]) {
          yearMap[row.year] = { year: row.year } as Record<string, number>;
        }
        yearMap[row.year][ind.code] = row.value;
      }
    }

    let result = Object.values(yearMap).sort((a, b) => a.year - b.year);
    
    // Apply time frame filter
    if (selectedTimeFrame && result.length > 0) {
      const currentYear = Math.max(...result.map(d => d.year));
      let yearsBack = 0;
      
      switch(selectedTimeFrame) {
        case 'Last Year':
          yearsBack = 1;
          break;
        case 'Last 5 Years':
          yearsBack = 5;
          break;
        case 'Last 10 Years':
          yearsBack = 10;
          break;
        case 'Last 15 Years':
          yearsBack = 15;
          break;
      }
      
      if (yearsBack > 0) {
        result = result.filter(d => d.year >= currentYear - yearsBack + 1);
      }
    }

    return result;
  }, [timeSeries, gdpIndicator, selectedGdpType, selectedComposition, selectedIndicators, selectedTimeFrame, indicators, indicatorCodeMap, compositionCodeMap]);

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
                      // Find the country ID from the countries list and update it
                      const isoCode = countryIsoMap[country];
                      const foundCountry = countries.find(c => c.iso_code === isoCode);
                      if (foundCountry) {
                        setSelectedCountryId(foundCountry.id);
                      }
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

              {/* Combined GDP and Indicators Chart */}
              <div
                style={{ 
                  width: "100%",
                  maxWidth: "1400px",
                  margin: "2rem auto"
                }}
              >
                <h3 style={{ 
                  textAlign: 'center', 
                  marginBottom: '1.5rem', 
                  fontSize: '24px', 
                  fontWeight: 600, 
                  color: '#2E5A7F' 
                }}>
                  {selectedCountry} - {selectedGdpType || 'GDP'} {selectedComposition ? `(${selectedComposition})` : ''} {selectedIndicators.length > 0 || selectedComposition ? 'Over Time' : ''}
                </h3>
                <div style={{ height: "700px" }}>
                {combinedChartData.length === 0 && !loading ? (
                  <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    No data available yet for this country.
                  </p>
                ) : (
                  <>
                    <ResponsiveContainer width="100%" height="85%">
                      <LineChart 
                        data={combinedChartData}
                        margin={{ top: 20, right: 50, left: 50, bottom: 60 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis 
                          dataKey="year"
                          style={{ fontSize: '14px' }}
                          label={{ 
                            value: 'Year', 
                            position: 'insideBottom', 
                            offset: -30,
                            style: { fontSize: '16px', fontWeight: 600, fill: '#2E5A7F' }
                          }}
                        />
                        <YAxis 
                          yAxisId="left"
                          tickFormatter={(value) => {
                            if (selectedGdpType === 'GDP Growth Rate') {
                              return `${value.toFixed(1)}%`;
                            }
                            return `$${(value / 1_000_000_000).toFixed(0)}B`;
                          }}
                          style={{ fontSize: '14px' }}
                          width={100}
                          label={{ 
                            value: selectedGdpType === 'GDP Growth Rate' ? 'GDP Growth (%)' : 'GDP (USD)', 
                            angle: -90, 
                            position: 'insideLeft',
                            style: { fontSize: '16px', fontWeight: 600, fill: '#2E5A7F' }
                          }}
                        />
                        {(selectedIndicators.length > 0 || selectedComposition) && (
                          <YAxis 
                            yAxisId="right"
                            orientation="right"
                            style={{ fontSize: '14px' }}
                            width={100}
                            label={{ 
                              value: selectedComposition ? '% of GDP' : 'Indicators', 
                              angle: 90, 
                              position: 'insideRight',
                              style: { fontSize: '16px', fontWeight: 600, fill: '#093824' }
                            }}
                          />
                        )}
                        <Tooltip 
                          formatter={(value: number, name: string) => {
                            if (name === 'GDP' || name === 'GDP Growth Rate') {
                              if (selectedGdpType === 'GDP Growth Rate') {
                                return [`${value.toFixed(2)}%`, name];
                              }
                              return [`$${(value / 1_000_000_000).toFixed(2)} Billion`, name];
                            }
                            if (selectedComposition) {
                              return [`${value.toFixed(2)}%`, name];
                            }
                            return [value.toFixed(2), name];
                          }}
                          labelFormatter={(label) => `Year: ${label}`}
                          contentStyle={{
                            backgroundColor: 'white',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            padding: '10px'
                          }}
                        />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey={selectedGdpType === 'GDP Growth Rate' ? 'gdp_growth' : 'gdp'}
                          name={selectedGdpType || 'GDP'}
                          stroke="#2E5A7F"
                          strokeWidth={3}
                          dot={{ r: 4, fill: '#2E5A7F', strokeWidth: 0 }}
                          activeDot={{ r: 6 }}
                        />
                        {selectedComposition && (() => {
                          const compositionColors: Record<string, string> = {
                            'household_consumption': '#10B981',
                            'govt_consumption': '#F59E0B',
                            'investment': '#8B5CF6',
                            'net_exports': '#EF4444'
                          };
                          const compositionLabels: Record<string, string> = {
                            'household_consumption': 'Household Consumption',
                            'govt_consumption': 'Government Spending',
                            'investment': 'Investment',
                            'net_exports': 'Net Exports'
                          };
                          const codes = compositionCodeMap[selectedComposition] || [];
                          
                          return codes.map((code) => (
                            <Line
                              key={code}
                              yAxisId="right"
                              type="monotone"
                              dataKey={code}
                              name={compositionLabels[code]}
                              stroke={compositionColors[code]}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          ));
                        })()}
                        {selectedIndicators.map((indicatorName, index) => {
                          const code = indicatorCodeMap[indicatorName];
                          const colors = ['#093824', '#8B4513', '#9333EA', '#DC2626'];
                          const color = colors[index % colors.length];
                          return (
                            <Line
                              key={code}
                              yAxisId="right"
                              type="monotone"
                              dataKey={code}
                              name={indicatorName}
                              stroke={color}
                              strokeWidth={2}
                              dot={{ r: 3 }}
                              activeDot={{ r: 5 }}
                            />
                          );
                        })}
                      </LineChart>
                    </ResponsiveContainer>
                    
                    {/* Inline Legend */}
                    <div style={{ 
                      display: 'flex', 
                      flexWrap: 'wrap', 
                      gap: '20px', 
                      justifyContent: 'center',
                      marginTop: '15px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ 
                          width: '30px', 
                          height: '3px', 
                          backgroundColor: '#2E5A7F',
                          borderRadius: '2px'
                        }} />
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#2E5A7F' }}>
                          {selectedGdpType || 'GDP'}
                        </span>
                      </div>
                      {selectedComposition && (() => {
                        const compositionColors: Record<string, string> = {
                          'household_consumption': '#10B981',
                          'govt_consumption': '#F59E0B',
                          'investment': '#8B5CF6',
                          'net_exports': '#EF4444'
                        };
                        const compositionLabels: Record<string, string> = {
                          'household_consumption': 'Household Consumption',
                          'govt_consumption': 'Government Spending',
                          'investment': 'Investment',
                          'net_exports': 'Net Exports'
                        };
                        const codes = compositionCodeMap[selectedComposition] || [];
                        
                        return codes.map((code) => (
                          <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '30px', 
                              height: '2px', 
                              backgroundColor: compositionColors[code],
                              borderRadius: '2px'
                            }} />
                            <span style={{ fontSize: '14px', fontWeight: 600, color: compositionColors[code] }}>
                              {compositionLabels[code]}
                            </span>
                          </div>
                        ));
                      })()}
                      {selectedIndicators.map((indicatorName, index) => {
                        const colors = ['#093824', '#8B4513', '#9333EA', '#DC2626'];
                        const color = colors[index % colors.length];
                        return (
                          <div key={indicatorName} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ 
                              width: '30px', 
                              height: '2px', 
                              backgroundColor: color,
                              borderRadius: '2px'
                            }} />
                            <span style={{ fontSize: '14px', fontWeight: 600, color }}>
                              {indicatorName}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
                </div>
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
                            {indicators.map((ind) => {
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
                                  ind.code === "literacy_rate"
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
                                    borderBottom: "1px solid #e2e8f0",
                                    fontSize: "0.85rem",
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
            </div>

          </div>
        </section>

        {/* Understanding Your Graph Section */}
        <section className="gdp-subsection" style={{ marginTop: "3rem" }}>
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Understanding Your Graph</h1>
          </div>
        </section>

        {/* Indicator Explanations */}
        <section className="section" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
          <div className="container">
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: "1.5rem",
              marginTop: "1rem"
            }}>
              {/* GDP */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Gross Domestic Product (GDP)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  The total monetary value of all goods and services produced within a country. 
                  Measured in billions of US dollars (USD). Higher GDP indicates a larger economy.
                </p>
              </div>

              {/* GDP Growth Rate */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  GDP Growth Rate (%)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  The annual percentage increase or decrease in GDP. Positive values indicate economic 
                  expansion, while negative values suggest contraction.
                </p>
              </div>

              {/* Population */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Population
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Total number of people living in the country. A larger population can contribute 
                  to economic growth through workforce and consumer demand.
                </p>
              </div>

              {/* Energy Use */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Energy Use
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Energy consumption per capita measured in kilograms of oil equivalent. 
                  Higher values often correlate with industrialization and development.
                </p>
              </div>

              {/* Political Stability */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Political Stability
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  An index measuring the likelihood of political instability or violence. 
                  Higher stability typically supports economic growth and foreign investment.
                </p>
              </div>

              {/* Exports & Imports */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Exports & Imports (% of GDP)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  The value of goods and services sold to (exports) or bought from (imports) other countries, 
                  expressed as a percentage of GDP. Indicates trade openness.
                </p>
              </div>

              {/* Inflation */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Inflation (CPI %)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  The rate at which prices for goods and services rise, measured by the Consumer Price Index. 
                  Moderate inflation is normal; high inflation can harm purchasing power.
                </p>
              </div>

              {/* Unemployment */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Unemployment Rate (%)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Percentage of the labor force that is jobless and actively seeking employment. 
                  Lower rates generally indicate a healthier economy.
                </p>
              </div>

              {/* Birth Rate */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Birth Rate
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Number of live births per 1,000 people. Affects population growth, 
                  workforce size, and long-term economic planning.
                </p>
              </div>

              {/* FDI */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Foreign Direct Investment (FDI)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Net inflows of investment from foreign entities in USD. Higher FDI indicates 
                  investor confidence and can boost economic development.
                </p>
              </div>

              {/* Literacy Rate */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Literacy Rate (%)
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Percentage of the population that can read and write. Higher literacy supports 
                  economic productivity and innovation.
                </p>
              </div>

              {/* Tourism */}
              <div style={{ 
                padding: "1.5rem", 
                backgroundColor: "#f8fafc", 
                borderRadius: "12px",
                border: "1px solid #e2e8f0"
              }}>
                <h3 style={{ color: "#2E5A7F", fontSize: "1.25rem", marginBottom: "0.5rem" }}>
                  Tourism Arrivals & Departures
                </h3>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  Number of international visitors entering (arrivals) or citizens traveling abroad (departures). 
                  Tourism contributes to GDP and cultural exchange.
                </p>
              </div>
            </div>
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
