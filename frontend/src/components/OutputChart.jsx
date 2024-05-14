import React, { useState } from "react";
import Chart from "./Chart";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from "@mui/material";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

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

    return (
        <div style={{ flex: 1, minHeight: '600px', paddingTop: "50px" }}>
          <Chart csvFilePath="/data.csv" />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDownloadChartImage}
              className="py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              style={{ width: "600px" }}
            >
              Pobierz wykres
            </button>
          </div>
        </div>
    )
}

export default OutputChart
