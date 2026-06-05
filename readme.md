# Demo Dashboard — Multi-Tab Static Web App

A multi-tab dashboard built with **vanilla JavaScript, HTML, and CSS** — no frameworks, no build step.  
Deployed as an [Azure Static Web App](https://docs.microsoft.com/azure/static-web-apps/overview).

---

## Tabs / Pages

| Tab | Description |
|-----|-------------|
| ⛅ **Weather** | Current weather conditions for 8 major cities worldwide (temperature, humidity, wind speed). |
| 📈 **MSFT Stock** | Microsoft (MSFT) 30-day price trend with an SVG sparkline chart, key statistics, and a sortable data table. |
| 📰 **World News** | Top world news headlines across technology, economy, science, health, climate, space, politics, and sports. |

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (any recent LTS version)
- `npm` (bundled with Node.js)

### Install dependencies

```bash
npm install
```

### Run locally

```bash
npm start
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Project Structure

```
src/
├── index.html   # App shell with tab navigation and panel markup
├── styles.css   # All styling (CSS variables, responsive grid, cards)
└── app.js       # Tab logic + mock data rendering for all three tabs
readme.md
package.json
```

---

## Data & APIs

All data shown in the dashboard is **mock / demo data** hard-coded in `src/app.js`.  
The comments in `app.js` document exactly where and how to swap in real API calls.

### Connecting live APIs (optional)

| Tab | Suggested API | Notes |
|-----|---------------|-------|
| Weather | [OpenWeatherMap](https://openweathermap.org/api) | Free tier available. Replace `WEATHER_DATA` in `app.js` with a `fetch()` call to `/data/2.5/weather?q={city}&appid={KEY}`. |
| Stock | [Alpha Vantage](https://www.alphavantage.co/) or [Polygon.io](https://polygon.io/) | Free tier available. Replace `STOCK_DATA` with a `fetch()` to the `TIME_SERIES_DAILY` endpoint. |
| News | [NewsAPI](https://newsapi.org/) or [GNews](https://gnews.io/) | Free tier available. **CORS note:** most news APIs block browser requests — use [Azure Static Web Apps API routes](https://docs.microsoft.com/azure/static-web-apps/add-api) (Azure Functions) as a server-side proxy. |

> **Security reminder:** Never commit API keys to source control.  
> Store them in environment variables or [Azure Static Web Apps application settings](https://docs.microsoft.com/azure/static-web-apps/application-settings).

---

## Dev Container

This repo includes a dev container configuration (`.devcontainer/`).  
Open it in a [GitHub Codespace](https://github.com/features/codespaces) or with  
[VS Code Remote – Containers](https://code.visualstudio.com/docs/remote/containers) and all dependencies will be installed automatically.

---

## Deployment

Push to the configured branch and [Azure Static Web Apps](https://docs.microsoft.com/azure/static-web-apps/overview) will build and deploy automatically.  
No build step is required — the `src/` directory is served directly.
