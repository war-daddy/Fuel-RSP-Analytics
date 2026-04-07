import { useMemo } from 'react';
import type { ParsedDataset } from '../types';

export const useFilteredData = (
  dataset: ParsedDataset | null,
  city: string,
  fuel: string,
  year: string
) => {
  return useMemo(() => {
    // 12 months array initialized to 0
    const defaultData = new Array(12).fill(0);
    
    if (!dataset || !city || !fuel || !year) return defaultData;

    // O(1) property access / lookup using precompiled deeply nested maps
    const cityMap = dataset.data.get(city);
    if (!cityMap) return defaultData;

    const fuelMap = cityMap.get(fuel);
    if (!fuelMap) return defaultData;

    const yearData = fuelMap.get(year);
    if (!yearData) return defaultData;

    // We have the MonthlyData, now compute averages
    const averages = new Array(12);
    for (let i = 0; i < 12; i++) {
        // Fallback zeros for missing months
        if (yearData.counts[i] === 0) {
            averages[i] = 0;
        } else {
            averages[i] = parseFloat((yearData.sums[i] / yearData.counts[i]).toFixed(2));
        }
    }
    
    return averages;
  }, [dataset, city, fuel, year]);
};
