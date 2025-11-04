# AtlasGDP Data Collection Scripts

This repository contains Python scripts used to collect and preprocess economic factor data for the **AtlasGDP project**.  
The goal is to gather country-specific indicators to predict GDP using machine learning models.


AtlasGDP/
├── DataScripts/ # Python scripts to download raw data
│ ├── get_tourism_data.py
│ ├── get_fdi_data.py
│ ├── get_political_instability.py
│ └── get_literacy_rate.py
├── RawData/ # Raw Excel/CSV files downloaded from World Bank
├── CleanedData/ # Cleaned & preprocessed data files
├── README.md # This file


---

## 🛠 Scripts Overview

| Script | Description | Output Files |
|--------|-------------|--------------|
| `get_tourism_data.py` | Downloads **International Tourist Arrivals** for selected countries | `tourism_Saudi_Arabia.xlsx`, `tourism_Japan.xlsx` |
| `get_fdi_data.py` | Downloads **Foreign Direct Investment (FDI Net Inflows)** | `Saudi_Arabia_FDI.xlsx`, `Japan_FDI.xlsx` |
| `get_political_instability.py` | Downloads **Political Stability / Instability index** | `SAU_PoliticalInstability.xlsx`, `JPN_PoliticalInstability.xlsx` |
| `get_literacy_rate.py` | Downloads **Adult Literacy Rate (%)** | `SAU_LiteracyRate.xlsx`, `JPN_LiteracyRate.xlsx` |

---

## How to Run the code:

1. Make sure you have Python installed (Python ≥ 3.11 recommended).  
2. Install required packages:

```bash
pip install pandas pandas-datareader openpyxl requests

Navigate to the DataScripts folder: FYI) whereever you saved your code just navigate to that folder
For example in my PC this is how I go to my file. cd C:\Python313\CS4385-Project\DataScripts

Run each script:
python get_tourism_data.py
python get_fdi_data.py
python get_political_instability.py
python get_literacy_rate.py

Check the output files in the same folder — they will be saved as Excel files for each country.


Notes

Missing Data: Some indicators (e.g., literacy rate for Japan) may not have values in certain years. These can be filled manually or during preprocessing.

Country Codes: Saudi Arabia = SAU, Japan = JPN.

Data Source: All data is collected from the World Bank API

## Thank you for payting attentyion.
