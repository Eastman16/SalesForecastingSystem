import React from "react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const Home = () => {
  let navigate = useNavigate();
  const [isSalesClicked, setSalesClicked] = useState(false); // State for the sales forecast button
  const [isDemandClicked, setDemandClicked] = useState(false); // State for the demand forecast button

  const handleButtonClick = (path, buttonType) => {
    if (buttonType === "sales") {
      setSalesClicked(true);
    } else if (buttonType === "demand") {
      setDemandClicked(true);
    }
    setTimeout(() => {
      if (buttonType === "sales") {
        setSalesClicked(false);
      } else if (buttonType === "demand") {
        setDemandClicked(false);
      }
      navigate(path);
    }, 150); // Animation duration
  };

  return (
    <>
      <div className="pt-3.5 w-full text-center absolute z-50 text-big">
        System Prognozy Popytu
      </div>

      <div className="flex justify-center items-center h-screen">
        <div
          className="w-full text-center absolute z-50 text-big font-bold"
          style={{ marginTop: "-500px" }}
        >
          Wybierz typ prognozowania:
        </div>
        <div className="grid grid-cols-2 gap-14">
          <div
            className="bg-white rounded-lg hover:scale-105 transition duration-150 ease-in-out transform"
            style={{ width: "300px", height: "370px" }}
          >
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="text-[1.3rem]">Prognoza sprzedaży</div>
                <div
                  className="border-b border-1 border-black"
                  style={{ width: "270px" }}
                ></div>
                <div className="pt-5 text-[2rem]" style={{ lineHeight: "1.3" }}>
                  Poznaj <br />
                  możliwości sprzedażowe <br />
                  swojej firmy!
                </div>
              </div>
              <div className="pt-6 flex justify-center">
                <button
                  onClick={() => handleButtonClick("/login-sales", "sales")}
                  className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform ${
                    isSalesClicked
                      ? "scale-90 opacity-75"
                      : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
                  }`}
                  style={{ width: "200px" }}
                >
                  Wybieram
                </button>
              </div>
            </div>
          </div>
          <div
            className="bg-white rounded-lg hover:scale-105 transition duration-150 ease-in-out transform"
            style={{ width: "300px", height: "370px" }}
          >
            <div className="flex flex-col h-full">
              <div className="p-4">
                <div className="text-[1.3rem]">Prognoza zapotrzebowania</div>
                <div
                  className="border-b border-1 border-black"
                  style={{ width: "270px" }}
                ></div>
                <div className="pt-5 text-[2rem]" style={{ lineHeight: "1.3" }}>
                  Poznaj <br />
                  możliwości sprzedażowe <br />
                  swojej firmy!
                </div>
              </div>
              <div className="pt-6 flex justify-center">
                <button
                  onClick={() => handleButtonClick("/login-demand", "demand")}
                  className={`py-2 bg-ifirma-orange text-black font-bold rounded-full transition duration-150 ease-in-out transform ${
                    isDemandClicked
                      ? "scale-90 opacity-75"
                      : "hover:bg-ifirma-orange-darker hover:scale-105 active:scale-95"
                  }`}
                  style={{ width: "200px" }}
                >
                  Wybieram
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
