import React, { useState } from "react";
import Chart from "./Chart";
import { Button } from "@mui/material";

const OutputChart = ({ storedData, dateValues }) => {
  // Function to handle downloading the chart as an image
  const handleDownloadChartImage = () => {
    const chartCanvas = document.querySelector(".canvasjs-chart-canvas"); // Select the chart canvas element
    const chartImageURI = chartCanvas.toDataURL("image/png"); // Convert the canvas to a data URI in PNG format

    const a = document.createElement("a"); // Create a temporary anchor element
    a.href = chartImageURI; // Set the href to the data URI
    a.download = "chart.png"; // Set the download attribute to the desired file name
    document.body.appendChild(a); // Append the anchor to the body
    a.click(); // Programmatically click the anchor to trigger the download
    document.body.removeChild(a); // Remove the anchor from the body
  };

  const [isDownloadClicked, setDownloadClicked] = useState(false); // State to manage the download button click animation

  return (
    <>
      <div className="bg-white flex justify-center rounded-lg mt-2 w-full max-w-[1050px] mx-auto">
        <div className="mt-2 w-full max-w-[1000px] h-[410px]">
          <Chart csvFilePath="/data.csv" />{" "}
        </div>
      </div>
      {/* Button to trigger chart download */}
      <button
        onClick={() => {
          setDownloadClicked(true);
          handleDownloadChartImage();
          setTimeout(() => {
            setDownloadClicked(false);
          }, 150);
        }}
        className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform w-[200px] mt-4 ${
          isDownloadClicked
            ? "scale-90 opacity-75"
            : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
        }`}
      >
        Pobierz wykres
      </button>
    </>
  );
};

export default OutputChart;
