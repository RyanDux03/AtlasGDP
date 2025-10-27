# AtlasGDP
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
—India
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
