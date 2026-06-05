/* ============================================================
 * Demo Dashboard — app.js
 * All data is MOCK / demo data. Replace the DATA objects below
 * with real API calls (see README for guidance).
 * ============================================================ */

'use strict';

// ── Tab switching ─────────────────────────────────────────────
(function initTabs() {
  const buttons = document.querySelectorAll('.tab-btn');
  const panels  = document.querySelectorAll('.tab-panel');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      buttons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => p.classList.remove('active'));

      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      document.getElementById('panel-' + target).classList.add('active');
    });
  });
})();


// ── ① WEATHER ────────────────────────────────────────────────
/*
 * To use live data: replace WEATHER_DATA with a fetch() call to
 * the OpenWeatherMap API (https://openweathermap.org/api).
 * Example: GET https://api.openweathermap.org/data/2.5/weather
 *          ?q={city}&units=metric&appid={YOUR_API_KEY}
 */
const WEATHER_DATA = [
  { city: 'New York',    emoji: '⛅', temp: 18, desc: 'Partly cloudy', humidity: 62, wind: 14 },
  { city: 'London',      emoji: '🌧️', temp: 12, desc: 'Light rain',    humidity: 80, wind: 20 },
  { city: 'Tokyo',       emoji: '☀️', temp: 26, desc: 'Sunny',          humidity: 55, wind: 8  },
  { city: 'Sydney',      emoji: '🌤️', temp: 22, desc: 'Mostly sunny',   humidity: 58, wind: 18 },
  { city: 'Paris',       emoji: '🌦️', temp: 15, desc: 'Showers',        humidity: 74, wind: 16 },
  { city: 'Dubai',       emoji: '☀️', temp: 38, desc: 'Hot & sunny',    humidity: 30, wind: 12 },
  { city: 'Toronto',     emoji: '❄️', temp:  3, desc: 'Snow flurries',  humidity: 70, wind: 22 },
  { city: 'São Paulo',   emoji: '⛈️', temp: 23, desc: 'Thunderstorms',  humidity: 85, wind: 10 },
];

(function renderWeather() {
  const grid = document.getElementById('weather-cards');
  grid.innerHTML = WEATHER_DATA.map(w => `
    <div class="weather-card">
      <div class="weather-city">${w.city}</div>
      <div class="weather-icon">${w.emoji}</div>
      <div class="weather-temp">${w.temp}°C</div>
      <div class="weather-desc">${w.desc}</div>
      <div class="weather-details">
        <span>💧 ${w.humidity}%</span>
        <span>💨 ${w.wind} km/h</span>
      </div>
    </div>
  `).join('');
})();


// ── ② MSFT STOCK ─────────────────────────────────────────────
/*
 * To use live data: replace STOCK_DATA with a fetch() call to
 * Alpha Vantage (https://www.alphavantage.co/documentation/) or
 * Polygon.io (https://polygon.io/).
 * Example: GET https://www.alphavantage.co/query
 *          ?function=TIME_SERIES_DAILY&symbol=MSFT&apikey={YOUR_KEY}
 *
 * Prices are in USD.  The data below covers 30 mock trading days.
 */
const STOCK_DATA = (function generateMockMSFT() {
  // Realistic-ish MSFT prices around ~$415–$440 range
  const baseDate = new Date('2025-04-01');
  const entries = [];
  let close = 425.50;
  const days = 30;
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() - i * 1); // skip weekends for realism
    // Skip Sat/Sun
    if (d.getDay() === 0) d.setDate(d.getDate() + 1);
    if (d.getDay() === 6) d.setDate(d.getDate() + 2);

    const change = (Math.random() - 0.47) * 6; // slight upward bias
    const open   = +(close + (Math.random() - 0.5) * 2).toFixed(2);
    close        = +(close + change).toFixed(2);
    const high   = +(Math.max(open, close) + Math.random() * 3).toFixed(2);
    const low    = +(Math.min(open, close) - Math.random() * 3).toFixed(2);
    entries.push({
      date:   d.toISOString().slice(0, 10),
      open,
      high,
      low,
      close,
      change: +change.toFixed(2),
    });
  }
  return entries;
})();

(function renderStock() {
  const latest = STOCK_DATA[STOCK_DATA.length - 1];
  const prev   = STOCK_DATA[STOCK_DATA.length - 2];
  const pctChg = (((latest.close - prev.close) / prev.close) * 100).toFixed(2);
  const isPos  = latest.change >= 0;
  const arrow  = isPos ? '▲' : '▼';
  const cls    = isPos ? 'positive' : 'negative';

  // Summary cards
  document.getElementById('stock-summary').innerHTML = `
    <div class="stock-stat">
      <div class="stock-stat-label">Last Price</div>
      <div class="stock-stat-value">$${latest.close.toFixed(2)}</div>
    </div>
    <div class="stock-stat">
      <div class="stock-stat-label">Day Change</div>
      <div class="stock-stat-value ${cls}">${arrow} $${Math.abs(latest.change).toFixed(2)}</div>
    </div>
    <div class="stock-stat">
      <div class="stock-stat-label">Change %</div>
      <div class="stock-stat-value ${cls}">${arrow} ${Math.abs(pctChg)}%</div>
    </div>
    <div class="stock-stat">
      <div class="stock-stat-label">Day High</div>
      <div class="stock-stat-value">$${latest.high.toFixed(2)}</div>
    </div>
    <div class="stock-stat">
      <div class="stock-stat-label">Day Low</div>
      <div class="stock-stat-value">$${latest.low.toFixed(2)}</div>
    </div>
    <div class="stock-stat">
      <div class="stock-stat-label">Open</div>
      <div class="stock-stat-value">$${latest.open.toFixed(2)}</div>
    </div>
  `;

  // SVG sparkline chart
  renderStockChart();

  // Table (newest first)
  const tbody = document.getElementById('stock-tbody');
  const rows  = [...STOCK_DATA].reverse();
  tbody.innerHTML = rows.map(r => {
    const c = r.change >= 0 ? 'positive' : 'negative';
    const a = r.change >= 0 ? '▲' : '▼';
    return `<tr>
      <td>${r.date}</td>
      <td>$${r.open.toFixed(2)}</td>
      <td>$${r.high.toFixed(2)}</td>
      <td>$${r.low.toFixed(2)}</td>
      <td>$${r.close.toFixed(2)}</td>
      <td class="${c}">${a} $${Math.abs(r.change).toFixed(2)}</td>
    </tr>`;
  }).join('');
})();

function renderStockChart() {
  const svg    = document.getElementById('stock-chart');
  const W = 700, H = 260, PAD = { top: 20, right: 20, bottom: 40, left: 60 };
  const plotW  = W - PAD.left - PAD.right;
  const plotH  = H - PAD.top  - PAD.bottom;
  const prices = STOCK_DATA.map(d => d.close);
  const labels = STOCK_DATA.map(d => d.date.slice(5)); // MM-DD
  const minP   = Math.min(...prices) - 2;
  const maxP   = Math.max(...prices) + 2;
  const n      = prices.length;

  function scaleX(i)  { return PAD.left + (i / (n - 1)) * plotW; }
  function scaleY(v)  { return PAD.top  + plotH - ((v - minP) / (maxP - minP)) * plotH; }

  // Build polyline points
  const pts = prices.map((p, i) => `${scaleX(i).toFixed(1)},${scaleY(p).toFixed(1)}`).join(' ');

  // Build area path
  const areaPath = `M${scaleX(0)},${scaleY(prices[0])} ` +
    prices.map((p, i) => `L${scaleX(i).toFixed(1)},${scaleY(p).toFixed(1)}`).join(' ') +
    ` L${scaleX(n-1)},${PAD.top + plotH} L${scaleX(0)},${PAD.top + plotH} Z`;

  // Y-axis ticks (5 levels)
  const yTicks = Array.from({ length: 5 }, (_, i) => {
    const v = minP + ((maxP - minP) * i / 4);
    return { v, y: scaleY(v) };
  });

  // X-axis labels (every ~6 days)
  const xStep  = Math.ceil(n / 6);
  const xTicks = prices.map((_, i) => i).filter(i => i % xStep === 0 || i === n - 1);

  svg.innerHTML = `
    <defs>
      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stop-color="#0078d4" stop-opacity="0.25"/>
        <stop offset="100%" stop-color="#0078d4" stop-opacity="0"/>
      </linearGradient>
    </defs>

    <!-- Grid lines -->
    ${yTicks.map(t => `<line x1="${PAD.left}" y1="${t.y.toFixed(1)}" x2="${PAD.left + plotW}" y2="${t.y.toFixed(1)}" stroke="#e2e8f0" stroke-width="1"/>`).join('')}

    <!-- Area fill -->
    <path d="${areaPath}" fill="url(#areaGrad)"/>

    <!-- Price line -->
    <polyline points="${pts}" fill="none" stroke="#0078d4" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>

    <!-- Y-axis labels -->
    ${yTicks.map(t => `<text x="${PAD.left - 6}" y="${(t.y + 4).toFixed(1)}" text-anchor="end" font-size="11" fill="#6b7280">$${t.v.toFixed(0)}</text>`).join('')}

    <!-- X-axis labels -->
    ${xTicks.map(i => `<text x="${scaleX(i).toFixed(1)}" y="${(PAD.top + plotH + 18).toFixed(1)}" text-anchor="middle" font-size="10" fill="#6b7280">${labels[i]}</text>`).join('')}

    <!-- Tooltip dot on last point -->
    <circle cx="${scaleX(n-1).toFixed(1)}" cy="${scaleY(prices[n-1]).toFixed(1)}" r="4" fill="#0078d4"/>
  `;
}


// ── ③ WORLD NEWS ─────────────────────────────────────────────
/*
 * To use live data: replace NEWS_DATA with a fetch() call to
 * NewsAPI (https://newsapi.org/) or GNews (https://gnews.io/).
 * Example: GET https://newsapi.org/v2/top-headlines
 *          ?language=en&apiKey={YOUR_API_KEY}
 *
 * Note: Most free-tier news APIs require a server-side proxy for
 * CORS reasons; consider using Azure Static Web Apps API routes
 * (functions/) to proxy the request.
 */
const NEWS_DATA = [
  {
    category: 'Technology',
    headline: 'Global AI Summit Sets New Frameworks for Responsible Artificial Intelligence',
    source: 'Tech Times',
    time: '2 hours ago',
    summary: 'World leaders and technology executives gathered to agree on a landmark set of guidelines governing the development and deployment of large-scale AI systems.',
  },
  {
    category: 'Economy',
    headline: 'IMF Raises Global Growth Forecast Amid Easing Inflation Pressures',
    source: 'Financial Post',
    time: '4 hours ago',
    summary: 'The International Monetary Fund upgraded its 2025 global growth projection to 3.2%, citing improved supply-chain conditions and falling consumer prices in major economies.',
  },
  {
    category: 'Science',
    headline: 'Scientists Achieve Record Efficiency in Next-Generation Solar Cells',
    source: 'Science Daily',
    time: '6 hours ago',
    summary: 'Researchers report a perovskite solar cell that converts 33.7% of sunlight into electricity — surpassing the previous record and edging closer to theoretical limits.',
  },
  {
    category: 'Health',
    headline: 'WHO Approves New Malaria Vaccine for Children Under Five',
    source: 'Global Health News',
    time: '8 hours ago',
    summary: 'The World Health Organization has granted approval to a second-generation malaria vaccine showing 78% efficacy in clinical trials across sub-Saharan Africa.',
  },
  {
    category: 'Climate',
    headline: 'Arctic Sea Ice Reaches Record Low for Third Consecutive Year',
    source: 'Environment Monitor',
    time: '10 hours ago',
    summary: 'Satellite data reveals that Arctic sea-ice extent hit its lowest recorded summer minimum for the third year running, alarming climate scientists worldwide.',
  },
  {
    category: 'Space',
    headline: 'NASA Confirms Water Ice Discovery in Permanently Shadowed Lunar Craters',
    source: 'Space Wire',
    time: '12 hours ago',
    summary: 'Data from the Lunar Reconnaissance Orbiter confirms significant water-ice deposits near the Moon\'s south pole, boosting prospects for a sustained human presence on the Moon.',
  },
  {
    category: 'Politics',
    headline: 'G7 Nations Pledge $50 Billion Package to Accelerate Clean Energy Transition',
    source: 'World Report',
    time: '14 hours ago',
    summary: 'Leaders of the Group of Seven industrialised nations unveiled a coordinated financing plan to help developing countries phase out coal and expand renewable energy capacity.',
  },
  {
    category: 'Sports',
    headline: 'FIFA Announces Expanded 48-Team World Cup Format for 2030 Tournament',
    source: 'Sports Global',
    time: '16 hours ago',
    summary: 'Football\'s governing body confirmed that the 2030 World Cup will span three continents and feature 48 national teams, the largest edition in the tournament\'s history.',
  },
];

(function renderNews() {
  const list = document.getElementById('news-list');
  list.innerHTML = NEWS_DATA.map((item, idx) => `
    <article class="news-card">
      <div class="news-index">${String(idx + 1).padStart(2, '0')}</div>
      <div class="news-body">
        <span class="news-category">${item.category}</span>
        <div class="news-headline">${item.headline}</div>
        <p class="news-meta">${item.source} &bull; ${item.time}</p>
        <p class="news-meta" style="margin-top:6px;color:#4b5563;">${item.summary}</p>
      </div>
    </article>
  `).join('');
})();
