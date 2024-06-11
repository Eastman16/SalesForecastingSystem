import { useNavigate } from "react-router-dom";

const WooDomainEntry = () => {

    const handleRedirect = () => {
        const domain = document.getElementById('domain').value;
        const RETURN_URL = `https://127.0.0.1:3000/import-woo-sale?domain=${domain}`;
        const CALLBACK_URL = "https://192.168.100.61/store-keys";
        console.log(domain)

        if (domain) {
            window.location.href = `https://${domain}/wc-auth/v1/authorize?app_name=SalesDataPredictor&scope=read&user_id=${domain}&callback_url=${CALLBACK_URL}&return_url=${RETURN_URL}`;
        }
    }

    return <div className="flex justify-center h-screen pt-[50px]">
        <div className="bg-white rounded-lg hover:scale-105 transition duration-150 ease-in-out transform w-[600px] h-[300px] flex flex-col h-full">
            <label htmlFor="domain" className="pt-5 pb-3 text-[2rem] text-center leading-[1.5]"> Podaj domenę swojego sklepu </label>
            <input id="domain" placeholder="domenatwojegosklepu.pl" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></input>
            <button onClick={handleRedirect} className="bg-ifirma-orange rounded-lg flex justify-center items-center transition duration-150 ease-in-out transform w-[150px] h-[50px]"> Przejdź dalej</button>
        </div>
    </div>
}

export default WooDomainEntry;