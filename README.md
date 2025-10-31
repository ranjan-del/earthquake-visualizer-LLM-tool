# 🌎 Earthquake Visualizer

**Earthquake Visualizer** is a full-stack web app that displays real-time earthquake data from the [USGS Earthquake API](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) on an interactive map.  
It automatically detects your location, highlights nearby earthquake activity, and classifies your region’s risk level as **Green**, **Yellow**, or **Red** based on proximity and magnitude.  

Built using **React**, **Vite**, **Tailwind CSS**, **React Leaflet**, and **Firebase Hosting**.

---

## 🚀 Live Demo
👉 [View the deployed app](https://earthquake-visualizer.web.app/)  

---

## ✨ Features

- 🗺️ **Interactive Map** – Real-time global earthquake data visualized with Leaflet.
- 📍 **Automatic Geolocation** – Detects user location and highlights it on the map.
- 🔴 **Risk Indicator** – Displays All Clear / Caution / High Alert based on earthquakes within 10–50 km.
- 📊 **Filter Panel** – Filter by time window (hour/day/week), magnitude, and radius.
- 📋 **Half-Screen Info Panel** – Toggleable panel showing recent earthquakes with sorting (Newest / Strongest / Closest).
- 🔎 **Details Drawer** – Click any event marker to see full details (magnitude, depth, time, USGS link).
- 🧠 **“Why this status?” LLM Explainer** – AI-generated summary explaining your current risk context.
- 💻 **Responsive Design** – Optimized for both desktop and mobile.
- ⚡ **Firebase Hosting** – Secure, fast, and HTTPS-ready.

---

## 🧩 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **React + TypeScript (Vite)** | Frontend framework |
| **Tailwind CSS** | Styling and layout |
| **React Leaflet** | Map and geospatial visualization |
| **TanStack Query** | Data fetching and caching |
| **Firebase Hosting** | Deployment and CDN |
| **USGS Earthquake GeoJSON API** | Real-time earthquake data |

---

## 🛠️ Installation & Setup

### 1️⃣ Clone this repo
```bash
git clone https://github.com/YOUR_USERNAME/earthquake-visualizer.git
cd earthquake-visualizer
npm install
npm run dev
```
Visit http://localhost:5173 in your browser.

Build in the Production
```bash
npm run build
```
## Firebase Hosting
```bash
firebase login
firebase use --add
firebase init hosting
```

# Deploying
```bash
firebase deploy --only hosting
```
```

