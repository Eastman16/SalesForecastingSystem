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

  const CLIENT_ID = "3e70bfb322f446ab836e553d44ef807f"; 
  const REDIRECT_URI = "https://predykcjakpz.servehttp.com/import-allegro-sale"; 
  const AUTHORIZATION_ENDPOINT = "https://allegro.pl/auth/oauth/authorize";

  const handleButtonClick = (path, setClicked) => {
    setClicked(true);
    setTimeout(() => {
      setClicked(false);
      navigate(path);
    }, 150);
  };

  const handleAllegroLogin = () => {
    setAllegroClicked(true);
    setTimeout(() => {
      setAllegroClicked(false);
      const allegroAuthUrl = `${AUTHORIZATION_ENDPOINT}?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
      window.location.href = allegroAuthUrl;
    }, 150);
  };

  const handleWooLogin = (e) => {
    e.preventDefault();
    const domain = prompt('Please enter your WooCommerce store domain:', 'domenamojegosklepu.pl');
    const userId = 'jan'; 
    const appName = 'SalesPredictor';
    const scope = 'read';
    const returnUrl = `https://127.0.0.1:3000/woo-sales`;
    const callbackUrl = returnUrl; 

    if (domain) {
      window.location.href = `https://${domain}/wc-auth/v1/authorize?app_name=${appName}&scope=${scope}&user_id=${userId}&return_url=${returnUrl}&callback_url=${callbackUrl}`;
    } else {
      alert('Please enter a domain.');
    }
  };

  return (
    <>
      <div className="flex justify-center h-screen pt-[50px]">
        <div className="bg-white rounded-lg hover:scale-105 transition duration-150 ease-in-out transform w-[600px] h-[300px]">
          <div className="flex flex-col h-full">
            <div className="pt-5 pb-3 text-[2rem] text-center leading-[1.5]">
              Poznaj możliwości sprzedażowe <br /> swojej firmy!
            </div>
            <div className="mx-auto border border-black w-[550px]"></div>
            <div className="pt-6 pb-6 text-[1.5rem] text-center leading-[1.5]">
              Wczytaj dane z:
            </div>
            <div className="flex flex-row gap-4 justify-center">
              {/* File button */}
              <button
                onClick={() =>
                  handleButtonClick("/import-file-sale", setFileClicked)
                }
                className={`bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform w-[150px] h-[50px] ${
                  isFileClicked
                    ? "scale-90 opacity-75"
                    : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
                }`}
              >
                <div className="text-[1.4rem]">Pliku</div>
              </button>

              {/* Allegro button */}
              <button
                onClick={handleAllegroLogin}
                className={`bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform w-[150px] h-[50px] ${
                  isAllegroClicked
                    ? "scale-90 opacity-75"
                    : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
                }`}
              >
                <img src={Allegro} alt="Logo" className="w-[100px] h-auto" />
              </button>

              {/* WooCommerce button */}
              <button
                onClick={handleWooLogin}
                className={`bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform w-[150px] h-[50px] ${
                  isWooClicked
                    ? "scale-90 opacity-75"
                    : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
                }`}
              >
                <img
                  src={WooCommerce}
                  alt="Logo"
                  className="pt-1 w-[70px] h-auto"
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
