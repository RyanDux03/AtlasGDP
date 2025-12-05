"use client";

import { useEffect, useMemo, useState, useRef } from "react";
import { supabase } from "@/lib/supabaseClient";
import { indicators as indicatorsData } from "@/data/indicators";
import type { Indicator } from "@/data/indicators";
import GDPChart from "./components/GDPChart";
import IndicatorsTable from "./components/IndicatorsTable";
import Filters from "./components/Filters";
import ModelAccuracyCards from "./components/ModelAccuracyCards";

export default function PredictorPage() {
    type Country = {
    id: number;
    name: string;
    iso_code: string;
  };

  type TimeSeriesRow = {
    id: number;
    country_id: number;
    indicator_id: number;
    year: number;
    value: number | null;
  };

  type PredictionRow = {
    id: number;
    country_id: number;
    indicator_id: number;
    year: number;
    actual_value: number | null;
    predicted_value: number | null;
    is_test: boolean;
    is_forecast: boolean;
  };

  const [countries, setCountries] = useState<Country[]>([]);
  const [selectedCountryId, setSelectedCountryId] = useState<number | null>(
    1 // Default to first country (USA) for faster initial load
  );
  const [timeSeries, setTimeSeries] = useState<TimeSeriesRow[]>([]);
  const [predictions, setPredictions] = useState<PredictionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dropdown states
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [selectedGdpType, setSelectedGdpType] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>("USA");
  const [selectedComposition, setSelectedComposition] = useState<string | null>(null);
  const [selectedIndicators, setSelectedIndicators] = useState<string[]>([]);
  const [selectedTimeFrame, setSelectedTimeFrame] = useState<string | null>(null);
  const [selectedModels, setSelectedModels] = useState<string[]>([]);
  
  // Map display names to indicator codes
  const indicatorCodeMap = useMemo<Record<string, string>>(() => ({
    "Political Instability": "political_stability",
    "Energy Consumption": "energy_use",
    "Tourist Arrivals": "tourism_arrivals",
    "Tourist Departures": "tourism_departures"
  }), []);
  
  // Map composition display names to indicator codes
  const compositionCodeMap = useMemo<Record<string, string[]>>(() => ({
    "All": ["household_consumption", "govt_consumption", "investment"],
    "Consumer Spending": ["household_consumption"],
    "Investment": ["investment"],
    "Government Spending": ["govt_consumption"]
  }), []);

  // Load countries + indicators once
  useEffect(() => {
    const loadMeta = async () => {
      setErrorMsg(null);

      // Simplified - no need for Promise.all with single query
      const { data: countryData, error: countryErr } = await supabase
        .from("countries")
        .select("*")
        .order("name");

      if (countryErr) {
        console.error("countriesErr:", countryErr);
        setErrorMsg(
          countryErr?.message || "Failed to load metadata from database."
        );
        return;
      }

      setCountries(countryData || []);
      
      // Only update if not already set (preserves default)
      if (countryData && countryData.length > 0 && !selectedCountryId) {
        setSelectedCountryId(countryData[0].id);
      }
    };

    loadMeta();
  }, [selectedCountryId]);

  // Cache to prevent redundant data fetches
  const dataCache = useRef<Map<number, { timeSeries: TimeSeriesRow[], predictions: PredictionRow[] }>>(new Map());

  // Load time_series and predictions when country changes
  useEffect(() => {
    if (!selectedCountryId) return;

    // Check cache first
    const cached = dataCache.current.get(selectedCountryId);
    if (cached) {
      setTimeSeries(cached.timeSeries);
      setPredictions(cached.predictions);
      return;
    }

    const loadData = async () => {
      setLoading(true);
      setErrorMsg(null);

      const [timeSeriesResult, predictionsResult] = await Promise.all([
        supabase
          .from("time_series")
          .select("*")
          .eq("country_id", selectedCountryId)
          .order("year", { ascending: true }),
        supabase
          .from("predictions")
          .select("*")
          .eq("country_id", selectedCountryId)
          .order("year", { ascending: true })
      ]);

      setLoading(false);

      if (timeSeriesResult.error) {
        console.error(timeSeriesResult.error);
        setErrorMsg("Failed to load time series data.");
        setTimeSeries([]);
      } else {
        const tsData = timeSeriesResult.data || [];
        setTimeSeries(tsData);
        
        // Cache the results
        const predData = predictionsResult.data || [];
        setPredictions(predData);
        dataCache.current.set(selectedCountryId, { 
          timeSeries: tsData, 
          predictions: predData 
        });
      }

      if (predictionsResult.error) {
        console.error(predictionsResult.error);
      }
    };

    loadData();
  }, [selectedCountryId]);

  // GDP indicator reference
  const gdpIndicator = useMemo(
    () => indicatorsData.find((ind) => ind.code === "gdp"),
    []
  );

  // Combined chart data with all filters applied
  const combinedChartData = useMemo(() => {
    if (!gdpIndicator) return [];

    // Determine which GDP metric to show
    const gdpGrowthIndicator = indicatorsData.find(ind => ind.code === 'gdp_growth');
    const primaryGdpIndicatorId = selectedGdpType === 'GDP Growth Rate' && gdpGrowthIndicator 
      ? gdpGrowthIndicator.id 
      : gdpIndicator.id;
    const primaryGdpCode = selectedGdpType === 'GDP Growth Rate' ? 'gdp_growth' : 'gdp';

    // Get composition codes if composition filter is active
    const compositionCodes = selectedComposition ? compositionCodeMap[selectedComposition] || [] : [];
    const compositionIndicatorObjs = indicatorsData.filter(ind => compositionCodes.includes(ind.code));

    // Get indicator codes for selected indicators
    const selectedCodes = selectedIndicators.map(name => indicatorCodeMap[name]);
    const selectedIndicatorObjs = indicatorsData.filter(ind => selectedCodes.includes(ind.code));

    // Pre-create a Set of all relevant indicator IDs for faster lookup
    const relevantIndicatorIds = new Set([
      primaryGdpIndicatorId,
      ...compositionIndicatorObjs.map(i => i.id),
      ...selectedIndicatorObjs.map(i => i.id)
    ]);

    // Group all data by year
    const yearMap: Record<number, Record<string, number>> = {};

    // Single optimized loop with early filtering
    for (const row of timeSeries) {
      if (row.value == null || !relevantIndicatorIds.has(row.indicator_id)) continue;

      if (!yearMap[row.year]) {
        yearMap[row.year] = { year: row.year } as Record<string, number>;
      }

      // Add primary GDP data
      if (row.indicator_id === primaryGdpIndicatorId) {
        yearMap[row.year][primaryGdpCode] = row.value;
        continue;
      }

      // Add composition data
      const compInd = compositionIndicatorObjs.find(i => i.id === row.indicator_id);
      if (compInd) {
        yearMap[row.year][compInd.code] = row.value;
        continue;
      }

      // Add selected indicator data
      const ind = selectedIndicatorObjs.find(i => i.id === row.indicator_id);
      if (ind) {
        yearMap[row.year][ind.code] = row.value;
      }
    }

    // Add prediction data for GDP from selected models
    // Model indicator IDs: 101=LR, 102=RF, 103=Hybrid
    const modelIndicatorMap: Record<string, number> = {
      'Linear Regression': 101,
      'Random Forest': 102,
      'Hybrid Model': 103
    };

    for (const pred of predictions) {
      // Check if this prediction is from a selected model
      const selectedModelId = selectedModels
        .map(modelName => modelIndicatorMap[modelName])
        .find(id => id === pred.indicator_id);
      
      if (!selectedModelId) continue;
      
      if (!yearMap[pred.year]) {
        yearMap[pred.year] = { year: pred.year } as Record<string, number>;
      }
      
      // Add predicted value with model-specific key
      if (pred.predicted_value != null) {
        const modelName = Object.keys(modelIndicatorMap).find(
          key => modelIndicatorMap[key] === pred.indicator_id
        );
        if (modelName) {
          const modelKey = modelName.replace(' ', '_').toLowerCase();
          yearMap[pred.year][`${primaryGdpCode}_pred_${modelKey}`] = pred.predicted_value;
        }
      }
    }

    let result = Object.values(yearMap).sort((a, b) => a.year - b.year);
    
    // Apply time frame filter
    if (selectedTimeFrame && result.length > 0 && selectedTimeFrame !== 'All Time') {
      const currentYear = Math.max(...result.map(d => d.year));
      let yearsBack = 0;
      
      switch(selectedTimeFrame) {
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
    // When "All Time" is selected, no filtering is applied - show all available years

    return result;
  }, [timeSeries, predictions, gdpIndicator, selectedGdpType, selectedComposition, selectedIndicators, selectedTimeFrame, selectedModels, indicatorCodeMap, compositionCodeMap]);

  // Indicators per year table
  const indicatorMap = useMemo(() => {
    const map = new Map<number, Indicator>();
    indicatorsData.forEach((ind) => map.set(ind.id, ind));
    return map;
  }, []);

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
      <main>
        {/* GDP Subsection */}
        <section className="gdp-subsection">
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">GDP Predictor</h1>
          </div>
        </section>

        {/* Dropdown Filters */}
        <Filters
          openDropdown={openDropdown}
          setOpenDropdown={setOpenDropdown}
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedComposition={selectedComposition}
          setSelectedComposition={setSelectedComposition}
          selectedIndicators={selectedIndicators}
          setSelectedIndicators={setSelectedIndicators}
          selectedTimeFrame={selectedTimeFrame}
          setSelectedTimeFrame={setSelectedTimeFrame}
          selectedModels={selectedModels}
          setSelectedModels={setSelectedModels}
          onCountryChange={(isoCode) => {
            const country = countries.find((c) => c.iso_code === isoCode);
            if (country) {
              setSelectedCountryId(country.id);
            }
          }}
          onReset={() => {
            setSelectedCountry("USA");
            setSelectedComposition(null);
            setSelectedIndicators([]);
            setSelectedTimeFrame(null);
            setSelectedModels([]);
            setOpenDropdown(null);
            // Reset to USA country ID
            const usaCountry = countries.find((c) => c.iso_code === "USA");
            if (usaCountry) {
              setSelectedCountryId(usaCountry.id);
            }
          }}
        />

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
              <GDPChart
                combinedChartData={combinedChartData}
                selectedCountry={selectedCountry}
                selectedGdpType={selectedGdpType}
                selectedComposition={selectedComposition}
                selectedIndicators={selectedIndicators}
                selectedModels={selectedModels}
                loading={loading}
                indicatorCodeMap={indicatorCodeMap}
                compositionCodeMap={compositionCodeMap}
              />
            </div>

          </div>
        </section>

        {/* Understanding Your Graph Section */}
        <section className="gdp-subsection" style={{ marginTop: "3rem" }}>
          <div className="gdp-subsection-rectangle">
            <h1 className="gdp-predictor-title">Understanding Your Graph</h1>
          </div>
        </section>

        {/* Model Accuracy Cards */}
        <section className="section" style={{ paddingTop: "1rem" }}>
          <div className="container">
            <ModelAccuracyCards selectedCountry={selectedCountry} />
          </div>
        </section>

        {/* Indicators per year table with hover tooltips */}
        <IndicatorsTable
          selectedCountry={selectedCountry}
          indicatorTableData={indicatorTableData}
        />
      </main>
    </>
  );
}
