import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../Utils/AuthProvider";

const datas = {
  role: ["User", "Doctor"],
};

const BASE_URL = "https://hams-eegi.onrender.com"; // ✅ backend URL

const Login = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [showPassword, setShowpassword] = useState(false);
  const [role, setRole] = useState("User");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      if (user?.role === "User") {
        navigate("/");
      } else if (user?.role === "Doctor") {
        navigate("/doctor/profile");
      }
    }, 1000);
  }, [user, navigate]);

  const setLogin = async () => {
    try {
      setLoading(true);
      let res;
      let location;

      if (role === "User") {
        res = await axios.post(`${BASE_URL}/api/user/login`, {
          email,
          password,
        });
        location = "/";
      } else if (role === "Doctor") {
        res = await axios.post(`${BASE_URL}/api/doctor/login`, {
          email,
          password,
        });
        location = "/doctor/profile";
      }

      const userdata = { email, role, name: res.data.username };

      setTimeout(() => {
        toast.success("Login Success");
        login(userdata);
        navigate(location);
      }, 2000);
    } catch (error) {
      setLoading(false);

      if (error.response) {
        const status = error.response.status;
        const message = error.response.data.message || "Something went wrong";

        if (status === 403) {
          toast.error(message);
        } else if (status === 404) {
          toast.error("User not found.");
        } else if (status === 401) {
          toast.error("Invalid credentials.");
        } else {
          toast.error(message);
        }
      } else if (error.request) {
        toast.error("Server not responding. Is backend running?");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <>
      <div className="min-h-screen w-full flex justify-center items-center bg-gray-100">
        <div className="w-[92vw] md:w-[86vw] lg:w-3/5 h-auto md:h-4/5 rounded-lg shadow-2xl flex md:flex-row overflow-hidden bg-white text-black">
          <div className="hidden md:block md:w-1/2">
            <img
              // src={loginside}
              src="/loginside3.webp"
              alt="sideimage"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="w-full md:w-1/2 h-full">
            <div className="bg-white py-4 px-5 md:px-10">
              <h2 className="text-3xl font-semibold mb-6 mt-4 text-center ">
                <span className="text-[#0A7ABF]">Welcome</span>
                <span className="text-[#333333]"> Back</span>
              </h2>

              {/* ✅ Fixed onSubmit here */}
              <form
                className="space-y-3 w-full"
                onSubmit={(e) => {
                  e.preventDefault();
                  setLogin();
                }}
              >
                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <div className="w-full ">
                    <label className="w-full input input-bordered flex items-center gap-2 border-1 border-black focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400 bg-white text-black px-1 py-2 rounded-lg">
                      <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2.5"
                          fill="none"
                          stroke="currentColor"
                        >
                          <rect
                            width="20"
                            height="16"
                            x="2"
                            y="4"
                            rx="2"
                          ></rect>
                          <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                        </g>
                      </svg>
                      <input
                        type="text"
                        placeholder="Enter your email."
                        required
                        className="w-full focus:outline-none"
                        onChange={(e) => setemail(e.target.value)}
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label
                    className="block text-gray-700 font-medium mb-2"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div>
                    <label className="w-full input input-bordered flex items-center gap-2 border-1 border-black focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-400 bg-white text-black px-1 py-2 rounded-lg">
                      <svg
                        className="h-[1em] opacity-50"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                      >
                        <g
                          strokeLinejoin="round"
                          strokeLinecap="round"
                          strokeWidth="2.5"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"></path>
                          <circle
                            cx="16.5"
                            cy="7.5"
                            r=".5"
                            fill="currentColor"
                          ></circle>
                        </g>
                      </svg>
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                        className="w-full focus:outline-none"
                        onChange={(e) => setpassword(e.target.value)}
                      />
                      {showPassword ? (
                        <FaEyeSlash
                          className="cursor-pointer text-xl mr-2"
                          onClick={() => setShowpassword((prev) => !prev)}
                        />
                      ) : (
                        <FaEye
                          className="cursor-pointer text-xl mr-2"
                          onClick={() => setShowpassword((prev) => !prev)}
                        />
                      )}
                    </label>
                  </div>
                </div>

                <div className="flex w-full my-4 sm:flex-row items-center">
                  <label className="mr-2">Are you a</label>
                  <select
                    className="ml-0 sm:ml-2 mt-2 sm:mt-0 outline-[2px] rounded-sm border border-gray-300 p-1"
                    onChange={(e) => setRole(e.target.value)}
                  >
                    {datas.role.map((data, index) => (
                      <option value={data} key={index}>
                        {data}
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold cursor-pointer flex items-center justify-center"
                >
                  {loading ? (
                  <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>

                  ) : (
                   
                    "Login"
                  )}
                </button>
              </form>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Don't have an Account?
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to="/register"
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
