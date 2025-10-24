Atlas GDP Project
Analyzing Global GDP-Related Indicators Across Countries

Project Overview

Atlas GDP is a data-driven research and visualization project designed to explore how different economic, political, and environmental factors influence a country’s GDP performance.
The project focuses on data collection, analysis, and visualization using international economic indicators.

This semester, our team selected India, Germany, and the United States to compare two major indicators:

Political Instability (Political Stability Index)

Environmental Impact (Energy Use per Capita)

The project connects to the IMF and World Bank frameworks, emphasizing the relationship between governance, sustainability, and economic development.

Project Goals:

Collect reliable international data from World Bank Open Data.

Clean, structure, and prepare datasets for further analysis.

Compare patterns between developed and developing economies.

Visualize findings to support insights into global GDP trends.

 Team Roles
Role	in Team Responsibility:
Database Lead	Yousuf Stanikzay	Managing data collection, storage, and team task monitoring

Technical Tools:
Python – Data collection and cleaning

Pandas – Data manipulation and analysis

Requests – Accessing the World Bank API

OpenPyXL / CSV – Data storage and export

GitHub – Version control and team collaboration

World Bank Open Data – Main data source

Indicators Used
Factor	Indicator Code	Description
Political Stability	PV.EST	Measures political stability and absence of violence/terrorism
Energy Use per Capita	EG.USE.PCAP.KG.OE	Total energy consumption per person (kg of oil equivalent)
 
Countries Selected
Country	ISO Code
India	IN
Germany	DE
United States	US
 Data Collection Process
1. Setting Up Environment

Install dependencies:
pip install pandas requests openpyxl

2. Running the Script

Create a file named fetch_data.py and run the script below:
import requests
import pandas as pd

# Define indicators and countries
indicators = {
    "political_stability": "PV.EST",
    "energy_use_pc": "EG.USE.PCAP.KG.OE"
}
countries = ["IN", "US", "DE"]

# Fetch data from World Bank
def fetch_data(indicator):
    url = f"http://api.worldbank.org/v2/country/{';'.join(countries)}/indicator/{indicator}?format=json&per_page=2000"
    data = requests.get(url).json()[1]
    df = pd.DataFrame(data)
    df = df[["countryiso3code", "country", "date", "value"]]
    df.columns = ["country_code", "country_name", "year", "value"]
    df["indicator"] = indicator
    return df

# Merge datasets
frames = [fetch_data(code) for code in indicators.values()]
merged_df = pd.concat(frames)
merged_df.to_csv("AtlasGDP_RawData.csv", index=False)
print(" Data saved successfully!")

Run it in your terminal:
python fetch_data.py

Data Cleaning
To prepare clean data for visualization:
import pandas as pd

df = pd.read_csv("AtlasGDP_RawData.csv")
df.dropna(inplace=True)
df.to_csv("AtlasGDP_CleanData.csv", index=False)
print(" Clean dataset ready!")

The output file:
AtlasGDP_CleanData.csv

Project File Structure
Atlas-GDP/
│
├── data/
│   ├── AtlasGDP_RawData.csv
│   ├── AtlasGDP_CleanData.csv
│
├── scripts/
│   ├── fetch_data.py
│   ├── clean_data.py
│
├── README.md
└── requirements.txt


Performance Metrics:

We’ll know our project is successful if:

Data from all three countries is collected, cleaned, and validated.

The visualization dashboard accurately displays both factors (Political and Environmental).

Work is completed on time and aligns with the semester’s goals.

Evaluation:

Project success will be evaluated based on:

Data accuracy and source credibility (World Bank).

Proper documentation and reproducibility of results.

Effective collaboration and version control using GitHub.

Final presentation clarity and insight quality.


References:

World Bank Open Data

IMF Data Portal

Python Pandas Documentation

Prepared by:

Yousuf Stanikzay
Database & Data Management Lead
Atlas GDP Team Project

