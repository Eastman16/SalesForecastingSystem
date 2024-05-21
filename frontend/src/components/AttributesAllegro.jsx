import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import SelectItem from "./SelectItem";
import businessType from "../lists/businessType.json";
import country from "../lists/countryList.json";
import predictionFrequency from "../lists/predictionFrequency.json";
import Allegro from "../assets/allegro.png";
import convertToNumericPeriod from "./Attributes";
import { useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function AttributesAllegro() {
  const navigate = useNavigate();

  // Default options for dropdowns
  const defaultOptions = {
    businessType: businessType.length > 0 ? businessType[0].Type : "",
    country: country.length > 0 ? country[0].Type : "",
    predictionLength: 30,
    predictionFrequency:
      predictionFrequency.length > 0 ? predictionFrequency[0].Type : "",
  };

  const [selectedOptions, setSelectedOptions] = useState(defaultOptions);

  useEffect(() => {
    setSelectedOptions(defaultOptions);
  }, []);

  const handleDropdownChange = (name, value) => {
    setSelectedOptions({
      ...selectedOptions,
      [name]: value,
    });
  };

  const handleSliderChange = (event, value) => {
    setSelectedOptions({
      ...selectedOptions,
      predictionLength: value,
    });
  };

  const fileInputRef = useRef(null);

  // Function to handle file change
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
          formData.append("industry", selectedOptions.businessType);
          formData.append(
            "isRetail",
            selectedOptions.sunday === "Tak" ? true : false
          );
          const numericPeriod = convertToNumericPeriod(
            selectedOptions.predictionLength,
            selectedOptions.predictionFrequency
          );
          formData.append("period", numericPeriod);

          const frequencyChar =
            selectedOptions.predictionFrequency === "Dzienna"
              ? "D"
              : selectedOptions.predictionFrequency === "Tygodniowa"
              ? "W"
              : "M";
          formData.append("frequency", frequencyChar);

          // Sending POST request to server
          const response = await axios.post(
            "http://192.168.195.63:5000/predict",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          console.log("Server response:", response.data);
          navigate("/output-sales");
        } catch (error) {
          console.error("Error uploading file:", error);
        }
      } else {
        alert("Please select a file in .xlsx, .csv, or .txt format");
      }
    }
  };

  const [isFileClickedAllegro, setFileClickedAllegro] = useState(false);

  return (
    // Displaying the entire list of attributes needed for the operation of the AI model, individual attributes are displayed in SelectItem
    <div>
      <div className="top-[40x] h-[60px]">
        <SelectItem
          formName="Rodzaj biznesu"
          listData={businessType}
          onChange={(value) => handleDropdownChange("businessType", value)}
          defaultValue={selectedOptions.businessType}
        />
      </div>
      <div className="mt-[10px]">
        <SelectItem
          formName="Kraj"
          listData={country}
          onChange={(value) => handleDropdownChange("country", value)}
          defaultValue={selectedOptions.country}
        />
      </div>

      <div className="mt-[20px]">
        <SelectItem
          formName="Cykliczność predykcji"
          listData={predictionFrequency}
          onChange={(value) =>
            handleDropdownChange("predictionFrequency", value)
          }
          defaultValue={selectedOptions.predictionFrequency}
        />
      </div>
      <div className="mx-3 mt-2">
        <Typography gutterBottom>Długość predykcji</Typography>
        <Slider
          onChange={handleSliderChange}
          value={selectedOptions.predictionLength}
          min={7}
          max={365}
          valueLabelDisplay="auto"
        ></Slider>
      </div>
      <div className="flex justify-center mt-[30px]">
        <input
          type="file"
          accept=".xlsx, .txt"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
        <button
          className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform w-[220px] flex justify-center items-center ${
            isFileClickedAllegro
              ? "scale-90 opacity-75"
              : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
          }`}
          onClick={() => {
            setFileClickedAllegro(true);
            fileInputRef.current.click();
            setTimeout(() => {
              setFileClickedAllegro(false);
            }, 150);
          }}
        >
          <div>Wczytaj plik z</div>
          <img src={Allegro} alt="Logo" className="ml-1 w-[70px] h-auto" />
        </button>
      </div>
    </div>
  );
}

export default AttributesAllegro;
