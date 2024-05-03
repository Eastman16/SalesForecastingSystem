import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Chart from "./Chart";
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';



const OutputSales = () => {
 

  return (
    <>
      <div className="pt-3.5 w-full text-center absolute z-50 text-big">
        Prognoza sprzedaży
        <div className="flex flex-row gap-20 px-12 pt-10 justify-left">
          <div
            className="bg-white rounded-lg"
            style={{ width: "300px", height: "600px" }}
          >
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="text-[1.3rem]">Tabela wynikowa</div>
                <div
                  className="border-b border-1 border-black"
                  style={{ width: "270px" }}
                ></div>
              </div>
              <div className="bg-ifirma-orange rounded-lg pt-6 ml-5"
                style={{ width: "260px", height: "515px" }}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer components={['DatePicker']}>
                      <DatePicker label="Wyszukaj konkretną datę" />
                    </DemoContainer>
                  </LocalizationProvider>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, minHeight: '600px' }}>
            <Chart csvFilePath="/data.csv" />
          </div>
        </div>

      </div>
    </>
  );
};

export default OutputSales;
