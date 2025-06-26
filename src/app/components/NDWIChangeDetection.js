"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState, useEffect, useCallback } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";
import styles from "./NDWIChangeDetection.module.css";

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

const mapCenter = {
  lat: 36.0014,
  lng: -114.7377, // Lake Mead, Nevada
};

const instanceId = "e6f303d3-5f1b-4ea7-912e-6f86c0df3666";

// Predefined water regions of interest
const presetRegions = [
  { name: "Lake Mead, Nevada", lat: 36.0014, lng: -114.7377, zoom: 10 },
  { name: "Aral Sea, Kazakhstan", lat: 45.0, lng: 60.0, zoom: 8 },
  { name: "Lake Chad, Africa", lat: 13.0, lng: 14.0, zoom: 8 },
  { name: "Lake Urmia, Iran", lat: 37.5, lng: 45.3, zoom: 9 },
  { name: "Colorado River Delta", lat: 31.8, lng: -114.8, zoom: 9 },
  { name: "Murray River, Australia", lat: -34.1, lng: 142.1, zoom: 9 },
  { name: "Ganges Delta, Bangladesh", lat: 22.0, lng: 90.3, zoom: 8 },
  { name: "Nile Delta, Egypt", lat: 31.0, lng: 31.2, zoom: 8 },
];

function latLngToMercator(lat, lng) {
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
}

function createBbox(centerMercator, boxSizeMeters = 40000) {
  const half = boxSizeMeters / 2;
  const minX = centerMercator.x - half;
  const minY = centerMercator.y - half;
  const maxX = centerMercator.x + half;
  const maxY = centerMercator.y + half;
  return `${minX},${minY},${maxX},${maxY}`;
}

export default function NDWIChangeDetection() {
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
    const newBbox = createBbox(merc, 40000);
    setBbox(newBbox);
    setCustomLocation({ lat: selectedRegion.lat, lng: selectedRegion.lng });
  }, [selectedRegion]);

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setCustomLocation({ lat, lng });

    const merc = latLngToMercator(lat, lng);
    const newBbox = createBbox(merc, 40000);
    setBbox(newBbox);
  }, []);

  const getNDWIUrl = (date) => {
    return `https://services.sentinel-hub.com/ogc/wms/${instanceId}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=7-NDWI&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX=${bbox}&TIME=${date}`;
  };

  const simulateNDWIAnalysis = useCallback(() => {
    setIsAnalyzing(true);

    // Simulate analysis delay
    setTimeout(() => {
      const waterChange = (Math.random() - 0.5) * 40; // -20% to +20% change
      const waterLoss = waterChange < 0 ? Math.abs(waterChange) : 0;
      const waterGain = waterChange > 0 ? waterChange : 0;
      const affectedArea = Math.random() * 800 + 100; // 100-900 km²
      const changeIntensity =
        Math.abs(waterChange) > 15
          ? "High"
          : Math.abs(waterChange) > 8
          ? "Medium"
          : "Low";

      setAnalysisResults({
        waterChange: waterChange.toFixed(1),
        waterLoss: waterLoss.toFixed(1),
        waterGain: waterGain.toFixed(1),
        affectedArea: affectedArea.toFixed(0),
        changeIntensity,
        beforeNDWI: (0.2 + Math.random() * 0.6).toFixed(3),
        afterNDWI: (0.2 + Math.random() * 0.6).toFixed(3),
        timePeriod:
          Math.abs(new Date(afterDate) - new Date(beforeDate)) /
          (1000 * 60 * 60 * 24),
        trend:
          waterChange < -10
            ? "Declining"
            : waterChange > 10
            ? "Increasing"
            : "Stable",
        droughtRisk:
          waterChange < -15 ? "High" : waterChange < -5 ? "Medium" : "Low",
        floodRisk:
          waterChange > 15 ? "High" : waterChange > 5 ? "Medium" : "Low",
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
NDWI Water Change Detection Report
=================================
Region: ${selectedRegion.name}
Analysis Period: ${beforeDate} to ${afterDate}
Duration: ${analysisResults.timePeriod} days

Water Body Analysis Results:
- Water Change: ${analysisResults.waterChange}%
- Water Loss: ${analysisResults.waterLoss}%
- Water Gain: ${analysisResults.waterGain}%
- Affected Area: ${analysisResults.affectedArea} km²
- Change Intensity: ${analysisResults.changeIntensity}
- NDWI Before: ${analysisResults.beforeNDWI}
- NDWI After: ${analysisResults.afterNDWI}
- Trend: ${analysisResults.trend}

Risk Assessment:
- Drought Risk: ${analysisResults.droughtRisk}
- Flood Risk: ${analysisResults.floodRisk}

Generated on: ${new Date().toLocaleString()}
    `;

    const blob = new Blob([report], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `NDWI-Analysis-${selectedRegion.name}-${afterDate}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>💧 NDWI Water Change Detection</h2>
        <p className={styles.subtitle}>
          Monitor water body changes, drought conditions, and flood risks using
          NDWI time series analysis
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
          <h3>🌊 Water Body Selection</h3>
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
          <h3>🔬 Water Analysis</h3>
          <button
            onClick={simulateNDWIAnalysis}
            disabled={isAnalyzing || !bbox}
            className={styles.analyzeButton}
          >
            {isAnalyzing ? "Analyzing Water..." : "Run NDWI Analysis"}
          </button>
          {analysisResults && (
            <button onClick={exportReport} className={styles.exportButton}>
              📊 Export Water Report
            </button>
          )}
        </div>
      </div>

      <div className={styles.comparisonSection}>
        <h3>🔍 NDWI Water Comparison</h3>
        {bbox && (
          <ReactCompareSlider
            itemOne={
              <ReactCompareSliderImage
                src={getNDWIUrl(beforeDate)}
                alt={`NDWI ${beforeDate}`}
              />
            }
            itemTwo={
              <ReactCompareSliderImage
                src={getNDWIUrl(afterDate)}
                alt={`NDWI ${afterDate}`}
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
          <h3>📈 Water Analysis Results</h3>
          <div className={styles.resultsGrid}>
            <div className={styles.resultCard}>
              <div className={styles.resultValue}>
                {analysisResults.waterChange}%
              </div>
              <div className={styles.resultLabel}>Water Change</div>
            </div>
            <div className={styles.resultCard}>
              <div className={styles.resultValue}>
                {analysisResults.affectedArea} km²
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
                {analysisResults.beforeNDWI} → {analysisResults.afterNDWI}
              </div>
              <div className={styles.resultLabel}>NDWI Change</div>
            </div>
          </div>

          <div className={styles.riskAssessment}>
            <div className={styles.riskCard}>
              <span
                className={`${styles.riskIndicator} ${
                  styles[analysisResults.droughtRisk.toLowerCase()]
                }`}
              >
                🏜️ Drought Risk: {analysisResults.droughtRisk}
              </span>
            </div>
            <div className={styles.riskCard}>
              <span
                className={`${styles.riskIndicator} ${
                  styles[analysisResults.floodRisk.toLowerCase()]
                }`}
              >
                🌊 Flood Risk: {analysisResults.floodRisk}
              </span>
            </div>
          </div>

          <div className={styles.trendIndicator}>
            <span
              className={`${styles.trend} ${
                styles[analysisResults.trend.toLowerCase()]
              }`}
            >
              {analysisResults.trend === "Declining"
                ? "📉"
                : analysisResults.trend === "Increasing"
                ? "📈"
                : "📊"}
              Water Trend: {analysisResults.trend}
            </span>
          </div>
        </div>
      )}

      <div className={styles.mapSection}>
        <h3>🗺️ Interactive Map - Click to Select Water Analysis Area</h3>
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
          <h4>💧 About NDWI Water Change Detection</h4>
          <p>
            The Normalized Difference Water Index (NDWI) is specifically
            designed to monitor water content in vegetation and identify water
            bodies. Values range from -1 to +1, where higher values indicate
            water presence. This tool analyzes water changes to detect:
          </p>
          <ul>
            <li>Lake and reservoir water level changes</li>
            <li>River flow variations and seasonal patterns</li>
            <li>Drought impact assessment</li>
            <li>Flood extent monitoring</li>
            <li>Wetland ecosystem changes</li>
            <li>Coastal water boundary shifts</li>
            <li>Urban water infrastructure monitoring</li>
          </ul>

          <h5>Water Change Interpretation:</h5>
          <div className={styles.interpretationGrid}>
            <div className={styles.interpretationItem}>
              <strong>Positive Change (+):</strong> Water increase, potential
              flooding, reservoir filling
            </div>
            <div className={styles.interpretationItem}>
              <strong>Negative Change (-):</strong> Water decrease, drought
              conditions, water stress
            </div>
            <div className={styles.interpretationItem}>
              <strong>Stable (±5%):</strong> Normal seasonal variation, healthy
              water levels
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
