import React from 'react';
import './App.css';
import SensorChart from './components/SensorChart';
import ChartsWrapper from './components/ChartWrapper';
import NodeContainer from './components/NodeContainer';
import Auth from './components/Auth'

// add <ChartsWrapper />, <NodeCOntainer />, and <Auth /> to view The components made


function App() {
  return (
    <div className="App">
      <header className="App-header">
      <ChartsWrapper />
      
      </header>
      
    </div>
  );
}

export default App;
