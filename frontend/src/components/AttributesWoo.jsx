import React, { useState, useRef } from "react";
import axios from 'axios';
import SelectItem from "./SelectItem";
import businessType from "../lists/businessType.json";
import country from "../lists/countryList.json";
import predictionLength from "../lists/predictionLength.json";
import predictionFrequency from "../lists/predictionFrequency.json";
import WooCommerce from "../assets/woocommerce.png";
import convertToNumericPeriod from "./Attributes";
import { useNavigate } from "react-router-dom";

function AttributesWoo() {
    const navigate = useNavigate();

    const [selectedOptions, setSelectedOptions] = useState({
        businessType: "",
        country: "",
        predictionLength: "",
        predictionFrequency: "",
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
              formData.append("industry", selectedOptions.businessType);
              formData.append("isRetail", selectedOptions.sunday === "Tak" ? true : false);
              const numericPeriod = convertToNumericPeriod(selectedOptions.predictionLength, selectedOptions.predictionFrequency);
              formData.append("period", numericPeriod);
            
              const frequencyChar = selectedOptions.predictionFrequency === "Dzienna" ? "D" :
                                  selectedOptions.predictionFrequency === "Tygodniowa" ? "W" : "M";
              formData.append("frequency", frequencyChar);
    
              const response = await axios.post('http://192.168.195.63:5000/predict', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data',
                },
              });
    
              console.log("Server response:", response.data);
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
            <div className="" style={{ marginTop: "10px" }}>
                <SelectItem
                    formName="Kraj"
                    listData={country}
                    onChange={(value) => handleDropdownChange("country", value)}
                />
            </div>
            <div className="" style={{ marginTop: "20px" }}>
                <SelectItem
                    formName="Długość predykcji"
                    listData={predictionLength}
                    onChange={(value) => handleDropdownChange("predictionLength", value)}
                />
            </div>
            <div className="" style={{ marginTop: "20px" }}>
                <SelectItem
                    formName="Cykliczność predykcji"
                    listData={predictionFrequency}
                    onChange={(value) =>
                        handleDropdownChange("predictionFrequency", value)
                    }
                />
            </div>

            <div className="flex justify-center" style={{ marginTop: "30px" }}>
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
                    style={{
                        width: "200px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                    disabled={!isAllSelected}
                    onClick={() => fileInputRef.current.click()}
                >
                    <span style={{ marginLeft: "0px" }}>Wczytaj plik z </span>
                    <img
                        src={WooCommerce}
                        alt="Logo"
                        className=""
                        style={{
                            width: "45px",
                            height: "auto",
                            marginLeft: "6px",
                        }}
                    />
                </button>
            </div>
        </div>
    );
}

export default AttributesWoo;
