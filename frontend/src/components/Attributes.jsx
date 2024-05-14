import React, { useState, useRef } from "react";
import axios from 'axios';
import SelectItem from "./SelectItem";
import businessType from "../lists/businessType.json";
import country from "../lists/countryList.json";
import predictionLength from "../lists/predictionLength.json";
import predictionFrequency from "../lists/predictionFrequency.json";
import sunday from "../lists/sunday.json";
import { useNavigate } from "react-router-dom";


function convertToNumericPeriod(periodType, frequencyType) {
  let days = 0;
  switch (periodType) {
    case "Tydzień":
      days = 7;
      break;
    case "Miesiąc":
      days = 30; 
      break;
    case "Kwartał":
      days = 90;
      break;
    case "Rok":
      days = 365;
      break;
    default:
      days = 0; 
  }

  // Ajust days for weekly frequency
  if (frequencyType === "Tygodniowa") {
    return days / 7; // Convert total days to weeks
  } else if (frequencyType === "Miesięczna") {
    return days / 30;
  } else {
    return days;
  }
}

function Attributes() {
  //const navigate = useNavigate();

  const navigate = useNavigate();

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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const extension = fileName.split(".").pop();
      if (["xlsx", "txt", "csv"].includes(extension)) {
        console.log("Selected file:", file);
        try {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("country", selectedOptions.country);
          formData.append("industry", selectedOptions.businessType); // Assuming 'businessType' as 'industry'
          formData.append("isRetail", selectedOptions.sunday === "Tak" ? true : false); // Assuming sunday sales as retail indicator
          const numericPeriod = convertToNumericPeriod(selectedOptions.predictionLength, selectedOptions.predictionFrequency);
          formData.append("period", numericPeriod);
        
          // Convert frequency description to a single character (D, W, M)
          const frequencyChar = selectedOptions.predictionFrequency === "Dzienna" ? "D" :
                              selectedOptions.predictionFrequency === "Tygodniowa" ? "W" : "M";
          formData.append("frequency", frequencyChar);

          const response = await axios.post('http://192.168.195.63:5000/predict', formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          const data =  response.data
          console.log("Server response:", data);

          sessionStorage.setItem('myData', JSON.stringify(data));
          navigate('/output-sales');
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        alert("Please select a file in .xlsx, .csv, or .txt format");
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
          accept=".xlsx, .txt, .csv"
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
