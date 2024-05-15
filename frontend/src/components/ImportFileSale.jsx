import React, { useRef, useState } from "react";
import Attributes from "./Attributes";
import { useNavigate } from "react-router-dom";

const ImportFileSale = () => {
  const fileInputRef = useRef(null);
  const [isAttributesReady, setIsAttributesReady] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileName = file.name;
      const extension = fileName.split(".").pop();
      if (extension === "xlsx" || extension === "txt" || extension === "csv") {
        console.log("Wybrany plik:", file);
        navigate("/output-sales");
      } else {
        alert("Wybierz plik w formacie .xlsx lub .txt");
      }
    }
  };

  return (
    <>
      <div className="flex justify-center h-screen">
        <div
          className="bg-white rounded-lg relative flex flex-col items-center pt-3"
          style={{ width: "450px", height: "700px", marginTop: "50px" }}
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
          <div className="">
            <div className="pt-5 top-[40x] h-[70px]">
              <Attributes onReadyChange={setIsAttributesReady} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportFileSale;
