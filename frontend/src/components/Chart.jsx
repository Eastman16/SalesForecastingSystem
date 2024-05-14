import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState(null);
  const [maxYValue, setMaxYValue] = useState(null);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem('myData');
      const dateValues = Object.values(JSON.parse(storedData) || {});

      const formattedData = dateValues.map(item => ({
        x: new Date(item.ds), // Przekształć datę na obiekt Date
        y: parseFloat(item.yhat) // Przekształć wartość na float
      }));

      const maxY = Math.max(...formattedData.map(point => point.y)) * 1.1;
      const maxYValue = Math.ceil(maxY / 100) * 100;
      setMaxYValue(maxYValue);

      setDataPoints(formattedData);
    } catch (error) {
      console.error("Error processing data:", error);
      setError(error.toString());
    }
  }, []); // Brak zewnętrznych zależności, używamy tylko danych z sessionStorage

  const thresholdValue = new Date("2022-08-01"); // Przykładowa data graniczna

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
      ) : (
        <div style={{ marginTop: "20px" }}>Loading data...</div>
      )}
    </div>
  );
};

export default Chart;
