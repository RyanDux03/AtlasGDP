import pandas as pd
from pandas_datareader import wb

countries = {
    "Saudi Arabia": "SAU",
    "Japan": "JPN"
}

indicator = "SE.ADT.LITR.ZS"

for country, code in countries.items():
    print(f"Downloading Literacy Rate data for {country}...")

    data = wb.download(indicator=indicator, country=code, start=1990, end=2023)
    data = data.reset_index()
    data.columns = ["Country", "Year", "Literacy_Rate"]

    file_name = f"{code}_LiteracyRate.xlsx"
    data.to_excel(file_name, index=False)

    print(f"Saved: {file_name}")
