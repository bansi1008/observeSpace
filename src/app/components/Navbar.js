"use client";

import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar({ activeComponent, setActiveComponent }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.navBrand}>
          <h2>🛰️ ObserveSpace Platform</h2>
          <span className={styles.tagline}>
            Satellite Data Visualization & Analysis
          </span>
        </div>

        <div className={styles.navLinks}>
          <button
            className={`${styles.navButton} ${
              activeComponent === "home" ? styles.active : ""
            }`}
            onClick={() => setActiveComponent("home")}
          >
            🏠 Home
          </button>
          <button
            className={`${styles.navButton} ${
              activeComponent === "map" ? styles.active : ""
            }`}
            onClick={() => setActiveComponent("map")}
          >
            🗺️ Interactive Map
          </button>
          <button
            className={`${styles.navButton} ${
              activeComponent === "compare" ? styles.active : ""
            }`}
            onClick={() => setActiveComponent("compare")}
          >
            🆚 Compare Imagery
          </button>
          <button
            className={`${styles.navButton} ${
              activeComponent === "ndvi" ? styles.active : ""
            }`}
            onClick={() => setActiveComponent("ndvi")}
          >
            🌿 NDVI Analysis
          </button>
          <button
            className={`${styles.navButton} ${
              activeComponent === "ndwi" ? styles.active : ""
            }`}
            onClick={() => setActiveComponent("ndwi")}
          >
            💧 NDWI Water
          </button>
        </div>
      </div>
    </nav>
  );
}
