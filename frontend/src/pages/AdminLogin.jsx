import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../Utils/AuthProvider";

const AdminLogin = () => {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [showPassword, setShowpassword] = useState(false);

  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      if (user.role == "Admin") {
        navigate("/admin/admindashboard");
      }
    }, 1000);
  }, [user]);

  const setLogin = async () => {
    try {
      setLoading(true);
      let res = "";
      let location = "";
      res = await axios.post("https://hams-eegi.onrender.com/api/admin/login", {
        email,
        password,
      });
      location = "/admin/admindashboard";

      const userdata = { email, role:"Admin", name: res.data.username };

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
        <div className="w-[92vw] md:w-[86vw] lg:w-[36%] pb-4 h-auto md:h-4/5 rounded-lg shadow-2xl flex md:flex-row overflow-hidden bg-white text-black">
          <div className="w-full  h-full">
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

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white p-3 my-6 rounded-lg hover:bg-blue-700 transition duration-300 font-semibold cursor-pointer flex items-center justify-center"
                >
                  {loading ? (
                    <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    "Login"
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminLogin;
