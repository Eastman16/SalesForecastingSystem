import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState(null);
  const [maxYValue, setMaxYValue] = useState(null);

  // Retrieving last line and days from sessionStorage
  const lastLine = sessionStorage.getItem("lastValue");
  const lastLineValues = lastLine.split(",");

  const lastLineData = {
    ds: new Date(lastLineValues[0]),
  };

  const days = parseInt(sessionStorage.getItem("days"), 10);
  const beforeLastDate = new Date(lastLineData.ds);
  beforeLastDate.setDate(beforeLastDate.getDate() - days);

  // Effect hook to fetch and process data
  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("myData"); // Retrieving stored data from sessionStorage
      const dateValues = Object.values(JSON.parse(storedData) || {}); // Parsing stored data and extracting values

      // Formatting data points
      const formattedData = dateValues
        .map((item) => ({
          x: new Date(item.ds),
          y: parseFloat(item.yhat),
        }))
        .filter((point) => !isNaN(point.x.getTime())); // Filtering out invalid points

      const maxY = Math.max(...formattedData.map((point) => point.y)) * 1.1;
      const maxYValue = Math.ceil(maxY / 100) * 100;
      setMaxYValue(maxYValue);

      setDataPoints(formattedData);
    } catch (error) {
      console.error("Error processing data:", error);
      setError(error.toString());
    }
  }, []);

  return (
    <div>
      {error ? (
        <div className="text-red-500 mt-5">
          Error loading chart data: {error}
        </div>
      ) : dataPoints.length > 0 ? ( // If data points exist, render chart
        <CanvasJSChart
          options={{
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
                dataPoints: dataPoints.filter(
                  (point) =>
                    point.x <=
                    lastLineData.ds.setDate(lastLineData.ds.getDate() + 1) // Filtering data points for the last day
                ),
              },
              {
                type: "area",
                xValueType: "dateTime",
                color: "#ADD8E6",
                dataPoints: dataPoints.filter(
                  (point) => point.x >= beforeLastDate // Filtering data points for the day before the last day
                ),
              },
            ],
          }}
        />
      ) : (
        <div className="mt-5">Loading data...</div>
      )}
    </div>
  );
};

export default Chart;
