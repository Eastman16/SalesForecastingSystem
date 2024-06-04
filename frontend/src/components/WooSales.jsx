import { useEffect } from "react";
import React from "react";
import { useLocation } from 'react-router-dom';


const useQuery = () => {
    return new URLSearchParams(useLocation().search);
  }

const WooSales = () => {
    const query = useQuery();

    useEffect(() => {
        const params = {};
        query.forEach((value, key) => {
        params[key] = value;
      

        });
        console.log(params);
    
        fetch(`https://predykcjakpz.servehttp.com/api?${query.toString()}`)
        .then(response => response.json())
        .catch(error => console.error('Error fetching data:', error));
   
     }, [query]);



    return <p> Working in the background</p>

}

export default WooSales;