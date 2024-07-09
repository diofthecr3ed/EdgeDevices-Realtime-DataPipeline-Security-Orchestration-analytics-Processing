import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import "./Overview.css";

const Dashboard = () => {
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vehicleData, setVehicleData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const streams = [
    {
      label: "Upper Deck",
      url: "https://www.cameraftp.com/Camera/CameraPlayer.aspx/parentID75626514/shareID12935277/isEmbeddedtrue/upperdeck",
    },
    {
      label: "Roof",
      url: "https://www.cameraftp.com/Camera/CameraPlayer.aspx/parentID75626506/shareID13284808/isEmbeddedtrue/roof",
    },
  ];

  const images = [
    "https://st5.depositphotos.com/3531125/65285/i/450/depositphotos_652850142-stock-photo-air-pollution-traffic-long-road.jpg",
    "https://archive.factordaily.com/wp-content/uploads/2018/09/Intel-Lead.jpg",
  ];

  const chartRef = useRef(null);
  const socketRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["2 Wheeler", "4 Wheeler", "4+ Wheeler"],
        datasets: [
          {
            label: "Number of Vehicles",
            data: [0, 0, 0], // Sample data, replace with actual data from WebSocket
            backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: "Vehicle Type",
              color: "#ffffff", // Set x-axis title color to white
            },
            ticks: {
              color: "#ffffff", // Set x-axis ticks color to white
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Count",
              color: "#ffffff", // Set y-axis title color to white
            },
            ticks: {
              color: "#ffffff", // Set y-axis ticks color to white
            },
          },
        },
        plugins: {
          legend: {
            display: false,
            labels: {
              color: "#ffffff",
            },
          },
          tooltip: {
            bodyColor: "#ffffff",
          },
        },
      },
    });

    socketRef.current.on("updateVehicleData", (data) => {
      const transformedData = data.map(([label, count]) => count);
      setVehicleData(data);
      chartInstance.current.data.datasets[0].data = transformedData;
      // Redraw the chart
      chartInstance.current.update();
    });

    socketRef.current.on("updateTableData", (data) => {
      console.log("Received table data:", data); // logging

      // Update tableData state
      setTableData(data);

      // Alternatively, if you want to append data:
      // setTableData((prevData) => [...prevData, ...data]);
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      socketRef.current.disconnect();
    };
  }, []);

  const handleStreamChange = (direction) => {
    setCurrentStreamIndex((prevIndex) =>
      direction === "next"
        ? (prevIndex + 1) % streams.length
        : (prevIndex - 1 + streams.length) % streams.length
    );
  };

  const handleImageChange = (direction) => {
    setCurrentImageIndex((prevIndex) =>
      direction === "next"
        ? (prevIndex + 1) % images.length
        : (prevIndex - 1 + images.length) % images.length
    );
  };

  const handleDropdownChange = (event) => {
    const selectedIndex = event.target.value;
    setCurrentStreamIndex(Number(selectedIndex));
  };

  return (
    <div className="dashboard">
      <div className="grid-item">
        <div className="header">
          <div className="title">Node Livestream</div>
          <select
            className="dropdown"
            value={currentStreamIndex}
            onChange={handleDropdownChange}
          >
            {streams.map((stream, index) => (
              <option key={index} value={index}>
                {stream.label}
              </option>
            ))}
          </select>
        </div>
        <div className="carousel">
          <button className="prev" onClick={() => handleStreamChange("prev")}>
            {"<"}
          </button>
          <iframe
            src={streams[currentStreamIndex].url}
            title="Livestream"
            width="100%"
            height="100%"
          ></iframe>
          <button className="next" onClick={() => handleStreamChange("next")}>
            {">"}
          </button>
        </div>
      </div>
      <div className="grid-item">
        <div className="title title2">Vehicle Snapshots</div>
        <div className="carousel">
          <button className="prev" onClick={() => handleImageChange("prev")}>
            {"<"}
          </button>
          <img
            src={images[currentImageIndex]}
            alt="Carousel"
            width="100%"
            height="100%"
          />
          <button className="next" onClick={() => handleImageChange("next")}>
            {">"}
          </button>
        </div>
      </div>
      <div className="grid-item" id="bgcontainer">
        <div className="title title2">Traffic Info</div>
        <canvas id="bargraph" ref={chartRef}></canvas>
      </div>
      <div className="grid-item" id="violations">
        <div className="title title2">Traffic Violations</div>
        <table>
          <thead>
            <tr>
              <th>S.No.</th>
              <th>Number Plate</th>
              <th>Vehicle Type</th>
              <th>Violation Type</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row[0]}</td> {/* Accessing number_plate */}
                <td>{row[1]}</td> {/* Accessing vehicle_type */}
                <td>{row[2]}</td> {/* Accessing violation_type */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;