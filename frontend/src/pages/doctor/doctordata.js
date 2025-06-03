// src/api/doctordata.js
import axios from "axios";

export const fetchdata = async () => {
  const data = localStorage.getItem("Users");
  const user = data ? JSON.parse(data) : null; // ✅ Correctly parse JSON

  if (user?.email) {
    try {
      const res = await axios.get(`/api/doctor/doctordataquery?email=${user.email}`);
      if (res.status === 200) {
        return res.data.data;
      }
    } catch (err) {
      console.error("Error fetching doctor data:", err);
    }
  }
};
