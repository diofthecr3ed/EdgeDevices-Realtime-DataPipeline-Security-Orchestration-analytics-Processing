import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import Button from '@mui/material/Button';
import './card.css';
import { useNavigate } from 'react-router-dom';


// Initialize the socket connection
const socket = io("http://10.1.32.104:3000", {
  withCredentials: true, // Allow credentials (cookies, authorization headers, etc.)
}); // Replace with your actual server URL

export default function ACardInvertedColors({ ip }) {
  const [data, setData] = useState({ nodeStat: 1, temp: 70, ramUsage: 40 });
  const navigate = useNavigate();

  // Event listener for data updates from the server
  useEffect(() => {
    socket.on('update', (newData) => {
      console.log('Received data:', newData); // Log the received data

      // Check if newData and newData.systemData exist and contain the expected values
      // Assuming nodeStat is always 1 for simplicity
      if (newData && newData.systemData && newData.systemData.length > 0) {
        const { ram_usage, cpu_temp } = newData.systemData[0]; // Access the latest entry
        setData({
          nodeStat: 1, 
          temp: cpu_temp,
          ramUsage: ram_usage,
        });
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.off('update');
    };
  }, []);

  const { nodeStat, temp, ramUsage } = data;
  const nodeStatus = nodeStat ? "Online" : "Offline";

  const handleViewDetails = () => {
    navigate('/overview', { state: { ip } }); // Navigate to Overview with the IP state
  };

  return (
    <div className="container">
      <div className="wrapper">
        <iframe
          className="banner-iframe"
          src={`http://${ip}:5000/video_feed`}
          allow="autoplay"
          title="Live Video Feed"
        ></iframe>
        <div className="info">
          <div className="temperature">
            <h3>Temperature</h3>
            <h4>{temp}°C</h4>
          </div>
          <div className="ramUsage">
            <h3>Ram Usage</h3>
            <h4>{ramUsage}%</h4>
          </div>
        </div>
        <div className="node-info">
          <p>IP Address: {ip}</p>
          <p>Node Status: {nodeStatus}</p>
        </div>
        <div className="button-wrapper">
          <Button variant="contained" size="small" className="custom-button" on>
            Detailed view
          </Button>
          <a href={`http://${ip}/iotnode`} target="_blank" rel="noopener noreferrer">
          <Button variant="contained" size="small" className="custom-button">
            Access Node
          </Button>
          </a>
        </div>
      </div>
    </div>
  );
}
