import React, { useState } from "react";
import Chart from "./Chart";
import { Button } from "@mui/material";

const OutputChart = ({ storedData, dateValues }) => {
  const handleDownloadChartImage = () => {
    const chartCanvas = document.querySelector(".canvasjs-chart-canvas");
    const chartImageURI = chartCanvas.toDataURL("image/png");

    const a = document.createElement("a");
    a.href = chartImageURI;
    a.download = "chart.png";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const [isDownloadClicked, setDownloadClicked] = useState(false);

  return (
    <>
      <div
        className="bg-white flex flex-row justify-center rounded-lg mt-2"
        style={{ width: "1050px" }}
      >
        <div className="mt-2" style={{ width: "1000px", height: "410px" }}>
          <Chart csvFilePath="/data.csv" />{" "}
        </div>
      </div>
      <button
        onClick={() => {
          setDownloadClicked(true);
          handleDownloadChartImage();
          setTimeout(() => {
            setDownloadClicked(false);
          }, 150);
        }}
        className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform ${
          isDownloadClicked
            ? "scale-90 opacity-75"
            : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
        }`}
        style={{ width: "200px", marginTop: "15px" }}
      >
        Pobierz wykres
      </button>
    </>
  );
};

export default OutputChart;
