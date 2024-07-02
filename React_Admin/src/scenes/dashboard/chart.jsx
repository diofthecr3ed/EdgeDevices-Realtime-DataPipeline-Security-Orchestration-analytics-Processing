import React, { useEffect, useState } from "react";
import  {AgCharts}  from "ag-charts-react";
import createSocketConnection from "./data";

const LiveChart = () => {
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
        const socket = createSocketConnection(setChartData);
        
        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const [options, setOptions] = useState({
        title: {
            text: "IOT DATA",
        },
        data: chartData,
        series: [
            {
                type: "line",
                xKey: "ID",
                yKey: "TEMPERATURE",
                yName: "Temperature",
            },
            {
                type: "line",
                xKey: "ID",
                yKey: "RAM_USAGE",
                yName: "RAM Usage",
            },
        ],
    });

    useEffect(() => {
        setOptions((prevOptions) => ({
            ...prevOptions,
            data: chartData,
        }));
    }, [chartData]);

    return <AgCharts options={options} />;
}

export default LiveChart;
