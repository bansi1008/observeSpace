"use client";

import { GoogleMap, LoadScript } from "@react-google-maps/api";
import { useState, useCallback } from "react";
import {
  ReactCompareSlider,
  ReactCompareSliderImage,
} from "react-compare-slider";

const containerStyle = {
  width: "100%",
  height: "600px",
};

const mapCenter = {
  lat: 54.5,
  lng: -3.5,
};

const instanceId = "e6f303d3-5f1b-4ea7-912e-6f86c0df3666";
function latLngToMercator(lat, lng) {
  const x = (lng * 20037508.34) / 180;
  let y = Math.log(Math.tan(((90 + lat) * Math.PI) / 360)) / (Math.PI / 180);
  y = (y * 20037508.34) / 180;
  return { x, y };
}
function createBbox(centerMercator, boxSizeMeters = 20000) {
  // boxSizeMeters = width and height of bbox
  const half = boxSizeMeters / 2;
  const minX = centerMercator.x - half;
  const minY = centerMercator.y - half;
  const maxX = centerMercator.x + half;
  const maxY = centerMercator.y + half;

  return `${minX},${minY},${maxX},${maxY}`;
}

export default function CompareMap() {
  const [dateA, setDateA] = useState("2018-06-01");
  const [dateB, setDateB] = useState("2023-06-01");
  const [layer, setLayer] = useState("7-NDWI");
  const [mapCenter, setMapCenter] = useState({ lat: 54.5, lng: -3.5 });
  const [bbox, setBbox] = useState(
    "-1300000,6800000,-1100000,7000000" 
  );

  const onMapClick = useCallback((event) => {
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();

    setMapCenter({ lat, lng });

 
    const merc = latLngToMercator(lat, lng);
    const newBbox = createBbox(merc, 20000);

    setBbox(newBbox);
  }, []);

  const getMapUrl = (date) => {
   

    return `https://services.sentinel-hub.com/ogc/wms/${instanceId}?SERVICE=WMS&REQUEST=GetMap&VERSION=1.3.0&LAYERS=${layer}&FORMAT=image/png&CRS=EPSG:3857&WIDTH=512&HEIGHT=512&BBOX=${bbox}&TIME=${date}`;
  };

  return (
    <div
      style={{
        width: "100%",
        padding: "20px",
        minHeight: "100vh",
        background: "#f8fafc",
      }}
    >
      <h2>🆚 Compare Satellite Imagery by Date</h2>

      <div style={{ display: "flex", gap: "20px", marginBottom: "10px" }}>
        <div>
          <label>Date A: </label>
          <input
            type="date"
            value={dateA}
            onChange={(e) => setDateA(e.target.value)}
          />
        </div>
        <div>
          <label>Date B: </label>
          <input
            type="date"
            value={dateB}
            onChange={(e) => setDateB(e.target.value)}
          />
        </div>
        <div>
          <label>Layer: </label>
          <select value={layer} onChange={(e) => setLayer(e.target.value)}>
            <option value="7-NDWI">NDWI</option>
            <option value="1_TRUE_COLOR">True Color</option>
            <option value="3_NDVI">NDVI</option>
            <option value="5-MOISTURE-INDEX1">Moisture Index</option>
          </select>
        </div>
      </div>

      <ReactCompareSlider
        itemOne={
          <ReactCompareSliderImage src={getMapUrl(dateA)} alt="Before" />
        }
        itemTwo={<ReactCompareSliderImage src={getMapUrl(dateB)} alt="After" />}
        style={{ width: "100%", height: "600px", border: "1px solid #ccc" }}
      />

      <h3 style={{ marginTop: "40px" }}>📍 Map Context with City Names</h3>
      <LoadScript
        googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}
      >
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={mapCenter}
          zoom={8}
          mapTypeId="roadmap"
          onClick={onMapClick} 
        />
      </LoadScript>
    </div>
  );
}
