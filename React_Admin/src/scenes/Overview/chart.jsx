import React, { useEffect, useState } from "react";
import { AgCharts } from "ag-charts-react";
import createSocketConnection from "./data";
import { tokens } from "../../theme";
import { useTheme } from "@mui/material";

const LiveChart = () => {
    const [chartData, setChartData] = useState([]);
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    useEffect(() => {
        const socket = createSocketConnection(setChartData);

        // Cleanup on component unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const [options, setOptions] = useState({});

    useEffect(() => {
        setOptions({
            data: chartData,
            series: [
                {
                    type: "line",
                    xKey: "ID",
                    yKey: "TEMPERATURE",
                    yName: "Temperature",
                    stroke: colors.redAccent[500],
                    marker: {
                        fill: colors.redAccent[300],
                    },
                },
                {
                    type: "line",
                    xKey: "ID",
                    yKey: "RAM_USAGE",
                    yName: "RAM Usage",
                    stroke: colors.greenAccent[500],
                    marker: {
                        fill: colors.greenAccent[300],
                    },
                },
            ],
            background: {
                fill: colors.primary[400],
            },
            axes: [
                {
                    type: 'category',
                    position: 'bottom',
                    label: {
                        color: colors.grey[100],
                    },
                    title: {
                        color: colors.grey[100],
                        text: "ID",
                    },
                },
                {
                    type: 'number',
                    position: 'left',
                    label: {
                        color: colors.grey[100],
                    },
                    title: {
                        color: colors.grey[100],
                        text: "data",
                    },
                },
            ],
        });
    }, [chartData, colors]);

    return <AgCharts options={options} />;
};

export default LiveChart;
