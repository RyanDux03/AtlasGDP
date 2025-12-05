import pandas as pd
from pandas_datareader import wb

countries = {
    "Saudi Arabia": "SAU",
    "Japan": "JPN"
}

indicator = "PV.EST"

for country, code in countries.items():
    print(f"Downloading Political Instability data for {country}...")

    data = wb.download(indicator=indicator, country=code, start=1990, end=2023)
    data = data.reset_index()
    data.columns = ["Country", "Year", "Political_Instability"]

    file_name = f"{code}_PoliticalInstability.xlsx"
    data.to_excel(file_name, index=False)

    print(f"Saved: {file_name}")
