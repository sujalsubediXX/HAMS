import React, { useEffect, useState } from "react";
import { Link ,useNavigate} from "react-router-dom";
import { useAuth } from "../Utils/AuthProvider.jsx";
import toast from "react-hot-toast";
import axios from "axios";
const Register = () => {
  const [loading, setLoading] = useState(false);
  const [name,setName]=useState("");
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const navigate=useNavigate(); 
  const {user}=useAuth();
 

  useEffect(()=>{
    if(user){
      setTimeout(()=>{
        navigate("/");
      },3000)
    }
   
  },[user])

  const handleSubmit=async()=>{
    setLoading(true);
    try {
      const userdata={name,email,password}
      const res=await axios.post("http://localhost:3000/user/register",userdata);
      if(res.status==201){
        toast.success(res.data.message);
        setTimeout(()=>{
          navigate("/login");
        },2000)
       
      }
    } catch (error) {
      console.log("Error occured in register page"+error);
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-blue-100 flex flex-col justify-center py-3 sm:px-6 ">
      <div className="sm:mx-auto w-full sm:max-w-md mt-2">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">
          Create Your Healthcare Account
        </h2>
      </div>

      <div className="mt-5 sm:mx-auto mx-auto w-[94vw] sm:w-full sm:max-w-md">
        <div className=" bg-white py-8 px-4  sm:rounded-lg sm:px-10  shadow-black shadow-2xl">
          <form className="space-y-4" onSubmit={(e)=>{
            e.preventDefault();
            handleSubmit();
          }}>
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700"
                >
                  First Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                    onChange={(e)=>setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Last Name
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="mt-1">
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                  onChange={(e)=>setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                    onChange={(e)=>setPassword(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-gray-700"
                >
                  Confirm Password
                </label>
                <div className="mt-1">
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Date of Birth
                </label>
                <div className="mt-1">
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    className="block w-full shadow-sm sm:text-sm rounded-md border p-2"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="gender"
                  className="block text-sm font-medium text-gray-700"
                >
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    className="block w-full shadow-sm sm:text-sm rounded-md border p-2 "
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent bg-blue-600 rounded-md shadow-sm text-sm font-medium text-white cursor-pointer"
              >
                 {loading ? (
                    <span className="loading loading-spinner text-success"></span>
                    // <span className="loading loading-dots loading-xl"></span>
                  ) : (
                    "Register"
                  )}
           
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Already have an account?
                </span>
              </div>
            </div>

            <div className="mt-6">
              <Link
                to="/login"
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
