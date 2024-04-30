import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import LoginSales from "./components/LoginSales";
import LoginDemand from "./components/LoginDemand";
import ImportFileS from "./components/ImportFileSale";
import ImportFileD from "./components/ImportFileDemand";
import ImportAllegroS from "./components/ImportAllegroSales";
import ImportAllegroD from "./components/ImportAllegroDemand";
import ImportWooS from "./components/ImportWooSales";
import ImportWooD from "./components/ImportWooDemand";
import OutputDemand from "./components/OutputDemand";

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/import-allegro-sale" element={<ImportAllegroS />} />
          <Route path="/" element={<Home />} />
          <Route path="/login-sales" element={<LoginSales />} />
          <Route path="/login-demand" element={<LoginDemand />} />
          <Route path="/import-file-sale" element={<ImportFileS />} />
          <Route path="/import-file-demand" element={<ImportFileD />} />
          <Route path="/import-allegro-demand" element={<ImportAllegroD />} />
          <Route path="/import-woo-sale" element={<ImportWooS />} />
          <Route path="/import-woo-demand" element={<ImportWooD />} />
          <Route path="/output-demand" element={<OutputDemand />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
