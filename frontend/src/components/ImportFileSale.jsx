import React, { useRef, useState } from "react";
import Attributes from "./Attributes";
import { useNavigate } from "react-router-dom";

const ImportFileSale = () => {
  const fileInputRef = useRef(null); // Referencja do elementu input typu file
  const [isAttributesReady, setIsAttributesReady] = useState(false);

  const navigate = useNavigate();


  const handleFileChange = (e) => {
    const file = e.target.files[0]; // Pobieramy pierwszy wybrany plik
    if (file) {
      const fileName = file.name;
      const extension = fileName.split(".").pop(); // Pobieramy rozszerzenie pliku
      if (extension === "xlsx" || extension === "txt") {
        console.log("Wybrany plik:", file);
        // Tutaj możesz wykonać operacje na wybranym pliku
        navigate("/sales-prediction"); // Nawigujemy do strony z prognozą sprzedaży
      } else {
        alert("Wybierz plik w formacie .xlsx lub .txt");
      }
    }
  };

  return (
    <>
      <div className="pt-3.5 w-full text-center absolute z-50 text-big">
        Prognoza sprzedaży
      </div>
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-white rounded-lg relative flex flex-col items-center pt-3"
          style={{ width: "450px", height: "680px", marginTop: "50px" }}
        >
          <div
            className="w-96 h-[100px] text-center"
            style={{ marginTop: "20px" }}
          >
            <span className="text-black text-2xl font-medium font-ibm-plex-sans">
              Każdy wiersz danych powinien
              <br />
              wyglądać w ten sposób
              <br />
            </span>
            <span className="text-black text-small font-light font-ibm-plex-sans">
              (w innym przypadku predykcja nie zadziała)
            </span>
          </div>
          <div
            className="bg-ifirma-gray mt-3 rounded-lg relative flex flex-col gap-2.5 items-center"
            style={{ width: "350px", height: "120px" }}
          >
            <div
              className="text-bold text-2xl h-[24px]"
              style={{ marginTop: "10px" }}
            >
              2021-10-01,3214.129
            </div>
            <div className="text-bold text-2xl h-[24px]">
              2021-10-02,4321.876
            </div>
            <div className="text-bold text-2xl">2021-10-03,2874.345</div>
          </div>
          <div>*pamiętaj o odzieleniu daty przecinkiem!</div>
          <div className="" style={{ marginTop: "20px" }}>
            <div className="top-[40x] h-[70px]">
              <Attributes onReadyChange={setIsAttributesReady} />
            </div>
          </div>
          <div className="" style={{ marginTop: "230px" }}>
            <input
              type="file"
              accept=".xlsx, .txt" // Akceptujemy tylko pliki Excel i tekstowe
              ref={fileInputRef} // Przypisujemy referencję do inputa
              style={{ display: "none" }} // Ukrywamy input
              onChange={handleFileChange} // Obsługa zmiany pliku
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportFileSale;
