import React, { useState } from "react";
import OutputChart from "./OutputChart";
import OutputTable from "./OutputTable";

const OutputSales = () => {
  const [selectedComponent, setSelectedComponent] = useState('chart');

  const handleButtonClick = (component) => {
    setSelectedComponent(component);
  };

  const storedData = sessionStorage.getItem('myData');
  const dateValues = Object.values(JSON.parse(storedData) || {});

  return (
    <>
      <div className="flex flex-col items-center" style={{paddingTop: "80px"}}>
        <div
          className="flex flex-row gap-4 mb-4 bg-white rounded-lg transition duration-150 ease-in-out transform justify-center items-center"
          style={{ width: "200px", height: "60px" }}
        >
            <button
              onClick={() => handleButtonClick('chart')}
              className={`py-2 px-4 font-bold rounded ${
                selectedComponent === 'chart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              Chart
            </button>
            <button
              onClick={() => handleButtonClick('table')}
              className={`py-2 px-4 font-bold rounded ${
                selectedComponent === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'
              }`}
            >
              Table
            </button>
          </div>
        {selectedComponent === 'chart' && <OutputChart storedData={storedData} dateValues={dateValues} />}
          {selectedComponent === 'table' && <OutputTable storedData={storedData} dateValues={dateValues} />}
      </div>
    </>
  );
};

export default OutputSales;
