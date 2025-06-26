"use client";

import styles from "./Home.module.css";

export default function Home({ setActiveComponent }) {
  return (
    <div className={styles.homeContainer}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Satellite Data Visualization & Analysis Platform
          </h1>
          <p className={styles.heroSubtitle}>
            Leverage advanced satellite imagery and cutting-edge processing
            technologies to explore and understand environmental changes over
            time
          </p>
          <div className={styles.heroButtons}>
            <button
              className={styles.primaryBtn}
              onClick={() => setActiveComponent("map")}
            >
              🗺️ Start Exploring
            </button>
            <button
              className={styles.secondaryBtn}
              onClick={() => setActiveComponent("compare")}
            >
              🆚 Compare Data
            </button>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.featuresContainer}>
          <h2 className={styles.sectionTitle}>Platform Features</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌱</div>
              <h3>Visualize Vegetation Health</h3>
              <p>
                Using NDVI (Normalized Difference Vegetation Index) and other
                indices, track vegetation vitality and monitor forest health
                globally.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Compare Data Over Time</h3>
              <p>
                Detect changes such as deforestation, urban expansion, or
                seasonal variations by comparing images from different dates.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🗺️</div>
              <h3>Interactive Map Integration</h3>
              <p>
                Seamlessly interact with Google Maps to navigate satellite
                imagery overlays and get detailed insights.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚙️</div>
              <h3>Custom Pixel Computations</h3>
              <p>
                Employ advanced Evalscript code to tailor satellite data
                processing from moisture indices to pollution monitoring.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Real-time Data Access</h3>
              <p>
                Fetch and analyze the latest satellite data, empowering timely
                decisions for research and conservation.
              </p>
            </div>

            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌍</div>
              <h3>Global Coverage</h3>
              <p>
                Access satellite data from anywhere on Earth with comprehensive
                coverage and multiple data sources.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.ctaContent}>
          <h2>Ready to Explore Our Planet?</h2>
          <p>
            Whether you're a researcher, environmentalist, policymaker, or
            simply curious about our planet's changing face - start your journey
            today.
          </p>
          <button
            className={styles.ctaButton}
            onClick={() => setActiveComponent("map")}
          >
            🚀 Get Started Now
          </button>
        </div>
      </section>
    </div>
  );
}
