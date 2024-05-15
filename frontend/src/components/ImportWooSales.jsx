import React from "react";
import AttributesWoo from "./AttributesWoo";

const ImportWooSales = () => {
  return (
    <>
      <div className="flex justify-center h-screen">
        <div
          className="bg-white rounded-lg relative flex flex-col items-center pt-3"
          style={{ width: "450px", height: "470px", marginTop: "50px" }}
        >
          <div className="text-bold text-2xl " style={{ marginTop: "20px" }}>
            Wybierz przed wczytaniem:
          </div>
          <div className="" style={{ marginTop: "20px" }}>
            <div className="top-[40x] h-[70px]">
              <AttributesWoo />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportWooSales;
