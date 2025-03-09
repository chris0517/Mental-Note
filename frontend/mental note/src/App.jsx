import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Grid2 } from "@mui/material";
import Home from './components/Home';
import Calander from './components/Calander';
import NavBar from './components/NavBar';
import MockBot from './components/MockBot';

function App() {
  return (
    <Router>
      <div>
        <Grid2
          container
          direction="column"
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
          }}>
          <NavBar />
          <Routes>
            <Route path="/" element={<MockBot />} />
            <Route path="/calander" element={<Calander />} />
            <Route path="/chat" element={<MockBot />} />
          </Routes>
        </Grid2>
      </div>
    </Router>
  );
}

export default App;