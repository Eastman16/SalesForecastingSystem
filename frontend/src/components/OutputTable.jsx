import React, { useState } from "react";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TextField } from "@mui/material";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

const OutputTable = ({ storedData, dateValues }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isDownloadClicked, setDownloadClicked] = useState(false);

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

  const downloadCSV = (data) => {
    const csvRows = [];
    data.forEach((item) => {
      csvRows.push(`${item.ds},${item.yhat}`);
    });

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
    <div
      className="bg-white rounded-lg mt-2"
      style={{ width: "600px", height: "550px" }}
    >
      <div className="flex flex-col h-full">
        <div className="p-2 text-big font-bold text-center">
          Tabela wynikowa
        </div>
        <div
          className="bg-ifirma-gray rounded-lg pt-4 flex flex-col items-center"
          style={{ width: "560px", height: "480px", margin: "auto" }}
        >
          <div
            className="flex flex-row justify-center items-center"
            style={{ width: "100%", padding: "10px" }}
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-row items-center gap-4">
                <DatePicker
                  label="Start date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => (
                    <TextField {...params} style={{ marginBottom: "10px" }} />
                  )}
                  format="DD-MM-YYYY"
                />
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
          <div
            className="overflow-y-auto bg-ifirma-orange rounded-lg"
            style={{
              height: "380px",
              marginTop: "20px",
              marginBottom: "20px",
              textAlign: "center",
              border: "1px solid black",
            }}
          >
            {filterDateValues().map((item, index) => (
              <div key={index} className="p-2">
                {`${item.ds}, ${parseFloat(item.yhat).toFixed(2)}`}
                <div
                  className="border-b border-1 border-black"
                  style={{ width: "240px", margin: "0 auto" }}
                ></div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            onClick={() => {
              setDownloadClicked(true);
              downloadCSV(filterDateValues());
              setTimeout(() => {
                setDownloadClicked(false);
              }, 150);
            }}
            className={`py-2 mt-3 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform ${
              isDownloadClicked
                ? "scale-90 opacity-75"
                : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
            }`}
            style={{ width: "220px", marginTop: "20px" }}
          >
            Pobierz dane
          </button>
        </div>
      </div>
    </div>
  );
};

export default OutputTable;
