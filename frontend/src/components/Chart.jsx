import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";
import Papa from "papaparse";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = ({ csvFilePath }) => {
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState(null);
  const [maxYValue, setMaxYValue] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(csvFilePath);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const text = await response.text();

        const result = Papa.parse(text, { header: false, delimiter: ',' });
        if (result.errors.length > 0) {
          throw new Error(`Error parsing CSV: ${result.errors.map(e => e.message).join(", ")}`);
        }

        const formattedData = result.data.map(point => ({ x: new Date(point[0]), y: parseFloat(point[1]) }));

        const maxY = Math.max(...formattedData.map(point => point.y)) * 1.1;
        const maxYValue = Math.ceil(maxY / 100) * 100;
        setMaxYValue(maxYValue);

        setDataPoints(formattedData);
      } catch (error) {
        console.error("Error fetching or parsing CSV data:", error);
        setError(error.toString());
      }
    };

    fetchData();
  }, [csvFilePath]);

  const thresholdValue = new Date("2022-08-01");

  return (
    <div>
      {error ? (
        <div style={{ color: "red", marginTop: "20px" }}>
          Error loading chart data: {error}
        </div>
      ) : dataPoints.length > 0 ? (
        <div style={{ borderRadius: "10px", overflow: "hidden" }}>
          <CanvasJSChart options={{
            theme: "light2",
            animationEnabled: true,
            zoomEnabled: true,
            title: { text: "Przewidywalna sprzedaż", fontSize: 25 },
            axisY: { includeZero: true, maximum: maxYValue },
            data: [
              {
                type: "area",
                xValueType: "dateTime",
                color: "#4682B4",
                dataPoints: dataPoints.filter(point => point.x <= thresholdValue)
              },
              {
                type: "area",
                xValueType: "dateTime",
                color: "#ADD8E6",
                dataPoints: dataPoints.filter(point => point.x >= thresholdValue)
              }
            ]
          }} />
        </div>
      ) : (
        <div style={{ marginTop: "20px" }}>Loading data...</div>
      )}
    </div>
  );
};

export default Chart;
