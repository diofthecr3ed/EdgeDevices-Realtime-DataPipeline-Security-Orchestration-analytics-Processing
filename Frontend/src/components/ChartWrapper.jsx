import React from "react";
import SensorChart from "./SensorChart";
import "./SensorChart.css";

const ChartsWrapper = () => {
  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <h2 className="chartHeading">CPU Temperature</h2>
        <SensorChart dataKey="cpu_temperature" label="CPU Temperature" />
      </div>
      <div className="chart-container">
        <h2 className="chartHeading">Ram Usage</h2>
        <SensorChart dataKey="ram_usage" label="RAM Usage" />
      </div>
      <div className="chart-container">
        <h2 className="chartHeading">Humidity</h2>
        <SensorChart dataKey="humidity" label="Humidity" />
      </div>
    </div>
  );
};

export default ChartsWrapper;
