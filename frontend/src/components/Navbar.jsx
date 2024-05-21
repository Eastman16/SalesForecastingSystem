import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Ifirma from "../assets/ifirma.png";

const Navbar = () => {
  let navigate = useNavigate();
  const [isButtonClicked, setButtonClicked] = useState(false);

  // Function to handle button click to make animation
  const handleButtonClick = () => {
    setButtonClicked(true);
    setTimeout(() => {
      setButtonClicked(false);
      navigate("/");
    }, 150);
  };

  return (
    <nav className="bg-white flex items-center justify-center z-50 h-[60px] px-5 md:px-10">
      {/* Ifirma logo */}
      <img
        src={Ifirma}
        alt="Logo"
        className="absolute left-5 w-[100px] hidden md:block"
      />
      {/* Button with dynamic classes for animation */}
      <button
        onClick={handleButtonClick}
        className={`bg-ifirma-orange rounded-lg cursor-pointer transition duration-150 ease-in-out transform text-big w-[500px] h-[40px] ${
          isButtonClicked ? "scale-90" : "hover:scale-105"
        }`}
      >
        System prognozy sprzedaży
      </button>
    </nav>
  );
};

export default Navbar;
