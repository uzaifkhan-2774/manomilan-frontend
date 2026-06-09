import React from "react";
import { useNavigate } from "react-router-dom";

const Contact = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full broder border-gray-100 p-2 h-svh flex flex-col gap-8">
      <div className="w-full flex justify-end">
        <button
          onClick={() => navigate("/")}
          className="py-1 px-2 border font-semibold"
        >
          Back to Login
        </button>
      </div>
      <div className="p-2 flex flex-col gap-8">
        <h1 className="text-6xl font-bold font-sans">Contact Us</h1>
        <div className="flex flex-col gap-8">
          <h1 className="font-semibold text-xl">Address</h1>
          <p>
            Manomilan Technologies <br />
            Shop No. SF / 53, <br />
            Vidarbha Sahitya Sangh Sankul, <br />
            Above Nilawar Saree Stores, <br />
            Jhansi Rani Square, <br />
            Sitabuldi, Nagpur - 440012.
          </p>
          <p>
            <span className="font-semibold text-lg">Email :</span>{" "}
            mymanomilan@gmail.com <br />
            <span className="font-semibold text-lg">Mobile : </span>7020025404 / 8208280085
          </p>
        </div>
      </div>
      <div className="border-t w-full fixed bottom-0 left-0 border-gray-800 py-8 text-center text-black">
        <p>
          Powered By - Manisha Systems | Designed and Developed By - Alkesh
          Mahamune, Manas Kokate & Uzaif Khan
        </p>
      </div>
    </div>
  );
};

export default Contact;
