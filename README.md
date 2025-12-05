# Atlas GDP Project Analyzing Global GDP-Related Indicators Across Countries

## Project Overview
AtlasGDP is a specialized project focused on developing a customized tool for GDP prediction and comparative economic analysis across various global countries. 
By integrating Machine Learning (ML) with a diverse panel of past economic data, the project aims to produce predictive insights and deliver them through a user-friendly web interface.

The core objectives of the AtlasGDP project include <ins>the development of the prediction tool, the creation of the interactive web interface featuring graphs and filtering options </ins>, and the production of a detailed final report. 
This system is designed to allow users to select specific countries and time spans for granular GDP analysis and comparison.

The modeling approach utilizes three common ML models frequently employed in economic forecasting to compare their predictive accuracy: **a traditional linear regression model** for time series data, **a Random Forest model** for indicator prediction, and a **hybrid model** combining the two for performance enhancement. 
A key research aim is to verify existing literature suggesting that model performance varies significantly based on specific economic factors.

**Six non-standard factors** alongside **GDP** data were selected to predict GDP trends, including:
- political stability
- tourism (arrival and departure)
- literacy rate
- energy use
- birth rates
- population

Data extraction focuses on **five countries from year 1990 to present**:
- India
- Germany
- USA
- China
- United Arab Emirates

The baseline features establish a robust predictor by including:
- the three ML models for accuracy comparison
- the interactive web interface, country and indicator-based filters, and multiple graph types.

Upon successful completion, stretch goals will significantly enhance the tool's analytical depth. 
These goals include split-view graph comparisons and expanded filtering capabilities based on GDP types (Real, Nominal, Per Capita, etc.) and GDP Composition (Net exports, Government Spending, etc.). Further expansion may incorporate sentiment analysis and real-time news updates to provide a uniquely comprehensive GDP analysis tool that exceeds the depth of typical research projects.

## Tech Stack
- Python – Data collection and cleaning
- Pandas – Data manipulation and analysis
- Requests – Accessing the World Bank API
- OpenPyXL / CSV – Data storage and export
- GitHub – Version control and team collaboration
- World Bank Open Data – Main data source


## Project Details and Goals
The project connects to the IMF, UNESCO World Bank to:
- Collect reliable international data from World Bank Open Data.
- Clean, structure, and prepare datasets for further analysis.
- Compare patterns between developed and developing economies.
- Visualize findings to support insights into global GDP trends.
  
| Factor              | Indicator Code        | Description |
| ----         |     -----          |          ---- |
| Political Stability | PV.EST                | Measures political stability and absence of violence/terrorism    |                     
| Energy Use per Capita| EG.USE.PCAP.KG.OE    | Total energy consumption per person (kg of oil equivalent)     |



## Setting Up Environment
If needing virtual environment:
```
source venv/bin/activate
```

Install dependencies: 

```
pip install pandas requests openpyxl
```

Navigate to correct directory:
```
cd data_gather
```

Create a file to capture extraction method

```
touch fetch_data.py
``` 

In fetch_data.py, fill: 
```
import requests
import pandas as pd
countries = {
    "USA": "USA",
    "China": "CHN",
    "India": "IND",
    "Germany": "DEU",
    "United Arab Emirates": "UAE",
}

indicators = {
    "Birth_Rate_per_1000":       "SP.DYN.CBRT.IN",
    "Energy_Use_kgOE_per_Capita": "EG.USE.PCAP.KG.OE",
    "population_total":          "SP.POP.TOTL",
    "Literacy_Rate":             "SE.ADT.LITR.ZS",
    "FDI_Net_Inflows_USD":       "BX.KLT.DINV.CD.WD",
    "Political_Instability":     "PV.EST",
    "gdp_usd":                   "NY.GDP.MKTP.CD"
}

def fetch_indicator(iso3, column_name, indicator_code):
    url = f"https://api.worldbank.org/v2/country/{iso3}/indicator/{indicator_code}?format=json&per_page=2000"

    try:
        response = requests.get(url).json()[1]
    except Exception:
        print(f" Failed to fetch {column_name} for {iso3}")
        return pd.DataFrame()

    rows = []
    for entry in response:
        rows.append({
            "Country": entry["country"]["value"],
            "Year": int(entry["date"]),
            column_name: entry["value"]
        })

    return pd.DataFrame(rows)


all_frames = []

for name, iso3 in countries.items():
    print(f" Fetching all indicators for {name} ({iso3}) ...")

    # Start with a base dataframe of Year & Country (from first indicator)
    base_df = None

    for column_name, indicator_code in indicators.items():
        print(f"   → {column_name} ({indicator_code})")

        df = fetch_indicator(iso3, column_name, indicator_code)

        if df.empty:
            continue

        if base_df is None:
            base_df = df
        else:
            base_df = pd.merge(base_df, df, on=["Country", "Year"], how="outer")

    all_frames.append(base_df)

# Final merged dataframe for all countries
merged_df = pd.concat(all_frames, ignore_index=True)

# Sort nicely
merged_df = merged_df.sort_values(["Country", "Year"], ascending=[True, False])

# Save output
merged_df.to_csv("AtlasGDP_RawData.csv", index=False)
print("\n Data saved successfully to AtlasGDP_RawData.csv")

```

Run it in terminal
```
python fetch_data.py
```

The output file:
**AtlasGDP_CleanData.csv**

Prepared by:
Yousuf Stanikzay Database & Data Management Lead Atlas GDP Team Project

Finalized by:
Annie Nguyen 🫰
