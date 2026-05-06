// primary color used :#7d0a0a
import React from "react";
import { Navigate, useNavigate } from "react-router-dom";
import petals from "../assets/FlowerPetal.png";
import pinkPetals from "../assets/pinkPetal.png";
import basicNeeds from "../assets/basic-needs.png";
import dataSecurity from "../assets/dataSecurity.png";
import mutualMatching from "../assets/mutualMatching.png";
import offline from "../assets/Offiline.png";
import responsibility from "../assets/responsibility.png";
import tag from "../assets/tag.png";
import worldwide from "../assets/worldwide.png";
import manomilanBanner from '../assets/manomilanBanner.png'
import ClideBnr from '../assets/ClideBnr.jpg'
import GetListed from '../assets/GetListed.jpg'
// import CoupleHand from '../assets/CoupleHand.jpeg'
// import CoupleHandT from '../assets/CoupleHand2.jpeg'
// import CouplePhoto from '../assets/CouplePhoto.jpeg'
// import CouplePhotoT from '../assets/CouplePhoto2.jpeg'
import CardsStories from "./CardsStories.jsx";



const Banner = () => {
  const Navigate=useNavigate();

  const gotoRegister=()=>{
    Navigate('/register')
  }

  const gotoLogin=()=>{
    Navigate('/login')
  }

  return (
    <div className="bg-red-50">
      {/* banner start  */}
      <div className="w-[100%]  h-auto md:h-[100vh] flex flex-col md:flex-row bg-red-50">
        {/* banner petals design */}
        <div className="hidden md:flex">
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-7 right-1"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[10%] right-[40%] rotate-[40deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[90%] right-[74%] rotate-[18deg]"
          />
          <img
            src={petals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[56%] right-[18%] rotate-[60deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[26%] right-[33%] rotate-[60deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[43%] right-[10%] rotate-[90deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[20%] right-[20%] rotate-[49deg]"
          />
          <img
            src={petals}
            alt=""
            width={"40px"}
            className="absolute z-50 bottom-[20%] left-[60%] rotate-[35deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[74%] right-[20%] rotate-[60deg]"
          />
          <img
            src={petals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[86%] right-[49%] rotate-[90deg]"
          />
          <img
            src={petals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[8%] right-[25%] rotate-[30deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[8%] right-[10%] rotate-[80deg]"
          />
          <img
            src={petals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[25%] right-[5%] rotate-[95deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 top-[20%] right-[20%] rotate-[45deg]"
          />
          <img
            src={petals}
            alt=""
            width={"40px"}
            className="absolute z-50 bottom-[12%] right-[8%] rotate-[86deg]"
          />
          <img
            src={pinkPetals}
            alt=""
            width={"40px"}
            className="absolute z-50 bottom-[12%] right-[28%] rotate-[86deg]"
          />
        </div>
        {/* banner petals design end */}

        {/* banner image */}
        <div className="w-full md:w-[60%] h-[80%] md:h-full md:relative">
          <div className="z-[500] w-full h-[80vh] md:w-[900px] md:h-[900px] bg-center bg-no-repeat md:rounded-full mx-auto md:mt-10 shadow-xl md:absolute md:top-[-240px] md:left-[-70px] bgBanner md:custom-bg-position"></div>
        </div>
        {/* banner image end */}

        {/* navbar start */}
        <div className="md:w-[51%] w-[100%] h-[50px] absolute right-0 top-0">
          <ul className="w-[100%] h-[100%] justify-between flex list-none px-[50px] items-center text-black font-semibold">
            <li className="cursor-pointer">Home</li>
            <li className="cursor-pointer">About Us</li>
            <li className="cursor-pointer">Help</li>
            <li className="cursor-pointer">Contact Us</li>
          </ul>
        </div>
        {/* navbar end */}

        {/* banner matter */}
        <div className="w-[100%] md:w-[50%] md:h-[100%] flex justify-center items-center">
          <div className="md:px-4 px-0">
            <h6 className="font-semibold text-xl text-[#d52424] ">Find Your</h6>
            <h1 className="font-bold text-7xl font-serif mt-2">Best Match</h1>
            <p className="text-left mt-4 md:w-[85%] w-[100%]">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Non
              quasi quis at aspernatur? V saepe recusandae, deleniti maxime
              maiores accusantium voluptates provident.
            </p>
            <div className="w-[100%] mt-6 flex gap-[20px]">
              <button onClick={gotoRegister} className="border-1 p-[9px] bg-[#7d0a0a] text-white font-semibold text-[16px] rounded-bl-[20px] rounded-br-[20px] rounded-tl-[20px] cursor-pointer hover:bg-transparent hover:text-[#7d0a0a] transition-all">
                Register for Free
              </button>
              <button onClick={gotoLogin} className="border-[#7d0a0a] border-1 px-[10px] py-[8px] cursor-pointer font-semibold hover:bg-[#7d0a0a] hover:text-white transition-all hover:border-[#d52424] w-[15%] rounded-bl-[20px] rounded-br-[20px] rounded-tr-[20px]">
                Login
              </button>
            </div>
          </div>
        </div>
        {/* banner matter end */}
      </div>
      {/* banner end */}

      {/* Main Start */}
      <div className="w-[90%] mx-auto h-[200vh]">
        <h1 className="text-6xl text-center mt-2 text-[#7d0a0a] font-semibold font-serif">
          Why Choose Us
        </h1>

        <ul className="w-[100%] flex justify-between md:mt-[80px] text-center">
          <li>
            <span>
              <img
                src={mutualMatching}
                alt=""
                width={"40px"}
                className="mx-auto"
              />
            </span>
            <p className="mt-4">Mutual Matching</p>
          </li>
          <li>
            <span>
              <img
                src={dataSecurity}
                alt=""
                width={"40px"}
                className="mx-auto"
              />
            </span>
            <p className="mt-4">Secure Database</p>
          </li>
          <li>
            <span>
              <img src={worldwide} alt="" width={"40px"} className="mx-auto" />
            </span>
            <p className="mt-4">Wide Research</p>
          </li>
          <li>
            <span>
              <img src={tag} alt="" width={"40px"} className="mx-auto" />
            </span>
            <p className="mt-4">Genuine Information</p>
          </li>
          <li>
            <span>
              <img src={offline} alt="" width={"40px"} className="mx-auto" />
            </span>
            <p className="mt-4">Offiline Supports and Events</p>
          </li>
          <li>
            <span>
              <img src={basicNeeds} alt="" width={"40px"} className="mx-auto" />
            </span>
            <p className="mt-4">Home Services</p>
          </li>
          <li>
            <span>
              <img
                src={responsibility}
                alt=""
                width={"40px"}
                className="mx-auto"
              />
            </span>
            <p className="mt-4">Introductory Benifits</p>
          </li>
        </ul>

        <div className="w-[100%] flex justify-between items-start md:mt-[40px]">
          <div className="w-[70%]">
            <p className="py-4 text-[#7d0a0a] md:mt-8">       	
              This exclusive facility has been provided to minimise efforts to a large extent for search of right candidates. Expectations from both sides are analysed by this advanced computer program and only those candidates confirming to the expectations are shortlisted and displayed in the matching list. The expectation criteria can always be altered to get a fresh matching list.
            </p>
            <p className="py-4 text-[#7d0a0a]">       	
              This exclusive facility has been provided to minimise efforts to a large extent for search of right candidates. Expectations from both sides are analysed by this advanced computer program and only those candidates confirming to the expectations are shortlisted and displayed in the matching list. The expectation criteria can always be altered to get a fresh matching list.
            </p>
            <div className="flex md:mt-4 justify-center">
              <div className="w-[50%]">
                <img src={ClideBnr} alt="" />
              </div>
              <div className="w-[50%]">
                <img src={GetListed} alt="" />
              </div>
            </div>
          </div>
          <div className="w-[30%]">
            <img src={manomilanBanner} alt=""  width={'100%'}/>
          </div>
        </div>

        {/* cards Start */}
          <div className="w-[100%]  md:mt-[80px]">
            <h1 className="text-6xl text-center mt-2 text-[#7d0a0a] font-semibold font-serif">
              Our Successfull Matches
            </h1>
            <CardsStories/>
          </div>
      </div>
    </div>
  );
};

export default Banner;
