import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import Chart from "chart.js/auto";
import "chartjs-adapter-date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Container,
  Grid,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  Card,
  CardContent,
  CardHeader,
} from "@mui/material";
import { ArrowBack, ArrowForward } from "@mui/icons-material";
import "./Dashboard.css";

const Dashboard = () => {
  const [currentStreamIndex, setCurrentStreamIndex] = useState(0);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [vehicleData, setVehicleData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [hourlyViolationData, setHourlyViolationData] = useState([]);

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

  const getLineColor = (vehicleType) => {
    switch (vehicleType) {
      case "2 Wheeler":
        return "#FF6384";
      case "4 Wheeler":
        return "#36A2EB";
      case "4+ Wheeler":
        return "#FFCE56";
      case "Pedestrian":
        return "#4BC0C0";
      case "Emergency Vehicle":
        return "#9966FF";
      default:
        return "#000000"; // Default color
    }
  };

  const chartRef = useRef(null);
  const socketRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    const ctx = chartRef.current.getContext("2d");
    chartInstance.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "2 Wheeler",
          "4 Wheeler",
          "4+ Wheeler",
          "Pedestrian",
          "Emergency Vehicle",
        ],
        datasets: [
          {
            label: "Number of Vehicles",
            data: [0, 0, 0, 0, 0], // Sample data, replace with actual data from WebSocket
            backgroundColor: [
              "#FF6384",
              "#36A2EB",
              "#FFCE56",
              "#4BC0C0",
              "#9966FF",
            ],
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
    });

    socketRef.current.on("updateHourlyViolationData", (data) => {
      console.log("Received hourly violation data:", data); // logging
      // Update hourlyViolationData state
      setHourlyViolationData(data);
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

  // Group data by vehicle type for the line chart
  const groupedData = hourlyViolationData.reduce(
    (acc, [vehicleType, hour, count]) => {
      if (!acc[vehicleType]) {
        acc[vehicleType] = Array(24).fill(0);
      }
      acc[vehicleType][Math.floor(hour)] = count;
      return acc;
    },
    {}
  );

  const lineChartData = Object.entries(groupedData).map(
    ([vehicleType, counts]) => ({
      name: vehicleType,
      data: counts.map((count, hour) => ({
        hour,
        count,
      })),
    })
  );

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader
              title="Camera Streams"
              action={
                <Select
                  value={currentStreamIndex}
                  onChange={handleDropdownChange}
                >
                  {streams.map((stream, index) => (
                    <MenuItem key={index} value={index}>
                      {stream.label}
                    </MenuItem>
                  ))}
                </Select>
              }
            />
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleStreamChange("prev")}>
                  <ArrowBack />
                </IconButton>
                <iframe
                  title="stream"
                  src={streams[currentStreamIndex].url}
                  frameBorder="0"
                  allowFullScreen
                  style={{ width: "100%", height: "300px" }}
                />
                <IconButton onClick={() => handleStreamChange("next")}>
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardHeader title="Live Images" />
            <CardContent>
              <Box display="flex" alignItems="center">
                <IconButton onClick={() => handleImageChange("prev")}>
                  <ArrowBack />
                </IconButton>
                <img
                  src={images[currentImageIndex]}
                  alt="Live"
                  style={{ width: "100%", height: "300px" }}
                />
                <IconButton onClick={() => handleImageChange("next")}>
                  <ArrowForward />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Vehicle Count" />
            <CardContent>
              <canvas id="bargraph" ref={chartRef} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Hourly Traffic Violations" />
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart
                  data={Array.from({ length: 24 }, (_, hour) => {
                    const hourData = { hour };
                    lineChartData.forEach(({ name, data }) => {
                      hourData[name] = data[hour].count;
                    });
                    return hourData;
                  })}
                  margin={{ top: 5, right: 30, left: 10, bottom: 5 }} // Reduced left margin
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="hour"
                    label={{
                      value: "Hour of the Day",
                      position: "insideBottomRight",
                      offset: -10,
                      fontSize: 14,
                    }}
                    tick={{ fill: "#ffffff" }}
                    fontSize={14}
                  />
                  <YAxis
                    label={{
                      value: "Count",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 14,
                      marginBottom: 100,
                    }}
                    fontSize={14}
                    tick={{ fill: "#ffffff" }}
                  />
                  <Tooltip contentStyle={{ fontSize: 12 }} />{" "}
                  {/* Adjust font size in tooltip */}
                  <Legend wrapperStyle={{ fontSize: 12, marginTop: 30 }} />{" "}
                  {/* Adjust font size in legend */}
                  {lineChartData.map(({ name }) => (
                    <Line
                      key={name}
                      type="monotone"
                      dataKey={name}
                      stroke={getLineColor(name)}
                      activeDot={{ r: 8 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="Traffic Violations" />
            <CardContent>
              <Box
                sx={{
                  overflowY: "auto",
                  maxHeight: "300px",
                }}
              >
                <table>
                  <thead>
                    <tr>
                      <th>Number Plate</th>
                      <th>Vehicle Type</th>
                      <th>Violation Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData.map(
                      ([numberPlate, vehicleType, violationType], index) => (
                        <tr key={index}>
                          <td>{numberPlate}</td>
                          <td>{vehicleType}</td>
                          <td>{violationType}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;
