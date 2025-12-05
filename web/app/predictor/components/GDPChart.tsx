// app/predictor/GDPChart.tsx
"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

interface GDPChartProps {
  combinedChartData: Array<Record<string, number>>;
  loading: boolean;
  selectedCountry: string;
  selectedGdpType: string | null;
  selectedComposition: string | null;
  selectedIndicators: string[];
  selectedModels: string[];
  compositionCodeMap: Record<string, string[]>;
  indicatorCodeMap: Record<string, string>;
}

export default function GDPChart({
  combinedChartData,
  loading,
  selectedCountry,
  selectedGdpType,
  selectedComposition,
  selectedIndicators,
  selectedModels,
  compositionCodeMap,
  indicatorCodeMap,
}: GDPChartProps) {
  return (
    <div
      style={{ 
        width: "100%",
        maxWidth: "1400px",
        margin: "2rem auto"
      }}
    >
      <h3 style={{ 
        textAlign: 'center', 
        marginBottom: '1.5rem', 
        fontSize: '24px', 
        fontWeight: 600, 
        color: '#2E5A7F' 
      }}>
        {selectedCountry} - {selectedGdpType || 'GDP'} {selectedComposition ? `(${selectedComposition})` : ''} {selectedIndicators.length > 0 || selectedComposition ? 'Over Time' : ''}
      </h3>
      <div style={{ height: "700px" }}>
      {combinedChartData.length === 0 && !loading ? (
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          No data available yet for this country.
        </p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart 
              data={combinedChartData}
              margin={{ top: 20, right: 50, left: 50, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis 
                dataKey="year"
                style={{ fontSize: '14px' }}
                label={{ 
                  value: 'Year', 
                  position: 'insideBottom', 
                  offset: -30,
                  style: { fontSize: '16px', fontWeight: 600, fill: '#2E5A7F' }
                }}
              />
              <YAxis 
                yAxisId="left"
                tickFormatter={(value) => {
                  if (selectedGdpType === 'GDP Growth Rate') {
                    return `${value.toFixed(1)}%`;
                  }
                  // Handle large numbers with scientific notation
                  if (value >= 1e15) {
                    return `$${(value / 1e15).toFixed(1)}Q`;
                  }
                  if (value >= 1e12) {
                    return `$${(value / 1e12).toFixed(1)}T`;
                  }
                  return `$${(value / 1_000_000_000).toFixed(0)}B`;
                }}
                style={{ fontSize: '14px' }}
                width={100}
                label={{ 
                  value: selectedGdpType === 'GDP Growth Rate' ? 'GDP Growth (%)' : 'GDP (USD)', 
                  angle: -90, 
                  position: 'insideLeft',
                  style: { fontSize: '16px', fontWeight: 600, fill: '#2E5A7F' }
                }}
                domain={['auto', 'auto']}
                scale="linear"
              />
              {(selectedIndicators.length > 0 || selectedComposition) && (
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  style={{ fontSize: '14px' }}
                  width={100}
                  label={{ 
                    value: selectedComposition ? '% of GDP' : 'Indicators', 
                    angle: 90, 
                    position: 'insideRight',
                    style: { fontSize: '16px', fontWeight: 600, fill: '#093824' }
                  }}
                />
              )}
              <Tooltip 
                formatter={(value: number, name: string) => {
                  if (name === 'GDP' || name === 'GDP (Predicted)' || name === 'GDP Growth Rate' || name === 'GDP Growth Rate (Predicted)') {
                    if (selectedGdpType === 'GDP Growth Rate') {
                      return [`${value.toFixed(2)}%`, name];
                    }
                    // Handle large numbers
                    if (value >= 1e15) {
                      return [`$${(value / 1e15).toFixed(2)} Quadrillion`, name];
                    }
                    if (value >= 1e12) {
                      return [`$${(value / 1e12).toFixed(2)} Trillion`, name];
                    }
                    return [`$${(value / 1_000_000_000).toFixed(2)} Billion`, name];
                  }
                  if (selectedComposition) {
                    return [`${value.toFixed(2)}%`, name];
                  }
                  return [value.toFixed(2), name];
                }}
                labelFormatter={(label) => `Year: ${label}`}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e2e8f0',
                  borderRadius: '8px',
                  padding: '10px'
                }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey={selectedGdpType === 'GDP Growth Rate' ? 'gdp_growth' : 'gdp'}
                name={selectedGdpType || 'GDP'}
                stroke="#2E5A7F"
                strokeWidth={3}
                dot={{ r: 4, fill: '#2E5A7F', strokeWidth: 0 }}
                activeDot={{ r: 6 }}
              />
              {selectedModels.map((modelName) => {
                const modelKey = modelName.replace(' ', '_').toLowerCase();
                const primaryGdpCode = selectedGdpType === 'GDP Growth Rate' ? 'gdp_growth' : 'gdp';
                const dataKey = `${primaryGdpCode}_pred_${modelKey}`;
                
                // Different colors for each model
                const modelColors = {
                  'Linear Regression': '#000000',
                  'Random Forest': '#FF0000',
                  'Hybrid Model': '#006400'
                };
                const color = modelColors[modelName as keyof typeof modelColors] || '#999';
                
                return (
                  <Line
                    key={modelName}
                    yAxisId="left"
                    type="monotone"
                    dataKey={dataKey}
                    name={`${selectedGdpType || 'GDP'} (${modelName})`}
                    stroke={color}
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={{ r: 3, fill: color, strokeWidth: 0 }}
                    activeDot={{ r: 5 }}
                  />
                );
              })}
              {selectedComposition && (() => {
                const compositionColors: Record<string, string> = {
                  'household_consumption': '#10B981',
                  'govt_consumption': '#F59E0B',
                  'investment': '#8B5CF6',
                  'net_exports': '#EF4444'
                };
                const compositionLabels: Record<string, string> = {
                  'household_consumption': 'Household Consumption',
                  'govt_consumption': 'Government Spending',
                  'investment': 'Investment',
                  'net_exports': 'Net Exports'
                };
                const codes = compositionCodeMap[selectedComposition] || [];
                
                return codes.map((code) => (
                  <Line
                    key={code}
                    yAxisId="right"
                    type="monotone"
                    dataKey={code}
                    name={compositionLabels[code]}
                    stroke={compositionColors[code]}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                ));
              })()}
              {selectedIndicators.map((indicatorName, index) => {
                const code = indicatorCodeMap[indicatorName];
                const colors = ['#093824', '#8B4513', '#9333EA', '#DC2626'];
                const color = colors[index % colors.length];
                return (
                  <Line
                    key={code}
                    yAxisId="right"
                    type="monotone"
                    dataKey={code}
                    name={indicatorName}
                    stroke={color}
                    strokeWidth={2}
                    dot={{ r: 3 }}
                    activeDot={{ r: 5 }}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
          
          {/* Inline Legend */}
          <div style={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: '20px', 
            justifyContent: 'center',
            marginTop: '15px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ 
                width: '30px', 
                height: '3px', 
                backgroundColor: '#2E5A7F',
                borderRadius: '2px'
              }} />
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {selectedGdpType || 'GDP'}
              </span>
            </div>
            {selectedModels.map((modelName) => {
              const modelColors = {
                'Linear Regression': '#000000',
                'Random Forest': '#FF0000',
                'Hybrid Model': '#006400'
              };
              const color = modelColors[modelName as keyof typeof modelColors] || '#999';
              
              return (
                <div key={modelName} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '30px', 
                    height: '3px', 
                    backgroundColor: color,
                    borderRadius: '2px',
                    backgroundImage: `repeating-linear-gradient(90deg, ${color} 0px, ${color} 5px, transparent 5px, transparent 10px)`
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>
                    {selectedGdpType || 'GDP'} ({modelName})
                  </span>
                </div>
              );
            })}
            {selectedComposition && (() => {
              const compositionColors: Record<string, string> = {
                'household_consumption': '#10B981',
                'govt_consumption': '#F59E0B',
                'investment': '#8B5CF6',
                'net_exports': '#EF4444'
              };
              const compositionLabels: Record<string, string> = {
                'household_consumption': 'Household Consumption',
                'govt_consumption': 'Government Spending',
                'investment': 'Investment',
                'net_exports': 'Net Exports'
              };
              const codes = compositionCodeMap[selectedComposition] || [];
              
              return codes.map((code) => (
                <div key={code} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '30px', 
                    height: '2px', 
                    backgroundColor: compositionColors[code],
                    borderRadius: '2px'
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color: compositionColors[code] }}>
                    {compositionLabels[code]}
                  </span>
                </div>
              ));
            })()}
            {selectedIndicators.map((indicatorName, index) => {
              const colors = ['#093824', '#8B4513', '#9333EA', '#DC2626'];
              const color = colors[index % colors.length];
              return (
                <div key={indicatorName} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ 
                    width: '30px', 
                    height: '2px', 
                    backgroundColor: color,
                    borderRadius: '2px'
                  }} />
                  <span style={{ fontSize: '14px', fontWeight: 600, color }}>
                    {indicatorName}
                  </span>
                </div>
              );
            })}
          </div>
        </>
      )}
      </div>
    </div>
  );
}
