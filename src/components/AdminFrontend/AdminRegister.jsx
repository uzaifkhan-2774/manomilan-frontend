import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { User, Lock, CheckCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
  const navigate= useNavigate()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      transactionPassword: '',
      givePointsPassword:''
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('https://api.manomilan.com/api/admin/register', data);
      const result = response.data;
      console.log(result)

      if (result.status) {
        setMessage({ type: 'success', text: result.message });
        reset(); // Clear form on success
        navigate('/admin/login')
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    } catch (error) {
      console.error('Registration error:', error);
      setMessage({
        type: 'error',
        text: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 py-8 px-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-800 to-red-900 px-8 py-6">
            <h1 className="text-3xl font-bold text-white text-center">Admin Registration</h1>
          </div>

          {/* Message Display */}
          {message.text && (
            <div
              className={`mx-8 mt-6 p-4 rounded-lg flex items-center space-x-2 ${
                message.type === 'success'
                  ? 'bg-green-50 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600" />
              )}
              <span
                className={`text-sm font-medium ${
                  message.type === 'success' ? 'text-green-800' : 'text-red-800'
                }`}
              >
                {message.text}
              </span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2 text-red-800" />
                Name
              </label>
              <input
                type="text"
                {...register('name', {
                  required: 'Name is required',
                  pattern: {
                    value: /^[a-zA-Z\s]+$/,
                    message: 'Name should contain only letters',
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500' : 'border-gray-200 focus:border-red-800'
                }`}
                placeholder="Enter your full name"
                disabled={isSubmitting}
              />
              {errors.name && (
                <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <User className="w-4 h-4 mr-2 text-red-800" />
                Email
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Please enter a valid email address',
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500' : 'border-gray-200 focus:border-red-800'
                }`}
                placeholder="Enter your email"
                disabled={isSubmitting}
              />
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
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
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.password ? 'border-red-500' : 'border-gray-200 focus:border-red-800'
                }`}
                placeholder="Enter your password"
                disabled={isSubmitting}
              />
              {errors.password && (
                <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Transaction Password */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2 text-red-800" />
                Transaction Password
              </label>
              <input
                type="password"
                {...register('transactionPassword', {
                  required: 'Transaction password is required',
                  minLength: {
                    value: 6,
                    message: 'Transaction password must be at least 6 characters',
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.transactionPassword ? 'border-red-500' : 'border-gray-200 focus:border-red-800'
                }`}
                placeholder="Enter your transaction password"
                disabled={isSubmitting}
              />
              {errors.transactionPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.transactionPassword.message}</p>
              )}
            </div>

            {/* Add points to dist Transaction Password */}
            <div>
              <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                <Lock className="w-4 h-4 mr-2 text-red-800" />
                Transaction Password (for distributor)
              </label>
              <input
                type="password"
                {...register('givePointsPassword', {
                  required: 'This password is required',
                  minLength: {
                    value: 6,
                    message: 'This password must be at least 6 characters',
                  },
                })}
                className={`w-full px-4 py-3 border-2 rounded-lg focus:outline-none transition-colors ${
                  errors.givePointsPassword ? 'border-red-500' : 'border-gray-200 focus:border-red-800'
                }`}
                placeholder="Enter your Points password"
                disabled={isSubmitting}
              />
              {errors.givePointsPassword && (
                <p className="text-red-600 text-sm mt-1">{errors.givePointsPassword.message}</p>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-800 to-red-900 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:from-red-900 hover:to-red-800 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-red-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </div>
                ) : (
                  'Register Admin'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;