import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Papa from "papaparse";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = ({ csvFilePath }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvFilePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();
        
        // Parsing CSV data using PapaParse library with explicitly set delimiter
        const result = Papa.parse(text, { header: false, delimiter: ',' });
        if (result.errors.length > 0) {
          throw new Error(`Error parsing CSV: ${result.errors.map(e => e.message).join(", ")}`);
        }

        // Convert date format from "yyyy-mm-dd" to JavaScript Date objects
        const formattedData = result.data.map(point => ({ x: new Date(point[0]), y: parseFloat(point[1]) }));

        setDataPoints(formattedData); // Set parsed and formatted data points
      } catch (error) {
        console.error("Error fetching or parsing CSV data:", error);
        setError(error.toString());
      }
    };

    fetchData();
  }, [csvFilePath]);

  return (
    <div>
      {error ? (
        <div style={{ color: "red", marginTop: "20px" }}>
          Error loading chart data: {error}
        </div>
      ) : dataPoints.length > 0 ? (
        <CanvasJSChart options={{
          theme: "light2",
          animationEnabled: true,
          zoomEnabled: true,
          title: { text: "Sales Prediction" },
          axisY: { includeZero: false },
          data: [{
            type: "area",
            dataPoints: dataPoints
          }]
        }} />
      ) : (
        <div style={{ marginTop: "20px" }}>Loading data...</div>
      )}
    </div>
  );
};

export default Chart;
