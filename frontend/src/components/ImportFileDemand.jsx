import React, { useState } from "react";
import Attributes from "./Attributes";
import { useNavigate } from "react-router-dom";

const ImportFileDemand = () => {
  let navigate = useNavigate();
  const [isClicked, setIsClicked] = useState(false);

  const handleButtonClick = () => {
    setIsClicked(true); // Activate animation effect
    setTimeout(() => {
      setIsClicked(false); // Reset the button state
      navigate("/demand-prediction"); // Navigate after a slight delay to show the effect
    }, 150); // Duration of the animation
  };

  return (
    <>
      <div className="pt-3.5 w-full text-center absolute z-50 text-big">
        Prognoza zapotrzebowania
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
            className="bg-ifirma-gray mt-3 rounded-lg relative flex flex-col gap-2.5 items-center "
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
              <Attributes />
            </div>
          </div>
          <div className="" style={{ marginTop: "230px" }}>
            <button
              onClick={handleButtonClick}
              className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform ${
                isClicked
                  ? "scale-90 opacity-75"
                  : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              }`}
              style={{ width: "200px" }}
            >
              Wczytaj plik
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportFileDemand;
