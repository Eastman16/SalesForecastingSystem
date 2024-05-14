import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import ImportFileS from "./components/ImportFileSale";
import ImportAllegroS from "./components/ImportAllegroSales";
import ImportWooS from "./components/ImportWooSales";
import OutputSales from "./components/OutputSales";
import OutputChart from "./components/OutputChart";
import OutputTable from "./components/OutputTable";



function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
          <Route path="/import-allegro-sale" element={<ImportAllegroS />} />
          <Route path="/" element={<Home />} />
          <Route path="/import-file-sale" element={<ImportFileS />} />
          <Route path="/import-woo-sale" element={<ImportWooS />} />
          <Route path="/output-sales" element={<OutputSales />} />
          <Route path="/chart" element={<OutputChart />} />
          <Route path="/table" element={<OutputTable />} />
        </Routes>
    </Router>
  );
}

export default App;
