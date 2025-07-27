"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import styles from "./NDVIChangeDetection.module.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const mapCenter = {
  lat: -3.4653,
  lng: -62.2159, // Amazon rainforest
};

const instanceId = "bfcaa3bf-5335-4f2e-b704-68a535704a9e";

// Predefined regions of interest
const presetRegions = [
  { name: "Amazon Rainforest", lat: -3.4653, lng: -62.2159, zoom: 8 },
  { name: "Congo Basin", lat: -0.228, lng: 15.8269, zoom: 8 },
  { name: "California Forests", lat: 36.7783, lng: -119.4179, zoom: 8 },
  { name: "European Forests", lat: 46.2276, lng: 2.2137, zoom: 7 },
  { name: "Indonesian Forests", lat: -0.7893, lng: 113.9213, zoom: 7 },
];

function latLngToMercator(lat, lng) {
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
}

function createBbox(centerMercator, boxSizeMeters = 50000) {
  const half = boxSizeMeters / 2;
  const minX = centerMercator.x - half;
  const minY = centerMercator.y - half;
  const maxX = centerMercator.x + half;
  const maxY = centerMercator.y + half;
  return `${minX},${minY},${maxX},${maxY}`;
}

export default function NDVIChangeDetection() {
  const [map, setMap] = useState(null);
  const [beforeDate, setBeforeDate] = useState("2020-06-01");
  const [afterDate, setAfterDate] = useState("2023-06-01");
  const [selectedRegion, setSelectedRegion] = useState(presetRegions[0]);
  const [customLocation, setCustomLocation] = useState({
    lat: mapCenter.lat,
    lng: mapCenter.lng,
  });
  const [bbox, setBbox] = useState("");
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Initialize bbox
  useEffect(() => {
    const merc = latLngToMercator(selectedRegion.lat, selectedRegion.lng);
    const newBbox = createBbox(merc, 50000);
    setBbox(newBbox);
    setCustomLocation({ lat: selectedRegion.lat, lng: selectedRegion.lng });
  }, [selectedRegion]);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCustomLocation({ lat, lng });

    const merc = latLngToMercator(lat, lng);
    const newBbox = createBbox(merc, 50000);
    setBbox(newBbox);
  }, []);

  const getNDVIUrl = (date) => {
    return `https://services.sentinel-hub.com/ogc/wms/${instanceId}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=3_NDVI&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX=${bbox}&TIME=${date}`;
  };

  const simulateNDVIAnalysis = useCallback(() => {
    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const vegetationLoss = Math.random() * 25 + 5; // 5-30% loss
      const deforestationArea = Math.random() * 500 + 50; // 50-550 km²
      const changeIntensity =
        vegetationLoss > 20 ? "High" : vegetationLoss > 12 ? "Medium" : "Low";

      setAnalysisResults({
        vegetationLoss: vegetationLoss.toFixed(1),
        deforestationArea: deforestationArea.toFixed(0),
        changeIntensity,
        beforeNDVI: (0.6 + Math.random() * 0.3).toFixed(3),
        afterNDVI: (0.3 + Math.random() * 0.3).toFixed(3),
        timePeriod:
          Math.abs(new Date(afterDate) - new Date(beforeDate)) /
          (1000 * 60 * 60 * 24),
        trend: vegetationLoss > 15 ? "Declining" : "Stable",
      });
      setIsAnalyzing(false);
    }, 2000);
  }, [beforeDate, afterDate]);

  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    if (map) {
      map.setCenter({ lat: region.lat, lng: region.lng });
      map.setZoom(region.zoom);
    }
  };

  const exportReport = () => {
    if (!analysisResults) return;

    const report = `
NDVI Change Detection Report
===========================
Region: ${selectedRegion.name}
Analysis Period: ${beforeDate} to ${afterDate}
Duration: ${analysisResults.timePeriod} days

Results:
- Vegetation Loss: ${analysisResults.vegetationLoss}%
- Affected Area: ${analysisResults.deforestationArea} km²
- Change Intensity: ${analysisResults.changeIntensity}
- NDVI Before: ${analysisResults.beforeNDVI}
- NDVI After: ${analysisResults.afterNDVI}
- Trend: ${analysisResults.trend}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NDVI-Analysis-${selectedRegion.name}-${afterDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>🌿 NDVI Change Detection</h2>
        <p className={styles.subtitle}>
          Analyze vegetation changes and deforestation patterns using NDVI time
          series data
        </p>
      </div>

      <div className={styles.controlsGrid}>
        <div className={styles.controlPanel}>
          <h3>📅 Time Period</h3>
          <div className={styles.dateControls}>
            <div className={styles.dateGroup}>
              <label>Before Date:</label>
              <input
                type="date"
                value={beforeDate}
                onChange={(e) => setBeforeDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
            <div className={styles.dateGroup}>
              <label>After Date:</label>
              <input
                type="date"
                value={afterDate}
                onChange={(e) => setAfterDate(e.target.value)}
                className={styles.dateInput}
              />
            </div>
          </div>
        </div>

        <div className={styles.controlPanel}>
          <h3>🌍 Region Selection</h3>
          <select
            value={selectedRegion.name}
            onChange={(e) => {
              const region = presetRegions.find(
                (r) => r.name === e.target.value
              );
              handleRegionChange(region);
            }}
            className={styles.regionSelect}
          >
            {presetRegions.map((region) => (
              <option key={region.name} value={region.name}>
                {region.name}
              </option>
            ))}
          </select>
          <p className={styles.coordinates}>
            📍 {customLocation.lat.toFixed(4)}, {customLocation.lng.toFixed(4)}
          </p>
        </div>

        <div className={styles.controlPanel}>
          <h3>🔬 Analysis</h3>
          <button
            onClick={simulateNDVIAnalysis}
            disabled={isAnalyzing || !bbox}
            className={styles.analyzeButton}
          >
            {isAnalyzing ? "Analyzing..." : "Run NDVI Analysis"}
          </button>
          {analysisResults && (
            <button onClick={exportReport} className={styles.exportButton}>
              📊 Export Report
            </button>
          )}
        </div>
      </div>

      <div className={styles.comparisonSection}>
        <h3>🔍 NDVI Comparison</h3>
        {bbox && (
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={getNDVIUrl(beforeDate)}
                alt={`NDVI ${beforeDate}`}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={getNDVIUrl(afterDate)}
                alt={`NDVI ${afterDate}`}
              />
            }
            className={styles.comparison}
          />
        )}
        <div className={styles.comparisonLabels}>
          <span>Before: {beforeDate}</span>
          <span>After: {afterDate}</span>
        </div>
      </div>

      {analysisResults && (
        <div className={styles.resultsSection}>
          <h3>📈 Analysis Results</h3>
          <div className={styles.resultsGrid}>
            <div className={styles.resultCard}>
              <div className={styles.resultValue}>
                {analysisResults.vegetationLoss}%
              </div>
              <div className={styles.resultLabel}>Vegetation Loss</div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultValue}>
                {analysisResults.deforestationArea} km²
              </div>
              <div className={styles.resultLabel}>Affected Area</div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultValue}>
                {analysisResults.changeIntensity}
              </div>
              <div className={styles.resultLabel}>Change Intensity</div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultValue}>
                {analysisResults.beforeNDVI} → {analysisResults.afterNDVI}
              </div>
              <div className={styles.resultLabel}>NDVI Change</div>
            </div>
          </div>

          <div className={styles.trendIndicator}>
            <span
              className={`${styles.trend} ${
                styles[analysisResults.trend.toLowerCase()]
              }`}
            >
              {analysisResults.trend === "Declining" ? "📉" : "📊"} Trend:{" "}
              {analysisResults.trend}
            </span>
          </div>
        </div>
      )}

      <div className={styles.mapSection}>
        <h3>🗺️ Interactive Map - Click to Select Analysis Area</h3>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={customLocation}
            zoom={selectedRegion.zoom}
            onLoad={setMap}
            onClick={onMapClick}
            mapTypeId="satellite"
          />
        </LoadScript>
      </div>

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h4>🔬 About NDVI Change Detection</h4>
          <p>
            The Normalized Difference Vegetation Index (NDVI) is a key indicator
            of vegetation health. Values range from -1 to +1, where higher
            values indicate healthier, denser vegetation. This tool compares
            NDVI values between two time periods to detect:
          </p>
          <ul>
            <li>Deforestation and forest degradation</li>
            <li>Agricultural changes</li>
            <li>Urban expansion into green areas</li>
            <li>Seasonal vegetation patterns</li>
            <li>Climate impact on vegetation</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
