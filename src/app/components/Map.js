"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useEffect, useState } from "react";
import styles from "./Map.module.css";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const center = {
  lat: 54.5,
  lng: -3.5,
};

const instanceId = "e6f303d3-5f1b-4ea7-912e-6f86c0df3666"; // Replace with your Sentinel Hub config ID

export default function Map() {
  const [map, setMap] = useState(null);
  const [date, setDate] = useState("2023-06-01");
  const [layer, setLayer] = useState("1_TRUE_COLOR");

  useEffect(() => {
    if (typeof window !== "undefined" && map && window.google) {
      // 🧹 Clear existing overlays
      map.overlayMapTypes.clear();

      const SentinelHubTileLayer = new window.google.maps.ImageMapType({
        getTileUrl: function (coord, zoom) {
          const tileSize = 256;
          const projection = map.getProjection();
          const scale = 1 << zoom;

          const tileBounds = {
            north: projection.fromPointToLatLng({
              x: ((coord.x + 1) * tileSize) / scale,
              y: (coord.y * tileSize) / scale,
            }),
            south: projection.fromPointToLatLng({
              x: (coord.x * tileSize) / scale,
              y: ((coord.y + 1) * tileSize) / scale,
            }),
          };

          // Convert lat/lng to EPSG:3857 meters
          const latLngToMercator = (lat, lng) => {
            const x = (lng * 20037508.34) / 180;
            let y =
              Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) /
              (Math.PI / 180);
            y = (y * 20037508.34) / 180;
            return { x, y };
          };

          const nw = latLngToMercator(
            tileBounds.north.lat(),
            tileBounds.north.lng()
          );
          const se = latLngToMercator(
            tileBounds.south.lat(),
            tileBounds.south.lng()
          );

          // Correct order: minX, minY, maxX, maxY
          const bbox = [nw.x, se.y, se.x, nw.y].join(",");

          return `https://services.sentinel-hub.com/ogc/wms/${instanceId}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=${layer}&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX=${bbox}&TIME=${date}`;
        },
        tileSize: new window.google.maps.Size(256, 256),
        name: "Sentinel Hub",
        maxZoom: 18,
      });

      map.overlayMapTypes.insertAt(0, SentinelHubTileLayer);
    }
  }, [map, date, layer]);

  return (
    <div className={styles.mapContainer}>
      <div className={styles.header}>
        <h2 className={styles.title}>🗺️ Interactive Satellite Map</h2>
        <p className={styles.subtitle}>
          Explore satellite imagery with real-time data visualization
        </p>
      </div>

      <div className={styles.controls}>
        <div className={styles.controlGroup}>
          <label className={styles.label}>📅 Select Date:</label>
          <input
            type="date"
            value={date}
            min="2017-01-01"
            max="2024-12-31"
            onChange={(e) => setDate(e.target.value)}
            className={styles.dateInput}
          />
        </div>

        <div className={styles.controlGroup}>
          <label className={styles.label}>🛰️ Select Layer:</label>
          <select
            value={layer}
            onChange={(e) => setLayer(e.target.value)}
            className={styles.dropdown}
          >
            <option value="1_TRUE_COLOR">True Color</option>
            <option value="7-NDWI">NDWI (Water Index)</option>
            <option value="5-MOISTURE-INDEX1">Moisture Index</option>
            <option value="3_NDVI">NDVI</option>
            <option value="2_FALSE_COLOR">False Color</option>
          </select>
        </div>
      </div>

      <div className={styles.mapWrapper}>
        <LoadScript
          googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={6}
            onLoad={(mapInstance) => setMap(mapInstance)}
          />
        </LoadScript>
      </div>

      <div className={styles.layerInfo}>
        <div className={styles.infoCard}>
          <h4>Current Layer: {layer.replace(/_/g, " ")}</h4>
          <p>Date: {date}</p>
        </div>
      </div>
    </div>
  );
}
