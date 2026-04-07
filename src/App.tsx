import { useEffect, useState } from 'react';
import { parseCSV } from './utils/dataProcessor';
import { useFilteredData } from './hooks/useFilteredData';
import type { ParsedDataset } from './types';
import { Dropdown } from './components/Dropdown';
import { Chart } from './components/Chart';

function App() {
  const [dataset, setDataset] = useState<ParsedDataset | null>(null);
  
  // Controlled Selectors
  const [selectedCity, setSelectedCity] = useState<string>('');
  const [selectedFuel, setSelectedFuel] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  // Fetch data on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/data/dataset.csv');
        if (!response.ok) throw new Error("Failed to fetch data");
        const csvText = await response.text();
        
        // Single pass O(n) parse
        const parsed = parseCSV(csvText);
        setDataset(parsed);

        // Pre-select defaults
        if (parsed.cities.length > 0) setSelectedCity(parsed.cities[0]);
        if (parsed.fuels.length > 0) setSelectedFuel(parsed.fuels[0]);
        if (parsed.years.length > 0) setSelectedYear(parsed.years[0]);
      } catch (err) {
        console.error("Error loading CSV: ", err);
        setError(true);
      }
    };
    loadData();
  }, []);

  // Fast O(1) query hook mapping state perfectly
  const chartData = useFilteredData(dataset, selectedCity, selectedFuel, selectedYear);

  if (error) {
    return (
      <div className="loading-state">
        <h2 style={{ color: '#ef4444' }}>Failed to load data. Please refresh.</h2>
      </div>
    );
  }

  if (!dataset) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <h2 style={{ color: '#94a3b8' }}>Processing Dataset...</h2>
      </div>
    );
  }

  return (
    <div className="app-container">
      <header className="header">
        <h1>Fuel RSP Analytics</h1>
        <p>Monthly Average Retail Selling Price across Metro Cities</p>
      </header>

      <main>
        <section className="controls-panel">
          <Dropdown
            label="City"
            options={dataset.cities}
            value={selectedCity}
            onChange={setSelectedCity}
          />
          <Dropdown
            label="Fuel Type"
            options={dataset.fuels}
            value={selectedFuel}
            onChange={setSelectedFuel}
          />
          <Dropdown
            label="Year"
            options={dataset.years}
            value={selectedYear}
            onChange={setSelectedYear}
          />
        </section>

        <section className="chart-panel">
          <Chart 
            data={chartData} 
            title={`${selectedFuel} RSP in ${selectedCity} (${selectedYear})`}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
