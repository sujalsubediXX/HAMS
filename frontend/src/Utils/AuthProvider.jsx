// src/Components/Utils/AuthProvider.jsx
import { createContext, useState, useContext, useEffect } from "react";
import axios from "axios"
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("Users");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userData, setUserdata] = useState([]);

  // AuthProvider.jsx
  const logout = () => {
    localStorage.removeItem("Users");
    setUser(null);
    setUserdata([])
  };
  const login = (userdata) => {
    localStorage.setItem("Users", JSON.stringify(userdata));
    setUser(userdata);
  };
  useEffect(() => {
    if (!user) return;

    const fetchUserData = async () => {
      let urlpath = "";
      if (user.role === "User") {
        urlpath = `/api/user/userdata?email=${user.email}`;
      } else if (user.role === "Doctor") {
        urlpath = `/api/doctor/doctordata?email=${user.email}`;
      } else {
        urlpath = `/admin/admindata`;
      }

      try {
        const res = await axios.get(urlpath);
        if (res.status === 200) {
          setUserdata(res.data.data);
        } else {
          console.log("No data found or error status", res.status);
        }
      } catch (error) {
        console.error("Error fetching the data from header:", error);
      }
    };

    fetchUserData();
  }, [user]);
  return (
    <AuthContext.Provider value={{ user, login, logout,userData }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy use
export const useAuth = () => useContext(AuthContext);
