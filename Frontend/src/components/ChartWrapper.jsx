import React from "react";
import SensorChart from "./SensorChart";
import "./SensorChart.css";

const ChartsWrapper = () => {
  return (
    <>
      <h1>Node 1</h1>

      <div className="charts-wrapper">
        <div className="chart-container datas">
          <h2 className="chartHeading2">Node Status</h2>
          <h1 className="dataValue ">Running</h1>
        </div>
        <div className="chart-container datas">
          <h2 className="chartHeading2">Node Health</h2>
          <h1 className="dataValue ">Healthy</h1>
        </div>
        <div className="chart-container datas">
          <h2 className="chartHeading2">Errors</h2>
          <h1 className="dataValue ">-NA-</h1>
        </div>

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
    </>
  );
};

export default ChartsWrapper;
