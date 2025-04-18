import React from 'react';
import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Topbar from "./scenes/Global/Topbar";
import Sidebar from "./scenes/Global/Sidebar";
import { Routes, Route, useLocation } from 'react-router-dom';
import Overview from "./scenes/Traffic_M/Overview_Alt.jsx";
import Dashboard from './scenes/dashboard';
import IotNodeAlt from "./scenes/iotNode/IotNodeAlt.jsx";
import './index.css'; // Ensure you have an App.css for the styles

function App() {
  const [theme, colorMode] = useMode();
  const location = useLocation();

  // Determine if the current path is "overview" or "dashboard"
  // const isCenterAlign = location.pathname === '/overview';

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <div className="sidebar">
            <Sidebar />
          </div>
          <div className="content">
            <Topbar />
            <Routes>
              <Route path="/overview" element={<Overview />} />
              <Route path="/" element={<Dashboard />} />
              <Route path="/iotNode" element={<IotNodeAlt />} />
            </Routes>
          </div>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;
