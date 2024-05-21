import React, { useState } from "react";
import OutputChart from "./OutputChart";
import OutputTable from "./OutputTable";

const OutputSales = () => {
  // State to manage which component to display (chart or table)
  const [selectedComponent, setSelectedComponent] = useState("chart");

  // Function to handle button click and update selectedComponent state
  const handleButtonClick = (component) => {
    setSelectedComponent(component);
  };

  // Retrieve stored data from sessionStorage and parse it
  const storedData = sessionStorage.getItem("myData");
  const dateValues = Object.values(JSON.parse(storedData) || {});

  return (
    <>
      {/* Container for selecting chart or table */}
      <div className="flex flex-col items-center pt-5">
        {/* Buttons to select chart or table */}
        <div className="flex flex-row gap-4 mb-4 bg-white rounded-lg transition duration-150 ease-in-out transform justify-center items-center w-[200px] h-[60px]">
          {/* Button to select chart */}
          <button
            onClick={() => handleButtonClick("chart")}
            className={`py-2 px-4 font-bold rounded ${
              selectedComponent === "chart"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Chart
          </button>
          {/* Button to select table */}
          <button
            onClick={() => handleButtonClick("table")}
            className={`py-2 px-4 font-bold rounded ${
              selectedComponent === "table"
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            Table
          </button>
        </div>
        {/* Render OutputChart component if selectedComponent is "chart" */}
        {selectedComponent === "chart" && (
          <OutputChart storedData={storedData} dateValues={dateValues} />
        )}
        {/* Render OutputTable component if selectedComponent is "table" */}
        {selectedComponent === "table" && (
          <OutputTable storedData={storedData} dateValues={dateValues} />
        )}
      </div>
    </>
  );
};

export default OutputSales;
