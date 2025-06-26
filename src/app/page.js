"use client";

import { useState } from "react";
import styles from "./page.module.css";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Map from "./components/Map";
import CompareMap from "./components/CompareMap";
import NDVIChangeDetection from "./components/NDVIChangeDetection";
import NDWIChangeDetection from "./components/NDWIChangeDetection";

export default function HomePage() {
  const [activeComponent, setActiveComponent] = useState("home");

  const renderComponent = () => {
    switch (activeComponent) {
      case "home":
        return <Home setActiveComponent={setActiveComponent} />;
      case "map":
        return <Map />;
      case "compare":
        return <CompareMap />;
      case "ndvi":
        return <NDVIChangeDetection />;
      case "ndwi":
        return <NDWIChangeDetection />;
      default:
        return <Home setActiveComponent={setActiveComponent} />;
    }
  };

  return (
    <div className={styles.page}>
      <Navbar
        activeComponent={activeComponent}
        setActiveComponent={setActiveComponent}
      />
      {renderComponent()}
    </div>
  );
}
