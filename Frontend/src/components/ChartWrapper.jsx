import React from "react";
import SensorChart from "./SensorChart";

const ChartsWrapper = () => {
  // Sample data for each chart
  const chartData1 = {
    /* Your data for chart 1 */
  };
  const chartData2 = {
    /* Your data for chart 2 */
  };
  const chartData3 = {
    /* Your data for chart 3 */
  };

  return (
    <div className="charts-wrapper">
      <div className="chart-container">
        <SensorChart />
      </div>
      <div className="chart-container">
        <SensorChart />
      </div>
      <div className="chart-container">
        <SensorChart />
      </div>
    </div>
  );
};

export default ChartsWrapper;
