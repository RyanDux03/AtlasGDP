import requests
import pandas as pd

countries = {
    "Saudi_Arabia": "SAU",
    "Japan": "JPN"
}

indicator = "ST.INT.ARVL"  # International tourist arrivals indicator

for country, code in countries.items():
    url = f"https://api.worldbank.org/v2/country/{code}/indicator/{indicator}?format=json&per_page=5000"

    response = requests.get(url).json()

    # Convert to dataframe
    data = []
    for entry in response[1]:
        data.append({
            "Country": entry["country"]["value"],
            "Year": entry["date"],
            "Tourist Arrivals": entry["value"]
        })

    df = pd.DataFrame(data)
    df.to_excel(f"tourism_{country}.xlsx", index=False)

print("✅ Tourism data downloaded successfully!")
