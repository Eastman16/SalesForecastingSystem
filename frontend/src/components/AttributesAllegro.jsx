import React, { useState, useEffect } from "react";
import axios from "axios";
import SelectItem from "./SelectItem";
import businessType from "../lists/businessType.json";
import country from "../lists/countryList.json";
import predictionFrequency from "../lists/predictionFrequency.json";
import Allegro from "../assets/allegro.png";
import convertToNumericPeriod from "./Attributes";
import { useNavigate, useLocation } from "react-router-dom";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

function AttributesAllegro() {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const allegroCode = searchParams.get("code");

  const CLIENT_ID = "3e70bfb322f446ab836e553d44ef807f"; //  CLIENT_ID z Allegro
  const CLIENT_SECRET = "xOtaFv1BcdQ2dUkgmbZyaUCCdLT6f1JwsT1lfrIotzT5v0qmwjrk0hwzEztthd8x"; //  CLIENT_SECRET z Allegro
  const REDIRECT_URI = "https://predykcjakpz.servehttp.com/import-allegro-sale"; // Twój REDIRECT_URI
  const TOKEN_ENDPOINT = "https://allegro.pl/auth/oauth/token"; // Stały endpoint tokenu

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

  const fetchAccessToken = async (code) => {
    try {
      const response = await axios.post(
        TOKEN_ENDPOINT,
        new URLSearchParams({
          grant_type: "authorization_code", // Stała wartość dla OAuth 2.0
          code: code,
          redirect_uri: REDIRECT_URI,
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        }),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      const accessToken = response.data.access_token;
      fetchAllegroSalesReport(accessToken);
    } catch (error) {
      console.error("Error fetching access token:", error);
    }
  };

  const fetchAllegroSalesReport = async (token) => {
    try {
      const response = await axios.get(
        "https://api.allegro.pl/sale/reports", // Zamień na poprawny endpoint Allegro
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.allegro.public.v1+json",
          },
        }
      );
      const salesData = response.data;
      console.log("Fetched Allegro sales data:", salesData);

      // Przetwarzanie danych sprzedaży w wymagany format
      const formattedSalesData = salesData.map((item) => {
        const date = item.date;
        const amount = item.amount;
        return `${date},${amount.toFixed(3)}`;
      });

      console.log("Formatted sales data:", formattedSalesData.join("\n"));

      // Wysyłanie sformatowanych danych do backendu
      await sendSalesDataToBackend(formattedSalesData.join("\n"));
    } catch (error) {
      console.error("Error fetching Allegro sales report:", error);
    }
  };

  const sendSalesDataToBackend = async (formattedSalesData) => {
    try {
      const response = await axios.post(
        "http://192.168.195.63:5000/predict",
        {
          salesData: formattedSalesData,
          country: selectedOptions.country,
          industry: selectedOptions.businessType,
          isRetail: selectedOptions.sunday === "Tak" ? true : false,
          period: convertToNumericPeriod(
            selectedOptions.predictionLength,
            selectedOptions.predictionFrequency
          ),
          frequency:
            selectedOptions.predictionFrequency === "Dzienna"
              ? "D"
              : selectedOptions.predictionFrequency === "Tygodniowa"
              ? "W"
              : "M",
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server response:", response.data);
      navigate("/output-sales");
    } catch (error) {
      console.error("Error sending sales data to backend:", error);
    }
  };

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

  const handleAllegroClick = () => {
    if (allegroCode) {
      fetchAccessToken(allegroCode);
    } else {
      alert("Allegro code not found");
    }
  };

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
        ></Slider>
      </div>
      <div className="flex justify-center mt-[30px]">
        <button
          className="py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform w-[220px] flex justify-center items-center hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
          onClick={handleAllegroClick}
        >
          <div>Wczytaj dane z</div>
          <img src={Allegro} alt="Logo" className="ml-1 w-[70px] h-auto" />
        </button>
      </div>
    </div>
  );
}

export default AttributesAllegro;
