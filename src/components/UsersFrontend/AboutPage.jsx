import React from "react";
import { useNavigate } from "react-router-dom";

const About = () => {
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
        <h1 className="text-6xl font-bold font-sans">About Us</h1>
        <p>
Manomilan combines traditional aspects with modern requirements through a most advanced matrimonial website application for different communities throughout India.
Candidates from all religions and castes can register free and access information through premium membership.

The website is a great help to candidates who are offshore or working/living away from home towns and cities for searching through thousands of registered candidates by minimising efforts and saving time. Specific information regarding expectations can be updated at all times online with accuracy, full reliability, confidentiality and privacy.

The site is designed specifically to save time and efforts for searching prospective candidates at far flung locations as photo images can be very easily uploaded.

With rapid increase in internet connectivity and preference for easy and comfortable time schedules this online web applicaton caters to all. Needless to say our offline facilities also help a great deal to search for a right partner.

REACH US Anytime! We are HERE!!!

Manomilan.com 
        </p>
      </div>
      <div className="border-t w-full fixed bottom-0 left-0 border-gray-800 py-8 text-center text-black">
            <p>Powered By - Manisha Systems | Designed and Developed By - Alkesh Mahamune & Manas Kokate</p>
          </div>
    </div>
  );
};

export default About;
