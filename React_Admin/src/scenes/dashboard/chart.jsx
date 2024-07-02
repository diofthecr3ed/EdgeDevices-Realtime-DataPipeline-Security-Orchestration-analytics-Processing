import React , {useState} from "react";
import {AgCharts} from "ag-charts-react"
import getData from "./data";

const LiveChart = () => {
    const [options,setOptions] = useState({
        title: {
            text : "IOT DATA",
        },
        data: getData(),
        series: [
            {
                type : "line",
                xKey : "",
                yKey : "",
                yName : "",
            },
            {
                type: "line",
                xKey: "",
                yKey: "",
                yName: "",
            },
        ],
    });

    return <AgCharts options={options} />
}
export default LiveChart