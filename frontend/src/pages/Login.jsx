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
      {/* ✅ your existing UI remains same */}
    </>
  );
};

export default Login;
