import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Ifirma from "../assets/ifirma.png";
import Allegro from "../assets/allegro.png";
import WooCommerce from "../assets/woocommerce.png";

const Home = () => {
  let navigate = useNavigate();
  const [isFileClicked, setFileClicked] = useState(false);
  const [isAllegroClicked, setAllegroClicked] = useState(false);
  const [isWooClicked, setWooClicked] = useState(false);

  const handleButtonClick = (path, setClicked) => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      navigate(path);
    }, 150);
  };


  return (
    <>
      <div className="flex justify-center h-screen" style={{paddingTop: "150px"}}>
          <div
            className="bg-white rounded-lg hover:scale-105 transition duration-150 ease-in-out transform"
            style={{ width: "600px", height: "300px" }}
          >
            <div className="flex flex-col h-full">
                <div className="pt-5 pb-3 text-[2rem] text-center " style={{ lineHeight: "1.5" }}>
                  Poznaj możliwości sprzedażowe <br/> swojej firmy!
                </div>
                <div
                      className="mx-auto border border-black"
                      style={{ width: "550px" }}
                    ></div>
                <div className="pt-6 pb-6 text-[1.5rem] text-center " style={{ lineHeight: "1.5" }}>
                  Wczytaj dane z:
                </div>
              <div className="flex flex-row gap-4 justify-center">
                <button
              onClick={() =>
                handleButtonClick("/import-file-sale", setFileClicked)
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
                handleButtonClick("/import-allegro-sale", setAllegroClicked)
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
                handleButtonClick("/import-woo-sale", setWooClicked)
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
        </div>
    </>
  );
};

export default Home;
