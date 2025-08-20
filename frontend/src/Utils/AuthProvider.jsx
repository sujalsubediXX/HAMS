import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("Users");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [userData, setUserData] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  const logout = () => {
    localStorage.removeItem("Users");
    setUser(null);
    setUserData([]);
  };

  const login = (userdata) => {
    localStorage.setItem("Users", JSON.stringify(userdata));
    setUser(userdata);
  };

  const fetchUserData = useCallback(async () => {
    if (!user) return;
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
        setUserData(res.data.data);
      } else {
        console.log("No data found or error status", res.status);
      }
    } catch (error) {
      console.error("Error fetching the data from header:", error);
    }
  }, [user]);

  const fetchSpecialties = useCallback(async () => {
    try {
      const response = await axios.get("/api/specialty/getAllSpecialties");
      setSpecialties(response.data.data || []);
    } catch (error) {
      console.error("Unable to fetch specialties:", error);
      toast.error("Failed to load specialties.");
    }
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchSpecialties();
    }
  }, [user, fetchUserData, fetchSpecialties]);

  return (
    <AuthContext.Provider value={{ user, login, logout, userData, specialties, fetchSpecialties }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);