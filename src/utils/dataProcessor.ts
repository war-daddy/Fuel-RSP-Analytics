import type { CityMap, ParsedDataset } from '../types';

export const parseCSV = (csvText: string): ParsedDataset => {
  const cityMap: CityMap = new Map();
  const cities = new Set<string>();
  const fuels = new Set<string>();
  const years = new Set<string>();

  // Use a custom O(n) line and char level parser to bypass strict constraint on external parsing libraries.
  let currentWord = '';
  let inQuotes = false;
  const cols: string[] = [];

  // Parse into lines manually or via indexOf to avoid splitting the whole string into massive arrays 
  // if memory was a super strict concern, but since JS can handle 2MB via split smoothly, we'll split by newline.
  const lines = csvText.trim().split('\n');

  // Skip header line
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (!line) continue;

    cols.length = 0; // Clear without allocating new array
    currentWord = '';
    inQuotes = false;

    // Fast inline CSV tokenization
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        cols.push(currentWord);
        currentWord = '';
      } else {
        currentWord += char;
      }
    }
    cols.push(currentWord);

    if (cols.length < 7) continue;

    // 3: Calendar Day (YYYY-MM-DD), 4: Fuel, 5: City, 6: RSP
    const calDay = cols[3];
    const fuel = cols[4];
    const city = cols[5];
    const rspStr = cols[6];

    if (!calDay || !fuel || !city || !rspStr) continue;

    const parts = calDay.split('-');
    if (parts.length < 3) continue;

    const year = parts[0];
    const monthStr = parts[1];
    
    // Quick parse: integer parsing is faster than parseInt via multiplying in JS if we trust format,
    // but parseInt is safer. Subtract 1 for 0-indexed months.
    const month = parseInt(monthStr, 10) - 1; 

    // Handle RSP empty or invalid
    let rsp = parseFloat(rspStr);
    if (isNaN(rsp)) rsp = 0; // Constraint: Missing values MUST be treated as 0

    cities.add(city);
    fuels.add(fuel);
    years.add(year);

    // Deep mapping allocation O(1) ops
    let fuelMap = cityMap.get(city);
    if (!fuelMap) {
      fuelMap = new Map();
      cityMap.set(city, fuelMap);
    }

    let yearMap = fuelMap.get(fuel);
    if (!yearMap) {
      yearMap = new Map();
      fuelMap.set(fuel, yearMap);
    }

    let monthlyData = yearMap.get(year);
    if (!monthlyData) {
      monthlyData = { sums: new Float64Array(12), counts: new Uint32Array(12) };
      yearMap.set(year, monthlyData);
    }

    monthlyData.sums[month] += rsp;
    monthlyData.counts[month] += 1;
  }

  // Pre-sort dropdown options for consistent UI representation
  return {
    cities: Array.from(cities).sort(),
    fuels: Array.from(fuels).sort(),
    years: Array.from(years).sort((a, b) => b.localeCompare(a)), // Newest year first
    data: cityMap,
  };
};
