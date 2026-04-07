export type MonthlyData = {
  sums: Float64Array;
  counts: Uint32Array;
};

export type YearlyMap = Map<string, MonthlyData>;
export type FuelMap = Map<string, YearlyMap>;
export type CityMap = Map<string, FuelMap>;

export type ParsedDataset = {
  cities: string[];
  fuels: string[];
  years: string[];
  data: CityMap;
};
