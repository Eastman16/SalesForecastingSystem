import React, { useState } from "react";
import Attributes from "./AttributesAllegro";

const ImportAllegroSales = () => {
  return (
    // Displaying attributes and buttons related to Allegro
    <>
      <div className="flex justify-center h-screen">
        <div className="bg-white rounded-lg relative flex flex-col items-center pt-3 w-[450px] h-[470px] mt-[50px]">
          <div className="text-bold text-2xl mt-[20px]">
            Wybierz przed wczytaniem:
          </div>
          <div className="mt-[20px]">
            <div className="top-[40x] h-[70px]">
              <Attributes />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportAllegroSales;
