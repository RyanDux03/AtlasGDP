// app/predictor/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
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
        <section className="section">
          <div className="container">
            <h1 className="section-title">GDP Predictor Tool</h1>
            <p className="section-subtitle">
              Use our predictor tool to explore GDP trends and forecasts for
              different countries. Select a country and model below to get started.
            </p>

            <div className="predictor-controls" style={{ marginTop: "2rem" }}>
              <h2 className="section-title">Select a Country</h2>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", marginTop: "1rem" }}>
                <button className="hero-button">USA</button>
                <button className="hero-button">Germany</button>
                <button className="hero-button">India</button>
                <button className="hero-button">China</button>
                <button className="hero-button">UAE</button>
              </div>
            </div>

            <div className="predictor-models" style={{ marginTop: "2rem" }}>
              <h2 className="section-title">Select a Model</h2>
              <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
                <button className="hero-button">Linear Model</button>
                <button className="hero-button">Random Forest Model</button>
              </div>
            </div>

                        <div className="predictor-results" style={{ marginTop: "3rem" }}>
              <h2 className="section-title">
                Results{" "}
                {currentCountry ? `– ${currentCountry.name}` : ""}
              </h2>

              {/* Country dropdown (DB-driven) */}
              <div style={{ marginTop: "1rem", maxWidth: "320px" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: 500,
                  }}
                >
                  Select a Country (live from DB)
                </label>
                <select
                  className="hero-button"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    borderRadius: "999px",
                    cursor: "pointer",
                  }}
                  value={selectedCountryId ?? ""}
                  onChange={(e) =>
                    setSelectedCountryId(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                >
                  {countries.map((country) => (
                    <option key={country.id} value={country.id}>
                      {country.name} ({country.iso_code})
                    </option>
                  ))}
                </select>
              </div>

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
                <h3 className="section-title" style={{ fontSize: "1.25rem" }}>
                  Indicators per Year{" "}
                  {currentCountry ? `– ${currentCountry.name}` : ""}
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
