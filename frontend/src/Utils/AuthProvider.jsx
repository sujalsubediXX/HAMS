import { createContext, useState, useContext, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";

// Create AuthContext
const AuthContext = createContext();

// AuthProvider component
export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage safely
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem("Users");
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [userData, setUserData] = useState([]);
  const [specialties, setSpecialties] = useState([]);

  // Base URL for backend (works locally and in production)
  const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

  // Logout function
  const logout = () => {
    localStorage.removeItem("Users");
    setUser(null);
    setUserData([]);
  };

  // Login function
  const login = (userdata) => {
    localStorage.setItem("Users", JSON.stringify(userdata));
    setUser(userdata);
  };

  // Fetch user-specific data
  const fetchUserData = useCallback(async () => {
    if (!user) return;

    let urlpath = "";

    if (user?.role === "User") {
      urlpath = `/api/user/userdata?email=${user.email}`;
    } else if (user?.role === "Doctor") {
      urlpath = `/api/doctor/doctordata?email=${user.email}`;
    } else if (user?.role === "Admin") {
      urlpath = `/api/admin/admindata`;
    } else {
      console.warn("Unknown role or missing user:", user);
      return;
    }

    try {
      const res = await axios.get(`${BASE_URL}${urlpath}`);
      if (res.status === 200) {
        setUserData(res.data.data);
      } else {
        console.log("No data found or error status", res.status);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to fetch user data.");
    }
  }, [user, BASE_URL]);

  // Fetch specialties
  const fetchSpecialties = useCallback(async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/specialty/getAllSpecialties`);
      setSpecialties(response.data.data || []);
    } catch (error) {
      console.error("Unable to fetch specialties:", error);
      toast.error("Failed to load specialties.");
    }
  }, [BASE_URL]);

  // Load data when user logs in
  useEffect(() => {
    if (user) {
      fetchUserData();
      fetchSpecialties();
    } else {
      setUserData([]);
    }
  }, [user, fetchUserData, fetchSpecialties]);

  // Provide context values
  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        userData,
        specialties,
        fetchSpecialties,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => useContext(AuthContext);
