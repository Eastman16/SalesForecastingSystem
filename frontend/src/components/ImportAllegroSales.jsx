import React from "react";
import AttributesAllegro from "./AttributesAllegro"; 

const ImportAllegroSales = () => {
  return (
    <>
      <div className="flex justify-center h-screen">
        <div className="bg-white rounded-lg relative flex flex-col items-center pt-3 w-[450px] h-[470px] mt-[50px]">
          <div className="text-bold text-2xl mt-[20px]">
            Wybierz przed wczytaniem:
          </div>
          <div className="mt-[20px]">
            <div className="top-[40x] h-[70px]">
              <AttributesAllegro /> 
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportAllegroSales;
