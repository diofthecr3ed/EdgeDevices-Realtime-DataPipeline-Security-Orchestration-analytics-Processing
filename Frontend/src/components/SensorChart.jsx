import React, { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import "./SensorChart.css";

const SensorChart = ({ dataKey, label }) => {
  const chartRef = useRef(null);
  const socketRef = useRef(null);
  const chartInstance = useRef(null);
  const MAX_DATA_COUNT = 10;

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: label,
            data: [],
            borderColor: "rgba(75, 192, 192, 1)",
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        scales: {
          x: {
            type: "time",
            time: {
              parser: "MM/dd/yyyy HH:mm:ss", // Ensure the date format is parsed correctly
              tooltipFormat: "ll HH:mm:ss",
              unit: "second",
              displayFormats: {
                second: "HH:mm:ss",
              },
            },
            title: {
              display: true,
              text: "Time",
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Sensor Value",
            },
          },
        },
      },
    });

    const addData = (label, data) => {
      chartInstance.current.data.labels.push(label);
      chartInstance.current.data.datasets.forEach((dataset) => {
        dataset.data.push({ x: label, y: data });
      });
      chartInstance.current.update();
    };

    const removeFirstData = () => {
      chartInstance.current.data.labels.splice(0, 1);
      chartInstance.current.data.datasets.forEach((dataset) => {
        dataset.data.shift();
      });
    };

    socketRef.current.on("updateSensorData", (msg) => {
      console.log(
        "Received sensorData :: " + msg.timestamp + " :: " + msg[dataKey]
      );

      // Show only MAX_DATA_COUNT data
      if (chartInstance.current.data.labels.length > MAX_DATA_COUNT) {
        removeFirstData();
      }
      addData(msg.timestamp, msg[dataKey]);
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      socketRef.current.disconnect();
    };
  }, [dataKey]);

  return (
    <div className="chart-container">
      <canvas ref={chartRef} width="1000" height="600"></canvas>
    </div>
  );
};

export default SensorChart;
