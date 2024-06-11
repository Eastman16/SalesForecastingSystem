import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectItem from "./SelectItem";
import businessType from "../lists/businessType.json";
import country from "../lists/countryList.json";
import predictionFrequency from "../lists/predictionFrequency.json";
import WooCommerce from "../assets/woocommerce.png";
import convertToNumericPeriod from "./Attributes";
import { useNavigate } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function AttributesWoo() {
  const navigatewoo = useNavigate();

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
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      [name]: value,
    }));
  };

  const handleSliderChange = (event, value) => {
    setSelectedOptions((prevOptions) => ({
      ...prevOptions,
      predictionLength: value,
    }));
  };

  const handleButtonWoo = async () => {
    setFileClickedWoo(true)
    try {
      const formData = new FormData();
      formData.append("country", selectedOptions.country);
      formData.append("industry", selectedOptions.businessType);
      formData.append(
        "isRetail",
        selectedOptions.sunday === "Tak" ? true : false
      );
      
      //const numericPeriod = convertToNumericPeriod(
      //  selectedOptions.predictionLength,
      //  selectedOptions.predictionFrequency
      //);

      formData.append("period", 1); //numericperiod

      const frequencyChar =
        selectedOptions.predictionFrequency === "Dzienna"
          ? "D"
          : selectedOptions.predictionFrequency === "Tygodniowa"
          ? "W"
          : "M";
      formData.append("frequency", frequencyChar);

      const urlSearchString = window.location.search;
      const params = new URLSearchParams(urlSearchString);
      formData.append("user-id", params.get('domain'));

      const response = await axios.post(
        "http://127.0.0.1:5000/predict-woo",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Server response:", response.data);
      
      navigatewoo("/output-sales");

    } catch (error) {
      console.error("Error:", error);
    }
  };

  const [isFileClickedWoo, setFileClickedWoo] = useState(false);

  return (
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
        />
      </div>
      <div className="flex justify-center mt-[30px]">
        <button
          className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform w-[200px] flex justify-center items-center ${
            isFileClickedWoo
              ? "scale-90 opacity-75"
              : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
          }`}
          onClick={handleButtonWoo}
        >
          <div>Przewidywania </div>
          <img
            src={WooCommerce}
            alt="Logo"
            className="w-[45px] h-auto ml-[6px]"
          />
        </button>
      </div>
    </div>
  );
}

export default AttributesWoo;
