# ObserveSpace

ObserveSpace is a web-based project for visualizing and analyzing satellite imagery using NDVI (Normalized Difference Vegetation Index) and NDWI (Normalized Difference Water Index). This tool helps monitor environmental changes like vegetation health and water presence.

## Features

- Calculate NDVI and NDWI indices from satellite images
- Interactive map visualization
- Historical data tracking with backdated commits
- Simple UI for ease of use

- ## 🛠 Tech Stack

### 🧑‍💻 Frontend
- **React** – Core UI framework
- **Leaflet.js** – Interactive mapping and overlays
- **CSS Modules** – Scoped component styling
- **React Compare Slider** – For before/after NDVI & NDWI comparison
- **React Icons** – For lightweight and customizable UI icons

### 🌍 Mapping & Remote Sensing
- **Sentinel Hub WMS** – OGC-compliant WMS layers for satellite imagery
- **Google Maps API**  – For base maps and geolocation
- **Sentinel Hub Processing API** – Evalscript-based NDVI/NDWI generation (experimental)

### 🗃 Backend
- **Node.js** – JavaScript runtime for backend logic
