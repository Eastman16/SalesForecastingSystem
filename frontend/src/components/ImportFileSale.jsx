import React, { useRef, useState } from "react";
import Attributes from "./Attributes";
import { useNavigate } from "react-router-dom";

const ImportFileSale = () => {
  const fileInputRef = useRef(null);

  const navigate = useNavigate();

  // Function to handle file input change
  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Getting the first file from the input
    if (file) {
      const fileName = file.name;
      const extension = fileName.split(".").pop(); // Extracting the file extension
      // Checking if the file extension is valid
      if (extension === "xlsx" || extension === "txt" || extension === "csv") {
        console.log("Wybrany plik:", file); // Logging the selected file
        navigate("/output-sales");
      } else {
        alert("Wybierz plik w formacie .xlsx lub .txt");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center h-screen">
        <div className="bg-white rounded-lg relative flex flex-col items-center pt-3 w-[450px] h-[700px] mt-[50px]">
          <div className="w-96 h-[100px] text-center mt-[20px]">
            <div className="text-black text-2xl font-medium font-ibm-plex-sans">
              Każdy wiersz danych powinien
              <br />
              wyglądać w ten sposób
              <br />
            </div>
            <div className="text-black text-small font-light font-ibm-plex-sans">
              (w innym przypadku predykcja nie zadziała)
            </div>
          </div>
          {/* Example of correct data format */}
          <div className="bg-ifirma-gray mt-1 pt-3 rounded-lg flex flex-col items-center w-[350px] h-[120px] text-bold text-2xl">
            2021-10-01,3214.129 <br />
            2021-10-02,4321.876 <br />
            2021-10-03,2874.345
          </div>
          <div>*pamiętaj o odzieleniu daty przecinkiem!</div>
          <div className="pt-5 top-[40x] h-[70px]">
            <Attributes />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportFileSale;
