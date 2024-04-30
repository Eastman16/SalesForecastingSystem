import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ifirma from "../assets/ifirma.png";
import Allegro from "../assets/allegro.png";
import WooCommerce from "../assets/woocommerce.png";

const LoginDemand = () => {
  let navigate = useNavigate();
  const [isFileClicked, setFileClicked] = useState(false);
  const [isAllegroClicked, setAllegroClicked] = useState(false);
  const [isWooClicked, setWooClicked] = useState(false);

  const handleButtonClick = (path, setClicked) => {
    setClicked(true); // Activate animation effect for the specific button
    setTimeout(() => {
      setClicked(false); // Reset the button state after the animation
      navigate(path); // Navigate after a slight delay to show the effect
    }, 150); // Duration of the animation
  };

  return (
    <>
      <div className="pt-3.5 w-full text-center absolute z-50 text-big">
        Prognoza zapotrzebowania
      </div>
      <div className="flex justify-center items-center h-screen">
        <div
          className="bg-white rounded-lg relative flex flex-col items-center hover:scale-105 transition duration-150 ease-in-out transform"
          style={{ width: "300px", height: "400px" }}
        >
          <img
            src={Ifirma}
            alt="Logo"
            className="pt-3"
            style={{ width: "100px", height: "auto" }}
          />
          <div
            className="bg-ifirma-gray mt-3 rounded-lg relative flex flex-col gap-3.5 items-center"
            style={{ width: "250px", height: "290px" }}
          >
            <div className="pt-4 pb-1 text-[1.35rem]">Pobierz dane z:</div>
            <button
              onClick={() =>
                handleButtonClick("/import-file-demand", setFileClicked)
              }
              className={`bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform ${
                isFileClicked
                  ? "scale-90 opacity-75"
                  : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              }`}
              style={{ width: "150px", height: "50px" }}
            >
              <div className="text-[1.4rem]">Pliku</div>
            </button>
            <button
              onClick={() =>
                handleButtonClick("/import-allegro-demand", setAllegroClicked)
              }
              className={`bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform ${
                isAllegroClicked
                  ? "scale-90 opacity-75"
                  : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              }`}
              style={{ width: "150px", height: "50px" }}
            >
              <img
                src={Allegro}
                alt="Logo"
                style={{ width: "100px", height: "auto" }}
              />
            </button>
            <button
              onClick={() =>
                handleButtonClick("/import-woo-demand", setWooClicked)
              }
              className={`bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform ${
                isWooClicked
                  ? "scale-90 opacity-75"
                  : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
              }`}
              style={{ width: "150px", height: "50px" }}
            >
              <img
                src={WooCommerce}
                alt="Logo"
                className="pt-1"
                style={{ width: "70px", height: "auto" }}
              />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginDemand;
