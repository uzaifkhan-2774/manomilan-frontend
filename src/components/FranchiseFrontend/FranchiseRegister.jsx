import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import axios from "axios";
import {
  Upload,
  User,
  MapPin,
  Phone,
  CreditCard,
  Camera,
  QrCode,
  Mail,
  Lock,
  Hash,
} from "lucide-react";
import Select from "react-select";
import { toast } from "react-toastify";

const FranchiseRegistrationForm = () => {
  const token = localStorage.getItem("distributorToken");
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const [franchisePhoto, setFranchisePhoto] = useState(null);
  const [qrPhoto, setQrPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFranchiseCity, setSelectedFranchiseCity] = useState("");
  const [cities, setCities] = useState([]);

  const fetchCities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/api/user/get-all-cities"
      );
      if (response.data.status === true) {
        const transformed = response.data.allLocations.map((item) => ({
          label: `${item.city}, ${item.stateCountry?.state || ""}, ${
            item.stateCountry?.country || ""
          }`,
          value: item.city,
        }));
        setCities(transformed || []);
      }
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    const interval = setInterval(fetchCities, 5000);
    return () => clearInterval(interval);
  }, []);

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    const socialMedia = data.socialMedia
      ? data.socialMedia.split(",").map((ele) => ele.trim())
      : [];

    const formData = new FormData();
    formData.append("franchiseName", data.franchiseName);
    formData.append("ownerName", data.ownerName);
    formData.append("mobileNumber", data.contactNumber);
    formData.append("alternateNumber", data.altNumber);
    formData.append("panNumber", data.panNumber);
    formData.append("adharNumber", data.aadhaarNumber);
    formData.append("email", data.email);
    formData.append("address", data.address);
    formData.append("socialMedia", socialMedia);
    formData.append("password", data.password);
    formData.append("pinCode", data.pincode);
    formData.append("franchiseCity", selectedFranchiseCity);
    formData.append("franchisePhoto", data.franchisePhoto || null);
    formData.append("qrPhoto", data.qrPhoto || null);

    try {
      const response = await axios.post(
        "http://localhost:8000/api/franchise/register",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.status === true) {
        toast.success(response.data.message);
        reset();
        setFranchisePhoto(null);
        setQrPhoto(null);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.error("Error during submission:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "franchise") {
          setFranchisePhoto(reader.result);
          setValue("franchisePhoto", file);
        } else if (type === "qr") {
          setQrPhoto(reader.result);
          setValue("qrPhoto", file);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br px-4 py-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit(onSubmit)} className="p-4 sm:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Franchise Name */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-red-800" />
                  Franchise Name
                </label>
                <input
                  type="text"
                  {...register("franchiseName", {
                    required: "Franchise name is required",
                    minLength: { value: 3, message: "Minimum 3 characters" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter franchise name"
                />
                {errors.franchiseName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.franchiseName.message}
                  </p>
                )}
              </div>

              {/* Owner Name */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-red-800" />
                  Owner Name
                </label>
                <input
                  type="text"
                  {...register("ownerName", {
                    required: "Owner name is required",
                    pattern: {
                      value: /^[a-zA-Z\s]+$/,
                      message: "Only letters allowed",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter owner name"
                />
                {errors.ownerName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.ownerName.message}
                  </p>
                )}
              </div>

              {/* Contact Number */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-red-800" />
                  Contact Number
                </label>
                <input
                  type="tel"
                  {...register("contactNumber", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter valid 10-digit number",
                    },
                  })}
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter contact number"
                />
                {errors.contactNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>

              {/* Alternate Number */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-red-800" />
                  Alternate Number
                </label>
                <input
                  type="tel"
                  {...register("altNumber", {
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Enter valid 10-digit number",
                    },
                  })}
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter alternate number"
                />
                {errors.altNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.altNumber.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-red-800" />
                  Email Address
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Enter valid email",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Lock className="w-4 h-4 mr-2 text-red-800" />
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 6, message: "Minimum 6 characters" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* PAN Number */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 mr-2 text-red-800" />
                  PAN Number
                </label>
                <input
                  type="text"
                  {...register("panNumber", {
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message: "Invalid PAN format",
                    },
                  })}
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none uppercase"
                  placeholder="ABCDE1234F"
                />
                {errors.panNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.panNumber.message}
                  </p>
                )}
              </div>

              {/* Aadhaar Number */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <CreditCard className="w-4 h-4 mr-2 text-red-800" />
                  Aadhaar Number
                </label>
                <input
                  type="text"
                  {...register("aadhaarNumber", {
                    pattern: {
                      value: /^\d{12}$/,
                      message: "Must be 12 digits",
                    },
                  })}
                  maxLength={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter Aadhaar number"
                />
                {errors.aadhaarNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.aadhaarNumber.message}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Hash className="w-4 h-4 mr-2 text-red-800" />
                  Pincode
                </label>
                <input
                  type="text"
                  {...register("pincode", {
                    required: "Pincode is required",
                    pattern: {
                      value: /^[1-9][0-9]{5}$/,
                      message: "Enter valid 6-digit pincode",
                    },
                  })}
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="Enter pincode"
                />
                {errors.pincode && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.pincode.message}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Select City
                </label>
                {cities.length > 0 && (
                  <Controller
                    name="franchiseeCity"
                    control={control}
                    rules={{ required: "City is required" }}
                    render={({ field }) => (
                      <Select
                        {...field}
                        options={cities}
                        value={cities.find((opt) => opt.value === field.value) || null}
                        onChange={(selected) => {
                          field.onChange(selected.value);
                          setSelectedFranchiseCity(selected.label);
                        }}
                        placeholder="Select City"
                        className="w-full text-sm py-3"
                      />
                    )}
                  />
                )}
                {errors.franchiseeCity && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.franchiseeCity.message}
                  </p>
                )}
              </div>

              {/* Social Media */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Enter Socials
                </label>
                <input
                  type="text"
                  {...register("socialMedia")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none"
                  placeholder="e.g. Instagram, Facebook"
                />
              </div>

              {/* Address */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MapPin className="w-4 h-4 mr-2 text-red-800" />
                  Address
                </label>
                <textarea
                  {...register("address", {
                    required: "Address is required",
                    minLength: { value: 10, message: "Minimum 10 characters" },
                  })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none resize-none"
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              {/* Franchise Photo */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Camera className="w-4 h-4 mr-2 text-red-800" />
                  Franchise Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {franchisePhoto ? (
                    <div className="space-y-2">
                      <img
                        src={franchisePhoto}
                        alt="Franchise"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setFranchisePhoto(null);
                          setValue("franchisePhoto", null);
                        }}
                        className="text-red-600 text-sm hover:text-red-800"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload franchise photo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "franchise")}
                        className="hidden"
                        id="franchise-photo"
                      />
                      <label
                        htmlFor="franchise-photo"
                        className="inline-block px-4 py-2 bg-red-800 text-white rounded-lg cursor-pointer hover:bg-red-900"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>

              {/* QR Photo */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <QrCode className="w-4 h-4 mr-2 text-red-800" />
                  QR Code Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  {qrPhoto ? (
                    <div className="space-y-2">
                      <img
                        src={qrPhoto}
                        alt="QR"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setQrPhoto(null);
                          setValue("qrPhoto", null);
                        }}
                        className="text-red-600 text-sm hover:text-red-800"
                      >
                        Remove Photo
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Upload QR photo
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, "qr")}
                        className="hidden"
                        id="qr-photo"
                      />
                      <label
                        htmlFor="qr-photo"
                        className="inline-block px-4 py-2 bg-red-800 text-white rounded-lg cursor-pointer hover:bg-red-900"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-1/2 md:w-1/3 bg-gradient-to-r from-red-800 to-red-900 text-white py-3 rounded-lg font-semibold text-base sm:text-lg hover:from-red-900 hover:to-red-800 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Register Franchise"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default FranchiseRegistrationForm;
