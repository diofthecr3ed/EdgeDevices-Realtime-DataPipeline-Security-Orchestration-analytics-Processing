import Node from "./Node.jsx";

function NodeContainer() {
  const nodeData = [
    { nodeName: "Node 1", cpuTemp: 42, ramUsage: 12, status: "working" },
    { nodeName: "Node 2", cpuTemp: 38, ramUsage: 15, status: "working" },
    { nodeName: "Node 3", cpuTemp: 45, ramUsage: 20, status: "working" },
    { nodeName: "Node 4", cpuTemp: 50, ramUsage: 25, status: "down" },
    { nodeName: "Node 5", cpuTemp: 36, ramUsage: 10, status: "working" },
    { nodeName: "Node 6", cpuTemp: 40, ramUsage: 18, status: "down" },

    { nodeName: "Node 13", cpuTemp: 39, ramUsage: 19, status: "working" },
    { nodeName: "Node 12", cpuTemp: 41, ramUsage: 14, status: "down" },
  ];
  return (
    <div className="nodes-container">
      {nodeData.map((data, index) => (
        <Node
          key={index}
          nodeName={data.nodeName}
          cpuTemp={data.cpuTemp}
          ramUsage={data.ramUsage}
          status={data.status}
        />
      ))}
    </div>
  );
}

export default NodeContainer;
