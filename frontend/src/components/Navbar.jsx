import React, { useState } from "react";
import Ifirma from "../assets/ifirma.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  let navigate = useNavigate();
  const [isLogoClicked, setLogoClicked] = useState(false); // State to manage the logo click animation

  const handleLogoClick = () => {
    setLogoClicked(true); // Activate animation effect
    setTimeout(() => {
      setLogoClicked(false); // Reset the animation state after a brief period
      navigate("/"); // Navigate to the homepage
    }, 150); // Duration of the animation
  };

  return (
    <nav
      className="bg-white fixed top-0 left-0 right-0 flex items-center justify-center"
      style={{ height: "60px" }}
    >
      <img
        onClick={handleLogoClick}
        src={Ifirma}
        alt="Logo"
        className={`absolute top-0.5 left-5 cursor-pointer transition duration-150 ease-in-out transform ${
          isLogoClicked ? "scale-90" : "hover:scale-105"
        }`}
        style={{ width: "100px", height: "auto" }}
      />

      <div
        className="bg-ifirma-orange rounded-lg "
        style={{ width: "500px", height: "40px" }}
      ></div>
    </nav>
  );
};

export default Navbar;
