import React, { useState } from "react";
import { Menu, Eye, EyeOff } from "lucide-react";
import ManomilanLogo from "../../assets/ManomilanLogo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

export default function ManomilanLogin() {

  const [userInput, setUserInput] = useState("");
  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);
  const [isMenuOpen,setIsMenuOpen] = useState(false)
  const navigate = useNavigate();

  const handlePinChange = (index, value) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handlePinKeyDown = (index, e) => {
    // Handle backspace to go to previous input
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      const prevInput = document.getElementById(`pin-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const location = useLocation();
  const pathname = location.pathname;

  let loginEndPt = "";
  if (pathname.includes("franchise")) {
    loginEndPt = "http://localhost:8000/api/franchise/login";
  } else if (pathname.includes("distributor")) {
    loginEndPt = "http://localhost:8000/api/distributor/login";
  } else if (pathname.includes("admin")) {
    loginEndPt = "http://localhost:8000/api/admin/login";
  } else {
    loginEndPt = "http://localhost:8000/api/user/login";
  }

  const handleLogin = async () => {
    const pinValue = pin.join("");

    if (!userInput.trim() || pinValue.length !== 6) {
      toast.error("Please enter both UserID and complete 6-digit PIN");
      return;
    }

    const mappedData = {
      identifier: userInput,
      password: pinValue,
    };

    try {
      const response = await axios.post(loginEndPt, mappedData);
      console.log(response.data)
      if (response.data.status === true) {
        // toast.success(response.data.message);
        const token = response.data.token;
        if (pathname.includes("/franchise")) {
          localStorage.setItem("franchiseToken", token);
          localStorage.setItem("franchiseId", response.data?.distributor?._id);
          navigate("/franchise/dashboard");
        } else if (pathname.includes("/distributor")) {
          localStorage.setItem("distributorToken", token);
          localStorage.setItem(
            "distributorId",
            response.data?.distributor?._id
          );
          navigate("/distributor/dashboard");
        } else if (pathname.includes("/admin")) {
          localStorage.setItem("adminToken", token);
          navigate("/admin/dashboard");
        } else {
          localStorage.setItem("userToken", token);
          localStorage.setItem("userId", response.data?.user?._id);
          navigate("/profile");
        }
      } else {
        toast.error("Login failed: Invalid credentials or inactive account.");
      }

      // console.log(response);
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong while logging in. Please try again.");
    }
  };

  const forgotAdminPass=async()=>{
    navigate('/forgot-admin-pass')
  }
  const forgotFranchisePass=async()=>{
    navigate('/forgot-Franchisee-pass')
  }
  const forgotDistributorPass=async()=>{
    navigate('/forgot-Dist-pass')
  }
  const forgotUserPass = async()=>{
    navigate('/forgot-pass')
  }

  const forgotPassword=async()=>{
    if(pathname.includes('/admin')){
      await forgotAdminPass()
    }else if(pathname.includes('/franchise')){
      await forgotFranchisePass()
    }else if(pathname.includes('/distributor')){
      await forgotDistributorPass()
    }else{
      await forgotUserPass()
    }
  }

  const handleRegister = () => {
    navigate("/register-user");
  };

  const handleQuickSearch = () => {
    navigate("/quick-search");
  };

  const handleSuccessStories = () => {
    navigate("/success-stories");
  };

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <div className="flex items-center justify-start px-4 py-3">
  <button
    className="p-3 cursor-pointer"
    onClick={() => setIsMenuOpen(!isMenuOpen)}
  >
    <Menu className="w-6 h-6 text-gray-600" />
  </button>
</div>

{/* Animated Dropdown Menu */}
<div
  className={`shadow-xl w-[50%] md:w-[15%] p-4 fixed top-17 left-4 bg-white rounded-lg
  transition-all duration-300 ease-in-out origin-top 
  ${isMenuOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'}`}
>
  <ul>
    <li
      className="font-semibold py-1 cursor-pointer hover:underline"
      onClick={() => navigate('/terms')}
    >
      Terms & Conditions
    </li>
    <li
      className="font-semibold py-1 cursor-pointer hover:underline"
      onClick={() => navigate('/about')}
    >
      About Us
    </li>
    <li
      className="font-semibold py-1 cursor-pointer hover:underline"
      onClick={() => navigate('/contact')}
    >
      Contact Us
    </li>
  </ul>
</div>


      {/* Main Content */}
      <div className="flex flex-col items-center px-4 pb-32">
        {/* Logo */}
        <div className="w-full mb-9 mt-8">
          <div className="flex items-center space-x-2 w-full md:max-w-[30%] mx-auto">
            <img src={ManomilanLogo} alt="" height={"50px"} width={'100%'} />
          </div>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md space-y-6">
          {/* User ID Input */}
          <div>
            <input
              type="text"
              placeholder="Mobile No / Email ID"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="w-full px-0 py-3 border-0 border-b-2 border-gray-300 bg-transparent focus:border-blue-500 focus:outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* PIN Input */}
          <div>
            <div className="space-y-6 w-full max-w-md">
              <div className="flex items-center justify-between">
                <label className="text-gray-500 text-md font-semibold">
                  Pin
                </label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="flex justify-between">
                {pin.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type={showPassword ? "text" : "password"}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    onKeyDown={(e) => handlePinKeyDown(index, e)}
                    className="w-12 h-12 border-2 border-gray-300 rounded text-center text-lg font-mono focus:border-blue-500 focus:outline-none"
                    maxLength={1}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Login Button and Forgot Password */}
          <div className="flex items-center justify-between pt-4">
            <button
              onClick={forgotPassword}
              className="text-blue-600 font-semibold border-0 hover:text-blue-700 text-md"
            >
              Forgot Password?
            </button>
            <button
              onClick={handleLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors duration-200"
            >
              LOGIN
            </button>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Section */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-50 px-4 pb-6">
        {/* Register Button */}
        <div className="w-full max-w-md mx-auto mb-4">
          <button
            onClick={handleRegister}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition-colors duration-200"
          >
            Register FREE (Create New Profile)
          </button>
        </div>

        {/* Quick Search and Success Stories */}
        <div className="flex gap-4 w-full max-w-md mx-auto">
          <button
            onClick={handleQuickSearch}
            className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-1 rounded transition-colors duration-200"
          >
            Quick Search
          </button>
          <button
            onClick={handleSuccessStories}
            className="flex-1 border-2 border-blue-600 text-blue-600 hover:bg-blue-50 py-2 px-6 rounded transition-colors duration-200"
          >
            Success Stories
          </button>
        </div>
      </div>
    </div>
  );
}
