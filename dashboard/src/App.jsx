import { ColorModeContext,useMode } from "./theme"
import { CssBaseline,ThemeProvider } from "@mui/material"
import Topbar from "./scenes/Global/Topbar"
import Sidebar from "./scenes/Global/Sidebar"
import {Routes , Route} from 'react-router-dom'
import { BrowserRouter as Router } from "react-router-dom";

import Dashboard from './scenes/dashboard'


function App() {

  const [theme , colorMode] = useMode();

  return (
    <ColorModeContext.Provider value = {colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar />
          <main className="content">
            <Topbar/>
            {/* <Routes>
              <Route path="/" element={<Dashboard />}/>
            </Routes> */}
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default App
