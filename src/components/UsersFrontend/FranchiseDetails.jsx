import React, { useEffect, useState } from "react";
import axios from "axios";
import { useForm } from "react-hook-form";

const FranchiseDetails = ({ setEdit,userId }) => {
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues:{
      complexion:"",
      bodyType:"",
      familyBackground:"",
      features:'',
      height:"",
      position:"",
      vipReg:'',
      reference:"",
      ReferenceMobile:"",
      photo1:null,
      photo2:null
    }
  });
  const [complexionOptions, setComplexionOptions] = useState([]);
  const [bodyTypeOptions, setBodyTypeOptions] = useState([]);
  const [familyBackgroundOptions, setFamilyBackgroundOptions] = useState([]);

  const featuresOptions = ["Handsome", "Beautiful", "Appealing", "Average", "Most Average", "White Spots", "Divyang"];
  const heightOptions = ["Very Tall", "Tall", "Average", "Short", "Very Short"];
  const positionOptions = ["IAS", "IPS", "IRS", "IIT", "IIM"];

  const fetchOptions = async () => {
    try {
      const [complexionRes, bodyTypeRes, familyBgRes] = await Promise.all([
        axios.get("http://localhost:8000/api/user/get-complexion"),
        axios.get("http://localhost:8000/api/user/get-bodytype"),
        axios.get("http://localhost:8000/api/user/get-familybg")
      ]);

      if (complexionRes.data.status) {
        setComplexionOptions(complexionRes.data.result.map((item) => item.complexion));
      }
      if (bodyTypeRes.data.status) {
        setBodyTypeOptions(bodyTypeRes.data.result.map((item) => item.bodyType));
      }
      if (familyBgRes.data.status) {
        setFamilyBackgroundOptions(familyBgRes.data.result.map((item) => item.familyBg));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOptions();
    const interval = setInterval(fetchOptions, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    console.log(userId._id)
    const formData = new FormData
    formData.append("userId", userId._id)
    formData.append("Complexion",data.complexion)
    formData.append("BodyType",data.bodyType)
    formData.append("familyBackground",data.familyBackground)
    formData.append("features",data.features)
    formData.append("height",data.height)
    formData.append("position",data.position)
    formData.append("vipMember",data.vipReg)
    formData.append("Reference",data.reference)
    formData.append("ReferenceMobile",data.ReferenceMobile)
    formData.append("userPhotoFive",data.photo1[0])
    formData.append("userPhotoSix",data.photo2[0])
    console.log("Form Data:", data);
    try {
      const response = await axios.put("http://localhost:8000/api/franchise/update-user-profile",formData)
      console.log(response.data)
    } catch (error) {
      console.log(error)
    }
  };

  const RadioGroup = ({ title, name, options }) => (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
            <input
              type="radio"
              value={option}
              {...register(name)}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="text-gray-700 capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-8xl mx-auto p-6 bg-white">
      <div className="w-full flex justify-end">
        <button className="border-red-500 bg-red-500 cursor-pointer py-1 px-2 rounded-md font-semibold text-white" onClick={() => setEdit(false)}>Close</button>
      </div>
      <h1 className="py-4 font-bold text-2xl">Office Information</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <RadioGroup title="Complexion" name="complexion" options={complexionOptions} />
        <RadioGroup title="Body Type" name="bodyType" options={bodyTypeOptions} />
        <RadioGroup title="Family Background" name="familyBackground" options={familyBackgroundOptions} />
        <RadioGroup title="Features" name="features" options={featuresOptions} />
        <RadioGroup title="Height" name="height" options={heightOptions} />
        <RadioGroup title="Position" name="position" options={positionOptions} />

        <div className="flex justify-start items-center gap-2 w-[15%]">
          <input type="checkbox" {...register("vipReg")} id="vipReg" className="w-5 h-5 accent-[#e52525]" />
          <label htmlFor="vipReg">VIP Registration</label>
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Reference</label>
          <input
            type="text"
            {...register("reference")}
            placeholder="Name"
            maxLength={100}
            className="border border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-xl w-full md:w-1/3 shadow-sm"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">Reference Mobile Number</label>
          <input
            type="tel"
            {...register("referenceMobile")}
            placeholder="Reference Mobile Number"
            maxLength={10}
            className="border border-gray-300 focus:border-red-500 focus:ring-red-500 p-3 rounded-xl w-full md:w-1/3 shadow-sm"
          />
        </div>

        <label className="block text-gray-700 font-medium mb-2">Upload Photo</label>
        <div className="mb-6 w-1/2 flex gap-4">
          <input type="file" {...register("photo1")} accept="image/*" className="file-input" />
          <input type="file" {...register("photo2")} accept="image/*" className="file-input" />
        </div>

        <div className="flex justify-end pt-8">
          <button type="submit" className="bg-gradient-to-r from-red-600 to-red-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:from-red-700 hover:to-red-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
            Submit Details
          </button>
        </div>
      </form>
    </div>
  );
};

export default FranchiseDetails;
