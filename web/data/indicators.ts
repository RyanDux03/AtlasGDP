// data/indicators.ts

export type IndicatorCode =
  | "gdp"
  | "gdp_growth"
  | "population"
  | "energy_use"
  | "political_stability"
  | "exports_pct_gdp"
  | "imports_pct_gdp"
  | "inflation"
  | "unemployment"
  | "birth_rate"
  | "fdi"
  | "literacy_rate"
  | "tourism_arrivals"
  | "tourism_departures"
  | "household_consumption"
  | "govt_consumption"
  | "investment"
  | "net_exports";

export interface Indicator {
  id: number;
  code: IndicatorCode;
  label: string;
  unit: string | null;
  short: string; // for tooltips (your "nicer" definitions)
  long: string;  // for landing page / deep explanation
}

export const indicators: Indicator[] = [
  {
    id: 1,
    code: "gdp",
    label: "GDP",
    unit: "USD (billions)",
    short:
      "The total monetary value of all goods and services produced within a country. Measured in billions of US dollars (USD). Higher GDP indicates a larger economy.",
    long:
      "Gross Domestic Product (GDP) is the total monetary value of all goods and services produced within a country's borders in a given year. It is a broad measure of economic size and strength. Higher GDP usually indicates a larger, more productive economy, but it does not show how evenly income is distributed or how affordable life is for citizens.",
  },
  {
    id: 2,
    code: "gdp_growth",
    label: "GDP Growth Rate",
    unit: "%",
    short:
      "The annual percentage increase or decrease in GDP. Positive values indicate economic expansion, while negative values suggest contraction.",
    long:
      "GDP growth rate shows how quickly a country's economic output is changing compared to the previous year. Positive values signal economic expansion, supporting jobs and incomes. Negative values indicate slowdown or recession risk. Very high or volatile growth can also reflect instability or unsustainable booms.",
  },
  {
    id: 3,
    code: "population",
    label: "Population",
    unit: null,
    short:
      "Total number of people living in the country. A larger population can contribute to economic growth through workforce and consumer demand.",
    long:
      "Population measures how many people live in a country. Larger populations can support bigger labor forces and consumer markets, boosting economic potential. However, rapid population growth can strain housing, healthcare, education, and infrastructure if investment does not keep up.",
  },
  {
    id: 4,
    code: "energy_use",
    label: "Energy Use",
    unit: "kg oil equivalent per capita",
    short:
      "Energy consumption per capita measured in kilograms of oil equivalent. Higher values often correlate with industrialization and development.",
    long:
      "Energy use per capita captures how much energy the average person in a country consumes, expressed in kilograms of oil equivalent. Higher usage often reflects industrial activity, technology, and higher living standards, but may also point to inefficiency or heavy reliance on fossil fuels.",
  },
  {
    id: 5,
    code: "political_stability",
    label: "Political Stability Index",
    unit: null,
    short:
      "An index measuring the likelihood of political instability or violence. Higher stability typically supports economic growth and foreign investment.",
    long:
      "The political stability index estimates the risk of political instability, unrest, or violence in a country. Higher scores indicate a more stable environment, which tends to attract investment, tourism, and long-term planning. Lower scores can discourage investors and disrupt normal economic activity.",
  },
  {
    id: 6,
    code: "exports_pct_gdp",
    label: "Exports (% of GDP)",
    unit: "%",
    short:
      "The value of goods and services sold to other countries, expressed as a percentage of GDP. Indicates trade openness.",
    long:
      "Exports as a share of GDP show how much of a country's economic output comes from selling goods and services abroad. High export ratios suggest strong integration into global trade and often reflect competitive industries. However, export-dependent economies can be vulnerable to global demand shocks.",
  },
  {
    id: 7,
    code: "imports_pct_gdp",
    label: "Imports (% of GDP)",
    unit: "%",
    short:
      "The value of goods and services bought from other countries, expressed as a percentage of GDP. Indicates trade dependence.",
    long:
      "Imports as a share of GDP show how reliant a country is on foreign goods and services. High import shares can signal strong consumer demand or limited domestic production. While imports can boost welfare by providing cheaper or better goods, excessive dependence may expose the economy to supply chain disruptions or currency swings.",
  },
  {
    id: 8,
    code: "inflation",
    label: "Inflation Rate",
    unit: "%",
    short:
      "The rate at which prices for goods and services rise, measured by the Consumer Price Index. Moderate inflation is normal; high inflation can harm purchasing power.",
    long:
      "Inflation measures how quickly prices for a broad basket of goods and services are rising over time. Moderate, stable inflation is typical of healthy economies. High or unpredictable inflation erodes purchasing power, makes planning difficult, and can destabilize financial systems.",
  },
  {
    id: 9,
    code: "unemployment",
    label: "Unemployment Rate",
    unit: "%",
    short:
      "Percentage of the labor force that is jobless and actively seeking employment. Lower rates generally indicate a healthier economy.",
    long:
      "The unemployment rate tracks the share of people in the labor force who do not have a job but are actively looking for one. Low unemployment usually signals strong job creation and economic health. Persistently high unemployment can indicate structural problems, such as skills mismatches or weak demand.",
  },
  {
    id: 10,
    code: "birth_rate",
    label: "Birth Rate",
    unit: "per 1,000 people",
    short:
      "Number of live births per 1,000 people. Affects population growth, workforce size, and long-term economic planning.",
    long:
      "Birth rate measures how many live births occur each year per 1,000 people. It shapes long-term population trends and future labor supply. Very low birth rates can lead to aging populations and pressure on pension systems, while very high rates may strain education, housing, and healthcare.",
  },
  {
    id: 11,
    code: "fdi",
    label: "Foreign Direct Investment",
    unit: "USD",
    short:
      "Net inflows of investment from foreign entities in USD. Higher FDI indicates investor confidence and can boost economic development.",
    long:
      "Foreign Direct Investment (FDI) records net investment from foreign companies and individuals into domestic businesses and assets. Strong FDI can bring capital, technology, and management expertise, supporting growth and jobs. Heavy reliance on FDI, however, can leave economies exposed to changes in global investor sentiment.",
  },
  {
    id: 12,
    code: "literacy_rate",
    label: "Literacy Rate",
    unit: "%",
    short:
      "Percentage of the population that can read and write. Higher literacy supports economic productivity and innovation.",
    long:
      "Literacy rate is the share of people, typically aged 15 and older, who can read and write a simple statement. High literacy underpins skills development, innovation, and effective participation in modern economies. Low literacy often correlates with poverty and limited economic opportunity.",
  },
  {
    id: 13,
    code: "tourism_arrivals",
    label: "Tourism Arrivals",
    unit: null,
    short:
      "Number of international visitors entering the country. Tourism contributes to GDP and cultural exchange.",
    long:
      "Tourism arrivals count how many non-residents visit a country in a given year. Tourism can be a major source of jobs, foreign exchange, and local business activity. Sudden drops in arrivals, such as during crises, can quickly hurt economies that rely heavily on tourism.",
  },
  {
    id: 14,
    code: "tourism_departures",
    label: "Tourism Departures",
    unit: null,
    short:
      "Number of citizens traveling abroad. Reflects disposable income and global connectivity.",
    long:
      "Tourism departures measure how many residents travel abroad each year. Rising departures often reflect higher incomes, easier travel, and greater global connectedness. A high gap between departures and arrivals may also hint at relative attractiveness of the domestic tourism industry.",
  },
  {
    id: 15,
    code: "household_consumption",
    label: "Household Consumption",
    unit: "%",
    short:
      "Consumer spending as a percentage of GDP. Major driver of economic activity in most countries.",
    long:
      "Household consumption shows how much households spend on goods and services relative to total GDP. In many economies, it is the largest single driver of demand. Weak consumption can signal low confidence or stagnant incomes, while strong consumption typically supports business revenues and employment.",
  },
  {
    id: 16,
    code: "govt_consumption",
    label: "Government Consumption",
    unit: "%",
    short:
      "Government spending on goods and services as a percentage of GDP. Reflects public sector size and fiscal policy.",
    long:
      "Government consumption captures how much the public sector spends on goods and services, such as public salaries, defense, and operations. Higher levels imply a larger government role in the economy. Well-targeted spending can support growth and social outcomes; poorly targeted or excessive spending can strain budgets.",
  },
  {
    id: 17,
    code: "investment",
    label: "Investment (Gross Capital Formation)",
    unit: "%",
    short:
      "Gross capital formation (investment in fixed assets) as a percentage of GDP. Critical for long-term economic growth.",
    long:
      "Investment, or gross capital formation, tracks how much is spent on fixed assets like buildings, machinery, and infrastructure relative to GDP. Strong investment supports future productivity and competitiveness. Prolonged weak investment may signal uncertainty and can limit long-term growth potential.",
  },
  {
    id: 18,
    code: "net_exports",
    label: "Net Exports",
    unit: "%",
    short:
      "Exports minus imports as a percentage of GDP. Positive values indicate trade surplus, negative values indicate trade deficit.",
    long:
      "Net exports measure the balance between what a country sells abroad and what it buys from other countries, expressed as a share of GDP. A surplus means exports exceed imports; a deficit means the opposite. Surpluses can support currency strength and domestic industry, while large, persistent deficits may raise concerns about external debt and competitiveness.",
  },
];
