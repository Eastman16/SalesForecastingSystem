import React, { useState, useRef } from "react";
import SelectItem from "./SelectItem";
import businessType from "../lists/businessType.json";
import country from "../lists/countryList.json";
import predictionLength from "../lists/predictionLength.json";
import predictionFrequency from "../lists/predictionFrequency.json";
import sunday from "../lists/sunday.json";

function Attributes() {
  const [selectedOptions, setSelectedOptions] = useState({
    businessType: "",
    country: "",
    predictionLength: "",
    predictionFrequency: "",
    sunday: "",
  });

  const handleDropdownChange = (name, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
  };

  const isAllSelected = Object.values(selectedOptions).every(
    (option) => option !== ""
  );

  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Pobieramy pierwszy wybrany plik
    if (file) {
      const fileName = file.name;
      const extension = fileName.split(".").pop(); // Pobieramy rozszerzenie pliku
      if (extension === "xlsx" || extension === "txt") {
        console.log("Wybrany plik:", file);
        // Tutaj możesz wykonać operacje na wybranym pliku
      } else {
        alert("Wybierz plik w formacie .xlsx lub .txt");
      }
    }
  };

  return (
    <div>
      <div className="top-[40x] h-[60px]">
        <SelectItem
          formName="Rodzaj biznesu"
          listData={businessType}
          onChange={(value) => handleDropdownChange("businessType", value)}
        />
      </div>
      <div className="">
        <SelectItem
          formName="Kraj"
          listData={country}
          onChange={(value) => handleDropdownChange("country", value)}
        />
      </div>
      <div className="" style={{ marginTop: "10px" }}>
        <SelectItem
          formName="Długość predykcji"
          listData={predictionLength}
          onChange={(value) => handleDropdownChange("predictionLength", value)}
        />
      </div>
      <div className="" style={{ marginTop: "10px" }}>
        <SelectItem
          formName="Cykliczność predykcji"
          listData={predictionFrequency}
          onChange={(value) =>
            handleDropdownChange("predictionFrequency", value)
          }
        />
      </div>
      <div className="" style={{ marginTop: "10px" }}>
        <SelectItem
          formName="Sprzedaż w niedziele niehandlowe"
          listData={sunday}
          onChange={(value) => handleDropdownChange("sunday", value)}
        />
      </div>
      <div className="flex justify-center" style={{ marginTop: "20px" }}>
        <input
          type="file"
          accept=".xlsx, .txt"
          ref={fileInputRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <button
          className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform ${
            isAllSelected
              ? "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              : "opacity-50 cursor-not-allowed"
          }`}
          style={{ width: "200px" }}
          disabled={!isAllSelected}
          onClick={() => fileInputRef.current.click()}
        >
          Wczytaj plik
        </button>
      </div>
    </div>
  );
}

export default Attributes;