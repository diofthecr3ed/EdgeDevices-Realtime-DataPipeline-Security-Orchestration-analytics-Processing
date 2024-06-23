import React from 'react';
import './App.css';
import SensorChart from './components/SensorChart';
import ChartsWrapper from './components/ChartWrapper';
import NodeContainer from './components/NodeContainer';
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'


// add <ChartsWrapper />, <NodeCOntainer />, and <Auth /> to view The components made


function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Dashboard/>
      </header>
      
    </div>
  );
}

export default App;
