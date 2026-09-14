import React, { useState } from "react";
import ManomilanLogo from "../../assets/ManomilanLogo.png";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotFranchisePass = () => {

  const [pin, setPin] = useState(["", "", "", "", "", ""]);
  const [showPassword, setShowPassword] = useState(false);


  let token = localStorage.getItem("userToken")
  // Generic handler for OTP & PIN
  const handleInputChange = (index, value, state, setState, prefix) => {
    if (value.length <= 1 && /^[0-9]*$/.test(value)) {
      const newArr = [...state];
      newArr[index] = value;
      setState(newArr);

      if (value && index < state.length - 1) {
        const nextInput = document.getElementById(`${prefix}-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleKeyDown = (index, e, state, prefix) => {
    if (e.key === "Backspace" && !state[index] && index > 0) {
      const prevInput = document.getElementById(`${prefix}-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };


  const changePass = async()=>{
    const payload={
    
      newPassword:Number(pin.join(""))
    }
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/user/verify-otp-reset-password',payload,
     {    headers: {
          Authorization: `Bearer ${token}`,
        }}
      )
      if(response.data.status){
        toast.success(response.data.message)
       
        setPin(["", "", "", "", "", ""])

        return
      }
      else{
        toast.error(response.data.message)
        return
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className="w-full min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <img src={ManomilanLogo} alt="Manomilan Logo" className="h-12" />
        </div>

        {/* Email */}
        {/* <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Enter Your Email
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@mail.com"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              className="px-4 py-2 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
              onClick={(e)=>{sendOtp();disableOtp(e)}}
              id="OtpBtn"
            >
              Send OTP
            </button>
          </div>
        </div> */}

        {/* OTP */}
        {/* <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Enter OTP
          </label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, otp, setOtp, "otp")
                }
                onKeyDown={(e) => handleKeyDown(index, e, otp, "otp")}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                maxLength={1}
              />
            ))}
          </div>
        </div> */}

        {/* PIN */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <label className="text-gray-700 font-medium">Enter New Pin</label>
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
          <div className="flex justify-between gap-2">
            {pin.map((digit, index) => (
              <input
                key={index}
                id={`pin-${index}`}
                type={showPassword ? "text" : "password"}
                value={digit}
                onChange={(e) =>
                  handleInputChange(index, e.target.value, pin, setPin, "pin")
                }
                onKeyDown={(e) => handleKeyDown(index, e, pin, "pin")}
                className="w-12 h-12 border-2 border-gray-300 rounded-lg text-center text-lg font-mono focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                maxLength={6}
              />
            ))}
          </div>
        </div>

        {/* Submit */}
        <button className="w-full py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-green-600 transition" onClick={changePass}>
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ForgotFranchisePass;
