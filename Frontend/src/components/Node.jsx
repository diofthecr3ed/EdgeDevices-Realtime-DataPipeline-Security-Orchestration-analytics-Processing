import React from "react";
import "./Node.css";

function Node({ nodeName, cpuTemp, ramUsage, status }) {
  const isWorking = status === "working";

  return (
    <div className="card node">
      {/* Wrap the header content inside an anchor tag */}
      <a
        href="#"
        className={`card-header ${isWorking ? "isWorking" : "isDown"}`}
      >
        {nodeName}
        <span className={`status-badge ${!isWorking ? "down" : ""}`}>
          {isWorking ? "Active" : "Down"}
        </span>
      </a>
      <div className="row">
        <div className="col-sm-6">
          <div className="card inside_card">
            <div className="card-body reduce_right">
              <h5 className="card-title values">{cpuTemp}°C</h5>
              <p className="card-text properties">CPU Temp</p>
            </div>
          </div>
        </div>
        <div className="col-sm-6">
          <div className="card inside_card">
            <div className="card-body reduce_left">
              <h5 className="card-title values">{ramUsage}%</h5>
              <p className="card-text properties">RAM Usage</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Node;
