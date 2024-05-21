import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat); // Extend dayjs with customParseFormat plugin

const OutputTable = ({ storedData, dateValues }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDownloadClicked, setDownloadClicked] = useState(false);

  // Function to filter date values based on selected start and end dates
  const filterDateValues = () => {
    if (!startDate || !endDate) {
      return dateValues;
    }
    const formattedStartDate = startDate.format("YYYY-MM-DD");
    const formattedEndDate = endDate.format("YYYY-MM-DD");
    return dateValues.filter(
      (item) => item.ds >= formattedStartDate && item.ds <= formattedEndDate
    );
  };

  // Function to download filtered date values as CSV
  const downloadCSV = (data) => {
    const csvRows = data.map(
      (item) => `${item.ds},${parseFloat(item.yhat).toFixed(2)}`
    );
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "dateValues.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white rounded-lg mt-2 w-[600px] h-[550px]">
      <div className="flex flex-col h-full">
        <div className="p-2 text-big font-bold text-center">
          Tabela wynikowa
        </div>
        {/* Date pickers for selecting start and end dates */}
        <div className="bg-ifirma-gray rounded-lg pt-4 flex flex-col items-center mx-auto w-[560px] h-[480px]">
          <div className="flex flex-row justify-center items-center w-full p-2">
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-row items-center gap-4">
                {/* Start date picker */}
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => (
                    <TextField {...params} className="mb-2" />
                  )}
                  format="DD-MM-YYYY"
                />
                {/* End date picker */}
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} />}
                  format="DD-MM-YYYY"
                />
              </div>
            </LocalizationProvider>
          </div>
          {/* Display filtered date values */}
          <div className="overflow-y-auto bg-ifirma-orange rounded-lg mt-4 mb-4 text-center border border-black h-[380px]">
            {filterDateValues().map((item, index) => (
              <div key={index} className="p-2">
                {`${item.ds}, ${parseFloat(item.yhat).toFixed(2)}`}
                <div className="border-b border-black w-[240px] mx-auto"></div>
              </div>
            ))}
          </div>
        </div>
        {/* Button to download data as CSV */}
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              setDownloadClicked(true);
              downloadCSV(filterDateValues());
              setTimeout(() => {
                setDownloadClicked(false);
              }, 150);
            }}
            className={`py-2 mt-5 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform w-[220px] ${
              isDownloadClicked
                ? "scale-90 opacity-75"
                : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
            }`}
          >
            Pobierz dane
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutputTable;
