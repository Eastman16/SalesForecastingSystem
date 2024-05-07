import React, { useState } from "react";
import Chart from "./Chart";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TextField } from "@mui/material";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

const OutputSales = () => {
  const [selectedDate, setSelectedDate] = useState(null);

  // Sample data for the list of dates and values
  const dateValues = [
    { date: "2020-10-12", value: 25 },
    { date: "2020-10-13", value: 35 },
    { date: "2020-10-14", value: 45 },
    { date: "2020-10-15", value: 55 },
    { date: "2020-10-16", value: 65 },
    { date: "2020-10-17", value: 75 },
    { date: "2020-10-18", value: 85 },
    { date: "2020-10-19", value: 95 },
    { date: "2020-10-20", value: 105 },
    { date: "2020-10-21", value: 115 },
    // Add more if needed
  ];

  const filterDateValues = () => {
    if (!selectedDate) {
      return dateValues; // Return all values if no date is selected
    }
    const formattedDate = selectedDate.format("YYYY-MM-DD");
    return dateValues.filter(item => item.date === formattedDate);
  };

  const downloadCSV = (data) => {
    const csvRows = []; // Header
    // Directly use the dates if they're in the correct format
    data.forEach(item => {
      csvRows.push(`${item.date},${item.value}`);
    });

    const csvString = csvRows.join('\n');
    const blob = new Blob([csvString], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'dateValues.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

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
    <div className="pt-3.5 w-full text-center absolute z-50 text-big">
      Prognoza sprzedaży
      <div className="flex flex-row gap-20 px-12 pt-10 justify-left">
        <div className="bg-white rounded-lg" style={{ width: "300px", height: "600px" }}>
          <div className="flex flex-col h-full">
            <div className="p-4">
              <div className="text-big font-bold">Tabela wynikowa</div>
            </div>
            <div className="bg-ifirma-gray rounded-lg pt-6 ml-5" style={{ width: "260px", height: "515px" }}>
              <div className="bg-ifirma-orange mx-2 rounded">
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    label="Wyszukaj konkretną datę"
                    value={selectedDate}
                    onChange={setSelectedDate}
                    inputFormat="DD/YYYY/MM"
                    components={{
                      TextField: (props) => <TextField {...props} />
                    }}
                  />
                </LocalizationProvider>
              </div>
              <div className="overflow-y-auto" style={{ height: "380px", marginTop: "20px", paddingRight: "10px" }}>
                {filterDateValues().map((item, index) => (
                  <div key={index} className="p-2">
                    {`${item.date}, ${item.value}`}
                    <div
                      className="border-b border-1 border-black"
                      style={{ width: "240px" }}
                    ></div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <button
                  onClick={() => downloadCSV(filterDateValues())}
                  className="py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
                  style={{ width: "220px", marginTop: "55px" }}
                >
                  Pobierz dane
                </button>
              </div>
            </div>
          </div>
        </div>
        <div style={{ flex: 1, minHeight: '600px', paddingTop: "90px" }}>
          <Chart csvFilePath="/data.csv" />
          <div className="mt-4 flex justify-center">
            <button
              onClick={handleDownloadChartImage}
              className="py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              style={{ width: "240px" }}
            >
              Pobierz wykres
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutputSales;
