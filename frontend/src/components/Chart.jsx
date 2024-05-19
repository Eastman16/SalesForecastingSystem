import React, { useState, useEffect } from "react";
import CanvasJSReact from "@canvasjs/react-charts";

const CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Chart = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [error, setError] = useState(null);
  const [maxYValue, setMaxYValue] = useState(null);

  const lastLine = sessionStorage.getItem("lastValue");
  const lastLineValues = lastLine.split(",");

  const lastLineData = {
    ds: new Date(lastLineValues[0]),
  };

  // Pobierz wartość zmiennej days z sessionStorage i przekształć ją na liczbę
  const days = parseInt(sessionStorage.getItem("days"), 10);

  // Oblicz beforeLastDate na podstawie wartości days
  const beforeLastDate = new Date(lastLineData.ds);
  beforeLastDate.setDate(beforeLastDate.getDate() - days);

  useEffect(() => {
    try {
      const storedData = sessionStorage.getItem("myData");
      const dateValues = Object.values(JSON.parse(storedData) || {});

      const formattedData = dateValues
        .map((item) => ({
          x: new Date(item.ds),
          y: parseFloat(item.yhat),
        }))
        .filter((point) => !isNaN(point.x.getTime()));

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
        <div style={{ color: "red", marginTop: "20px" }}>
          Error loading chart data: {error}
        </div>
      ) : dataPoints.length > 0 ? (
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
                  (point) => point.x <= lastLineData.ds
                ),
              },
              {
                type: "area",
                xValueType: "dateTime",
                color: "#ADD8E6",
                dataPoints: dataPoints.filter(
                  (point) => point.x >= beforeLastDate
                ),
              },
            ],
          }}
        />
      ) : (
        <div style={{ marginTop: "20px" }}>Loading data...</div>
      )}
    </div>
  );
};

export default Chart;
