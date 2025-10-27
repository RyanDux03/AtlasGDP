# Atlas GDP Project Analyzing Global GDP-Related Indicators Across Countries

## Project Overview
AtlasGDP is a specialized project focused on developing a customized tool for GDP prediction and comparative economic analysis across various global countries. 
By integrating Machine Learning (ML) with a diverse panel of past economic data, the project aims to produce predictive insights and deliver them through a user-friendly web interface.

The core objectives of the AtlasGDP project include <ins>the development of the prediction tool, the creation of the interactive web interface featuring graphs and filtering options </ins>, and the production of a detailed final report. 
This system is designed to allow users to select specific countries and time spans for granular GDP analysis and comparison.

The modeling approach utilizes three common ML models frequently employed in economic forecasting to compare their predictive accuracy: **a traditional linear regression model** for time series data, **a Random Forest model** for indicator prediction, and a **hybrid model** combining the two for performance enhancement. 
A key research aim is to verify existing literature suggesting that model performance varies significantly based on specific economic factors.

**Seven non-standard factors** were selected to predict GDP trends, including:
- political instability
- direct foreign investment
- literacy rate
- country age
- birth rates
- environmental factors
- population

Data extraction focuses on **nine countries**
— India
- Germany
- Venezuela
- Russia
- Japan
- South Africa
- Ukraine
- Saudi Arabia
- Jamaica

The web interface will facilitate user visualization of GDP trends through *line and bar graphs*, supported by various filters.
A crucial feature ensures data integrity by *disabling (graying out) filters* for economic factors where specific data is *unavailable* for a chosen country.
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
The project connects to the IMF and World Bank to:
- Collect reliable international data from World Bank Open Data.
- Clean, structure, and prepare datasets for further analysis.
- Compare patterns between developed and developing economies.
- Visualize findings to support insights into global GDP trends.
  
| Factor              | Indicator Code        | Description |
| ----         |     -----          |          ---- |
| Political Stability | PV.EST                | Measures political stability and absence of violence/terrorism    |                     
| Energy Use per Capita| EG.USE.PCAP.KG.OE    | Total energy consumption per person (kg of oil equivalent)     |



## Setting Up Environment

**disclaimer: the current set up indicates data processing for 3 countries: USA, India, Germany. please update accordingly.**

Install dependencies: 
```pip install pandas requests openpyxl```

Create a file named 
```fetch_data.py``` 

Run:
```import requests import pandas as pd```

Define indicators and countries
```
indicators = {
"political_stability": "PV.EST", 
"energy_use_pc": "EG.USE.PCAP.KG.OE" 
} 
countries = ["IN", "US", "DE"]
```


Fetch data from World Bank
```
def fetch_data(indicator):
url = f"http://api.worldbank.org/v2/country/{';'.join(countries)}/indicator/{indicator}?format=json&per_page=2000"
data = requests.get(url).json()[1] df = pd.DataFrame(data)
df = df[["countryiso3code", "country", "date", "value"]]
df.columns = ["country_code", "country_name", "year", "value"]
df["indicator"] = indicator
return df
```

Merge datasets
```
frames = [fetch_data(code) for code in indicators.values()]
merged_df = pd.concat(frames)
merged_df.to_csv("AtlasGDP_RawData.csv", index=False)
print(" Data saved successfully!")
```

Run it in your terminal
```python fetch_data.py```

Data Cleaning for visualization
```import pandas as pd```

```
df = pd.read_csv("AtlasGDP_RawData.csv")
df.dropna(inplace=True) df.to_csv("AtlasGDP_CleanData.csv", index=False)
print(" Clean dataset ready!")
```

The output file:
**AtlasGDP_CleanData.csv**

Prepared by:
Yousuf Stanikzay Database & Data Management Lead Atlas GDP Team Project
