import React, { useState } from "react";
import Attributes from "./Attributes";
import { useNavigate } from "react-router-dom";
import Allegro from "../assets/allegro.png";

const ImportAllegroDemand = () => {
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
          style={{ width: "450px", height: "500px", marginTop: "50px" }}
        >
          <div className="text-bold text-2xl " style={{ marginTop: "20px" }}>
            Wybierz przed wczytaniem:
          </div>
          <div className="" style={{ marginTop: "20px" }}>
            <div className="top-[40x] h-[70px]">
              <Attributes />
            </div>
          </div>
          <div className="" style={{ marginTop: "250px" }}>
            <button
              onClick={handleButtonClick}
              className={`py-3 px-6 bg-ifirma-orange text-black font-bold rounded-full flex justify-between items-center transition duration-150 ease-in-out transform ${
                isClicked
                  ? "scale-90 opacity-75"
                  : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              }`}
              style={{ width: "250px" }}
            >
              <span style={{ marginLeft: "10px" }}>Wczytaj plik z</span>
              <img
                src={Allegro}
                alt="Logo"
                className=""
                style={{ width: "70px", height: "auto", marginRight: "10px" }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportAllegroDemand;
