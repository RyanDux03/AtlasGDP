import pandas as pd

# World Bank API base URL
base_url = "https://api.worldbank.org/v2/country/{}/indicator/{}?downloadformat=excel"

# Countries and output filenames
countries = {
    "SAU": "Saudi_Arabia_FDI.xlsx",
    "JPN": "Japan_FDI.xlsx"
}

indicator = "BX.KLT.DINV.CD.WD"  # FDI Net Inflows (current USD)

# Loop to download and save data
for code, filename in countries.items():
    url = base_url.format(code, indicator)
    df = pd.read_excel(url, sheet_name="Data", skiprows=3)

    # Keep only the useful columns (years + description)
    df_clean = df[["Country Name", "Country Code", "Indicator Name", "Indicator Code"] + list(df.columns[4:])]
    df_clean.to_excel(filename, index=False)

    print(f"✅ FDI data downloaded for {code} and saved as {filename}")
