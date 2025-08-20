import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Utils/AuthProvider.jsx";
import toast from "react-hot-toast";
import axios from "axios";

const Register = () => {
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState({ lat: 27.6681, lng: 85.3206 }); // Default Kathmandu
  const navigate = useNavigate();
  const { user } = useAuth();

  const BASE_URL = import.meta.env.VITE_API_BASE_URL || ""; // Make sure this points to your backend or leave blank if serverless

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      setTimeout(() => navigate("/"), 1000);
    }
  }, [user, navigate]);

  // Get geolocation with fallback
  useEffect(() => {
    const fetchLocation = async () => {
      try {
        if ("geolocation" in navigator) {
          navigator.geolocation.getCurrentPosition(
            (pos) => {
              const { latitude, longitude } = pos.coords;
              setLocation({ lat: latitude, lng: longitude });
            },
            async () => {
              const res = await fetch("https://ipapi.co/json/");
              const data = await res.json();
              setLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        } else {
          const res = await fetch("https://ipapi.co/json/");
          const data = await res.json();
          setLocation({ lat: parseFloat(data.latitude), lng: parseFloat(data.longitude) });
        }
      } catch (err) {
        console.warn("Location fetch failed, using default:", err);
        setLocation({ lat: 27.6681, lng: 85.3206 });
      }
    };
    fetchLocation();
  }, []);

  // React-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const password = watch("password");

  // Submit registration
  const onSubmit = async (data) => {
    if (location) data.location = location;

    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/api/user/register`, data);

      if (response.status === 201) {
        toast.success("Registration successful!");
        setTimeout(() => navigate("/login"), 2000);
      } else {
        toast.error(response.data.message || "Registration failed!");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-3 sm:px-6">
      <div className="sm:mx-auto w-full sm:max-w-md mt-2">
        <h2 className="text-center text-[28px] w-full font-bold text-gray-900">
          Create Your Healthcare Account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto w-[94vw] sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 sm:rounded-lg sm:px-10 shadow-blue-500 shadow-2xl">
          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Name fields */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  {...register("firstName", { required: "First name is required" })}
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                />
                {errors.firstName && <span className="text-sm text-red-400">{errors.firstName.message}</span>}
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  {...register("lastName", { required: "Last name is required" })}
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                />
                {errors.lastName && <span className="text-sm text-red-400">{errors.lastName.message}</span>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                {...register("email", {
                  required: "Email is required",
                  pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, message: "Invalid email address" },
                })}
                className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
              />
              {errors.email && <span className="text-sm text-red-400">{errors.email.message}</span>}
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                />
                {errors.password && <span className="text-sm text-red-400">{errors.password.message}</span>}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  {...register("confirmPassword", { required: "Confirm password is required", validate: (value) => value === password || "Passwords do not match" })}
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                />
                {errors.confirmPassword && <span className="text-sm text-red-400">{errors.confirmPassword.message}</span>}
              </div>
            </div>

            {/* Phone, Age, Gender */}
            <div>
              <label htmlFor="phonenumber" className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="text"
                id="phonenumber"
                {...register("phonenumber", {
                  required: "Phone number is required",
                  pattern: { value: /^(97|98)\d{8}$/, message: "Phone must start with 97 or 98" },
                  minLength: { value: 10, message: "Phone must be 10 digits" },
                  maxLength: { value: 10, message: "Phone must be 10 digits" },
                })}
                className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
              />
              {errors.phonenumber && <span className="text-sm text-red-400">{errors.phonenumber.message}</span>}
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label htmlFor="age" className="block text-sm font-medium text-gray-700">Age</label>
                <input
                  type="number"
                  id="age"
                  {...register("age", { required: "Age is required" })}
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                />
                {errors.age && <span className="text-sm text-red-400">{errors.age.message}</span>}
              </div>

              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">Gender</label>
                <select
                  id="gender"
                  {...register("gender", { required: "Gender is required" })}
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="text-sm text-red-400">{errors.gender.message}</span>}
              </div>
            </div>

            {/* Submit button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white cursor-pointer"
              >
                {loading ? <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div> : "Register"}
              </button>
            </div>
          </form>

          {/* Login link */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Already have an account?</span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
