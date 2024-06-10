import { useEffect } from "react";
import React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import WooCommerce from "../assets/woocommerce.png";

const ButtonWoocommerce = () => {
    const [isWooClicked, setWooClicked] = useState(false);

    const navigate = useNavigate();

    const redirect = () => {
        setWooClicked(true);
        navigate("/woo-domain-entry")
    }

    return <button
            onClick={redirect}
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

}

export default ButtonWoocommerce;