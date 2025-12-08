import math
import requests
import pandas as pd

COUNTRIES = {
    "USA": "USA",
    "China": "CHN",
    "India": "IND",
    "Germany": "DEU",
    "United Arab Emirates": "UAE",
}

# Map final column names -> World Bank indicator codes
WB_INDICATORS = {
    "Birth_Rate_per_1000":            "SP.DYN.CBRT.IN",   # births per 1,000 people
    "Energy_Use_kgOE_per_Capita":     "EG.USE.PCAP.KG.OE",
    "population_total":               "SP.POP.TOTL",
    "Literacy_Rate":                  "SE.ADT.LITR.ZS",
    "FDI_Net_Inflows_USD":            "BX.KLT.DINV.CD.WD",
    "Political_Instability":          "PV.EST",           # WGI political stability/absence of violence
    "gdp_usd":                        "NY.GDP.MKTP.CD",   # GDP (current US$)
    "gdp_real_growth_pct":            "NY.GDP.MKTP.KD.ZG",# GDP growth (constant prices, annual %)
    "exports_pct_gdp":                "NE.EXP.GNFS.ZS",   # exports of goods & services (% of GDP)
    "imports_pct_gdp":                "NE.IMP.GNFS.ZS",   # imports of goods & services (% of GDP)
    "gross_capital_form_pct_gdp":     "NE.GDI.TOTL.ZS",   # gross capital formation (% of GDP)
    "household_consump_pct_gdp":      "NE.CON.PRVT.ZS",   # household final consumption (% of GDP)
    "govt_consump_pct_gdp":           "NE.CON.GOVT.ZS",   # gov final consumption (% of GDP)
    "inflation_cpi_pct":              "FP.CPI.TOTL.ZG",   # inflation, consumer prices (annual %)
    "unemployment_pct":               "SL.UEM.TOTL.ZS",   # unemployment, total (% of labor force)
    "population_growth_pct":          "SP.POP.GROW",      # population growth (annual %)
    #"tourism_arrivals":               "ST.INT.ARVL",      # international tourism, arrivals
    #"tourism_departures":             "ST.INT.DPRT",      # international tourism, departures

}

WB_BASE_URL = "https://api.worldbank.org/v2/country/{country}/indicator/{indicator}?format=json&per_page=2000"


# Helper to fetch one indicator
def fetch_indicator(country_code: str, pretty_name: str, indicator_code: str) -> pd.DataFrame:
    """
    Fetches one World Bank indicator for one country.
    Returns DataFrame: Country, Year, <pretty_name>
    """
    url = WB_BASE_URL.format(country=country_code, indicator=indicator_code)
    try:
        payload = requests.get(url, timeout=60).json()
        data = payload[1]
    except Exception as e:
        print(f" Failed to fetch {pretty_name} ({indicator_code}) for {country_code}: {e}")
        return pd.DataFrame()

    rows = []
    for entry in data:
        year_str = entry.get("date")
        value = entry.get("value")

        # WB returns latest-first; we just normalize
        try:
            year = int(year_str)
        except (TypeError, ValueError):
            continue

        rows.append(
            {
                "Country": entry["country"]["value"],
                "Year": year,
                pretty_name: value,
            }
        )

    if not rows:
        return pd.DataFrame()

    df = pd.DataFrame(rows)
    return df


# Build the dataset
def build_dataset() -> pd.DataFrame:
    all_country_frames = []

    for country_name, iso3 in COUNTRIES.items():
        print(f"\n Fetching indicators for {country_name} ({iso3})")

        country_df = None

        for col_name, ind_code in WB_INDICATORS.items():
            print(f"   → {col_name} [{ind_code}]")
            df_ind = fetch_indicator(iso3, col_name, ind_code)
            if df_ind.empty:
                continue

            if country_df is None:
                country_df = df_ind
            else:
                # Outer join to keep all years even if some indicators are missing
                country_df = pd.merge(
                    country_df,
                    df_ind,
                    on=["Country", "Year"],
                    how="outer",
                )

        if country_df is None or country_df.empty:
            print(f" No data collected for {country_name} ({iso3})")
            continue

        # Sort by Year ascending for lag calculations
        country_df = country_df.sort_values("Year").reset_index(drop=True)
        all_country_frames.append(country_df)

    if not all_country_frames:
        raise RuntimeError("No data collected for any country!")

    df = pd.concat(all_country_frames, ignore_index=True)
    # Keep only years >= 1990
    df = df[df["Year"] >= 1990]
    df = df.reset_index(drop=True)


    # Net exports = exports - imports (only if both exist)
    if "exports_pct_gdp" in df.columns and "imports_pct_gdp" in df.columns:
        df["net_exports_pct_gdp"] = df["exports_pct_gdp"] - df["imports_pct_gdp"]
    else:
        df["net_exports_pct_gdp"] = pd.NA

    # Log of GDP (only for positive values, if column exists)
    def safe_log(x):
        if pd.isna(x) or x <= 0:
            return pd.NA
        return math.log(x)

    if "gdp_usd" in df.columns:
        df["gdp_usd_log"] = df["gdp_usd"].apply(safe_log)
    else:
        df["gdp_usd_log"] = pd.NA

    # Lag-1 variables (by Country) — only for columns that actually exist
    lag_bases = [
        "exports_pct_gdp",
        "imports_pct_gdp",
        "gross_capital_form_pct_gdp",
        "household_consump_pct_gdp",
        "govt_consump_pct_gdp",
        "inflation_cpi_pct",
        "unemployment_pct",
        "gdp_real_growth_pct",
    ]

    df = df.sort_values(["Country", "Year"]).reset_index(drop=True)

    for base in lag_bases:
        if base in df.columns:
            lag_col = f"{base}_lag1"
            df[lag_col] = df.groupby("Country")[base].shift(1)
        else:
            # create the lag column with all NA so the schema is stable
            lag_col = f"{base}_lag1"
            df[lag_col] = pd.NA


    # Final column ordering
    final_cols = [
        "Country",
        "Year",
        "Birth_Rate_per_1000",
        "Energy_Use_kgOE_per_Capita",
        "population_total",
        "Literacy_Rate",
        "FDI_Net_Inflows_USD",
        "Political_Instability",
        "gdp_usd",
        "gdp_real_growth_pct",
        "exports_pct_gdp",
        "imports_pct_gdp",
        "gross_capital_form_pct_gdp",
        "household_consump_pct_gdp",
        "govt_consump_pct_gdp",
        "inflation_cpi_pct",
        "unemployment_pct",
        "net_exports_pct_gdp",
        "gdp_usd_log",
        "population_growth_pct",
        #"tourism_arrivals",
        #"tourism_departures",
        
        # Lagged columns
        "exports_pct_gdp_lag1",
        "imports_pct_gdp_lag1",
        "gross_capital_form_pct_gdp_lag1",
        "household_consump_pct_gdp_lag1",
        "govt_consump_pct_gdp_lag1",
        "inflation_cpi_pct_lag1",
        "unemployment_pct_lag1",
        "gdp_real_growth_pct_lag1",
    ]

    # Keep only columns that exist (in case some data is missing for a country)
    final_cols_existing = [c for c in final_cols if c in df.columns]
    df = df[final_cols_existing]

    return df


if __name__ == "__main__":
    df = build_dataset()
    df.to_csv("AtlasGDP_RawData.csv", index=False)
    print("\n AtlasGDP_RawData.csv written with shape:", df.shape)
