import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ifirma from "../assets/ifirma.png";

const Navbar = () => {
  let navigate = useNavigate();
  const [isButtonClicked, setButtonClicked] = useState(false);

  const handleButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
      navigate("/");
    }, 150);
  };

  return (
    <nav
      className="bg-white flex items-center justify-center z-50"
      style={{ height: "60px" }}
    >
      <img
        src={Ifirma}
        alt="Logo"
        className={`absolute top-0.5 left-5`}
        style={{ width: "100px", height: "auto" }}
      />

      <button
        onClick={handleButtonClick}
        className={`bg-ifirma-orange rounded-lg cursor-pointer transition duration-150 ease-in-out transform text-big ${
          isButtonClicked ? "scale-90" : "hover:scale-105"
        }`}
        style={{
          width: "500px",
          height: "40px",
          cursor: "pointer",
        }}
      >
        System prognozy sprzedaży
      </button>
    </nav>
  );
};

export default Navbar;
