# ⛽ Fuel RSP Analytics Dashboard

**🚀 Live Website:** [https://fuel-rsp-analytics.vercel.app/](https://fuel-rsp-analytics.vercel.app/)

A high-performance, strictly typed React application built to visualize the monthly average Retail Selling Price (RSP) for Petrol and Diesel across Metro Cities in India. 

## 🏗️ Architecture & Processing Logic

1. **Custom O(n) Dataset Processor**: We wrote a custom CSV parser in `utils/dataProcessor.ts` to ensure 0 external third-party data processing library dependencies (no Lodash, no PapaParse constraints strictly met). It tokenizes values flawlessly and avoids mapping the massive array twice.
2. **Deep Map Data Structure**: `Map<City, Map<Fuel, Map<Year, MonthlyData>>>` gives exactly $O(1)$ query capability from the Dropdown selectors straight to the graph. The dataset computes exactly once during `useEffect()`. 
3. **ECharts Native implementation**: Implemented raw DOM-bound `echarts` logic using a clean ref hook bypassing wrapping libraries for memory safety and strict component lifecycle disposal.
4. **Premium Aesthetics**: Utilized modern glassmorphic overlays and vanilla CSS to give a Staff-level frontend sheen over the data.

## 🛠 Tech Stack

- **React 19 & TypeScript**: Strict generic typings configured with Verbatim Module boundaries.
- **Vite Setup**: Extremely fast minimal HMR loading.
- **Apache ECharts**: Raw high-performance canvas rendering.

## 🚀 Setup Instructions

```bash
# Install dependencies via Yarn
yarn install

# Run the development server precisely as constraint requested
yarn dev

# Compile TypeScript and build for production verification
yarn tsc && yarn build
```

## 📂 Folder Structure

```
src/
├── components/
│    ├── Dropdown.tsx
│    ├── Chart.tsx
├── hooks/
│    ├── useFilteredData.ts
├── utils/
│    ├── dataProcessor.ts
│    ├── constants.ts
├── types/
│    ├── index.ts
├── App.tsx
├── main.tsx
```

## 📸 Screenshots

<p align="center">
  <img src="./public/screenshots/desktop-view.png" alt="Desktop View" width="800" />
</p>
<p align="center">
  <img src="./public/screenshots/mobile-view.png" alt="Mobile View" width="800" />
</p>


