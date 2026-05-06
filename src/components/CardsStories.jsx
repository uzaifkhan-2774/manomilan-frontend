import React from "react";
import CoupleHand from "../assets/CoupleHand.jpeg";
import CoupleHandT from "../assets/CoupleHand2.jpeg";
import CouplePhoto from "../assets/CouplePhoto.jpeg";
import CouplePhotoT from "../assets/CouplePhoto2.jpeg";
import { useNavigate } from "react-router-dom";


function CardsStories() {
    const Navigate=useNavigate()
    const gotoRegister=()=>{
        Navigate('/register')
    }
    return (
    <>
        <div className="w-[100%] flex justify-between md:mt-[80px]">
        <div
            className="relative rounded-xl overflow-hidden h-80 w-64 shadow-lg"
            style={{
            backgroundImage: `url(${CoupleHand})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xl font-semibold leading-tight">Henna</div>
            <div className="text-xl font-semibold leading-tight">&</div>
            <div className="text-xl font-semibold leading-tight">Ramesh</div>
            </div>

            <div className="absolute bottom-4 right-4">
            <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </button>
            </div>
        </div>

        <div
            className="relative rounded-xl overflow-hidden h-80 w-64 shadow-lg"
            style={{
            backgroundImage: `url(${CouplePhoto})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xl font-semibold leading-tight">Henna</div>
            <div className="text-xl font-semibold leading-tight">&</div>
            <div className="text-xl font-semibold leading-tight">Ramesh</div>
            </div>

            <div className="absolute bottom-4 right-4">
            <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </button>
            </div>
        </div>

        <div
            className="relative rounded-xl overflow-hidden h-80 w-64 shadow-lg"
            style={{
            backgroundImage: `url(${CoupleHandT})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xl font-semibold leading-tight">Henna</div>
            <div className="text-xl font-semibold leading-tight">&</div>
            <div className="text-xl font-semibold leading-tight">Ramesh</div>
            </div>

            <div className="absolute bottom-4 right-4">
            <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </button>
            </div>
        </div>

        <div
            className="relative rounded-xl overflow-hidden h-80 w-64 shadow-lg"
            style={{
            backgroundImage: `url(${CouplePhotoT})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            }}
        >
            <div className="absolute inset-0 bg-gradient-to-t from-red-600/80 via-transparent to-transparent"></div>

            <div className="absolute bottom-4 left-4 text-white">
            <div className="text-xl font-semibold leading-tight">Henna</div>
            <div className="text-xl font-semibold leading-tight">&</div>
            <div className="text-xl font-semibold leading-tight">Ramesh</div>
            </div>

            <div className="absolute bottom-4 right-4">
            <button className="bg-white/20 hover:bg-white/30 text-white rounded-full p-2">
                <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                />
                </svg>
            </button>
            </div>
        </div>
        </div>
        <div className="w-[100%] md:mt-9">
            <p className="text-[20px] text-[#7d0a0a] cursor-pointer">More Than 100+ Successfull Stories</p>
        </div>
        <div className="w-[50%] flex gap-3 items-center">
            <div onClick={gotoRegister} className="w-[25%] p-2 text-center bg-[#7d0a0a] font-semibold text-white rounded-[15px] cursor-pointer mt-10">
            Register For Free
        </div>
        <div className="w-[25%] transition-all p-2 text-center mt-10 hover:bg-[#7d0a0a] hover:text-white font-semibold text-[#7d0a0a] border-1 border-[#7d0a0a] rounded-[15px] cursor-pointer ">
            Find Matches
        </div>
        </div>
    </>
  );
}

export default CardsStories;
