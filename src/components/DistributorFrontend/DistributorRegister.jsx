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
} from "lucide-react";
import Select from "react-select";
import { toast } from "react-toastify";

const DistributorRegistrationForm = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    watch,  
    setValue,
    reset,
  } = useForm();

  const [franchisePhoto, setFranchisePhoto] = useState(null);
  const [qrPhoto, setQrPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDistributorCity, setSelectedDistributorCity] = useState("");
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
          value: item.city, // or item._id if you want unique IDs
        }));
        setCities(transformed || []);
      } else {
        console.error("Failed to fetch Cities:", response.data.message);
      }
    } catch (error) {
      console.error("Error fetching Cities:", error);
    }
  };

  useEffect(() => {
    fetchCities();
    // initial fetch
    const interval = setInterval(() => {
      fetchCities();
    }, 5000); // every 5 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  const onSubmit = async (data) => {
  setIsSubmitting(true);

  const socialMedia = data.socials
    .split(",")
    .map((ele) => ele.trim())
    .filter(Boolean);

  const formData = new FormData();
  formData.append("distributorName", data.distributorName); // match name change
  formData.append("ownerName", data.ownerName);
  formData.append("mobileNumber", data.contactNumber);
  formData.append("alternateNumber", data.altNumber || "");
  formData.append("adharNumber", data.aadhaarNumber);
  formData.append("panNumber", data.panNumber || "");
  formData.append("password", data.password);
  formData.append("email", data.email);
  formData.append("pincode", data.pinCode);
  formData.append("location", selectedDistributorCity);
  formData.append("address", data.address);
  formData.append("transactionPassword",data.transactionPassword)
  formData.append("socialMedia", JSON.stringify(socialMedia)); // in case it's expected as array

  if (data.franchisePhoto) {
    formData.append("distributorPhoto", data.franchisePhoto);
  }

  if (data.qrPhoto) {
    formData.append("qrPhoto", data.qrPhoto);
  }
  try {
    const response = await axios.post(
      "http://localhost:8000/api/distributor/register",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    console.log(response.data.status)
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
    alert("Something went wrong. Please try again.");
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
          setValue("franchisePhoto", file); // set actual file in form
        } else if (type === "qr") {
          setQrPhoto(reader.result);
          setValue("qrPhoto", file);
        }
      };
      reader.readAsDataURL(file); // Convert to base64 for preview
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Franchise Name */}
              <div className="md:col-span-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <User className="w-4 h-4 mr-2 text-red-800" />
                  Distributor Name
                </label>
                <input
                  type="text"
                  {...register("distributorName", {
                    required: "Distributor name is required",
                    minLength: {
                      value: 3,
                      message: "Distributor name must be at least 3 characters",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter distributor name"
                />
                {errors.distributorName && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.distributorName.message}
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
                      message: "Owner name should contain only letters",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter owner full name"
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
                      message: "Please enter a valid 10-digit mobile number",
                    },
                  })}
                  maxLength={10}
                  minLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter 10-digit mobile number"
                />
                {errors.contactNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.contactNumber.message}
                  </p>
                )}
              </div>

              {/* Alternative/WhatsApp Number */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Phone className="w-4 h-4 mr-2 text-red-800" />
                  Alt No / WhatsApp No
                </label>
                <input
                  type="tel"
                  {...register("altNumber", {
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: "Please enter a valid 10-digit mobile number",
                    },
                  })}
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter alternative number (optional)"
                />
                {errors.altNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.altNumber.message}
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
                    // required: 'PAN number is required',
                    pattern: {
                      value: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
                      message:
                        "Please enter a valid PAN number (e.g., ABCDE1234F)",
                    },
                  })}
                  maxLength={10}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors uppercase"
                  placeholder="Enter PAN number"
                  style={{ textTransform: "uppercase" }}
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
                      message: "Please enter a valid 12-digit Aadhaar number",
                    },
                  })}
                  maxLength={12}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter 12-digit Aadhaar number"
                />
                {errors.aadhaarNumber && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.aadhaarNumber.message}
                  </p>
                )}
              </div>

              {/* owner email */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Mail className="w-4 h-4 mr-2 text-red-800" />
                  Email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    minLength: {
                      value: 3,
                      message: "Email must be valid",
                    },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter email"
                />
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Social media */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Socials
                </label>
                <input
                  type="text"
                  {...register("socials")}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter social media"
                />
                <p className="text-sm text-gray-500">
                  Multiple social media must be ',' sepereted.
                </p>
                {errors.socials && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.socials.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Minimun 6 digits allowed",
                    },
                    maxLength: { value: 6, message: "Only 6 digits allowed" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter 6 digit password"
                />
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Pin Code
                </label>
                <input
                  type="text"
                  {...register("pinCode", {
                    required: "pinCode is required",
                    minLength: {
                      value: 3,
                      message: "pinCode must be valid",
                    },
                  })}
                  maxLength={6}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter Pin Code"
                />
                {errors.pinCode && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.pinCode.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  Transaction Password
                </label>
                <input
                  type="password"
                  {...register("transactionPassword", {
                    required: "transactionPassword is required",
                    minLength: {
                      value: 6,
                      message: "Minimun 6 digits allowed",
                    },
                    maxLength: { value: 6, message: "Only 6 digits allowed" },
                  })}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors"
                  placeholder="Enter 6 digit password"
                />
                {errors.transactionPassword && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.transactionPassword.message}
                  </p>
                )}
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
                    minLength: {
                      value: 10,
                      message: "Address must be at least 10 characters",
                    },
                  })}
                  rows="3"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-red-800 focus:outline-none transition-colors resize-none"
                  placeholder="Enter complete address"
                />
                {errors.address && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.address.message}
                  </p>
                )}
              </div>

              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <Camera className="w-4 h-4 mr-2 text-red-800" />
                  Franchise Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-800 transition-colors">
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
                        className="inline-block px-4 py-2 bg-red-800 text-white rounded-lg cursor-pointer hover:bg-red-900 transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
                {errors.franchisePhoto && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.franchisePhoto.message}
                  </p>
                )}
              </div>

              {/* QR Photo Upload */}
              <div>
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <QrCode className="w-4 h-4 mr-2 text-red-800" />
                  QR Code Photo
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-red-800 transition-colors">
                  {qrPhoto ? (
                    <div className="space-y-2">
                      <img
                        src={qrPhoto}
                        alt="QR Code"
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
                        Upload QR code photo
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
                        className="inline-block px-4 py-2 bg-red-800 text-white rounded-lg cursor-pointer hover:bg-red-900 transition-colors"
                      >
                        Choose File
                      </label>
                    </div>
                  )}
                </div>
                {errors.qrPhoto && (
                  <p className="text-red-600 text-sm mt-1">
                    {errors.qrPhoto.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-1/4 bg-gradient-to-r from-red-800 to-red-900 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-red-900 hover:to-red-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  "Register distributor"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
export default DistributorRegistrationForm;