import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmAlert from "../../Components/ConfirmAlert.jsx";
import { useAuth } from "../../Utils/AuthProvider";

const BASE_URL = "https://hams-eegi.onrender.com";

const PatientProfile = () => {
  const [uservalue, setuservalue] = useState(null);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [docID, setDocID] = useState("");
  const [timeSlots, setTimeslot] = useState([]);
  const [medicalhistory, setmedicalhistory] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [activeTab, setActiveTab] = useState("Appointments");
  const [editable, setEditable] = useState(false);
  const fileInputRef = useRef();
  const [profileimage, setProfileimage] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [cancelid, setcancelid] = useState("");
  const [availabledays, setavailabledays] = useState([]);
  const [showallappointment, setShowallAppointment] = useState(true);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    oldemail: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    address: "",
    image: "",
  });
  const { user, userData } = useAuth();

  const [rescheduledata, setrescheduledata] = useState({
    date: "",
    time: "",
    appointmentID: "",
    doctorID: "",
    patientID: "",
  });

  const navigate = useNavigate();
  const today = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];
  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  useEffect(() => {
    if (user?.role) {
      setuservalue(userData);
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        oldemail: userData.email || "",
        email: userData.email || "",
        phone: userData.phone || "",
        gender: userData.gender || "",
        age: userData.age || "",
        address: userData.address || "",
        image: userData.image || "",
      });
    }
  }, [user, userData]);

  useEffect(() => {
    if (!uservalue?._id) return;

    const fetchAppointments = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/appointment/getappointment?id=${uservalue._id}`
        );
        setAppointments(res.data?.appointment || []);
      } catch (error) {
        console.error("Failed to fetch appointments:", error);
        toast.error("Failed to fetch appointments.");
        setAppointments([]);
      }
    };

    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/medicalhistory/getMedicalHistory?id=${uservalue._id}`
        );
        if (res.status === 200) setmedicalhistory(res.data?.data || []);
      } catch (error) {
        if (error.response?.status === 404) {
          console.log("No medical history");
        } else {
          console.error("Failed to fetch medical history:", error);
        }
      }
    };

    fetchAppointments();
    fetchHistory();
  }, [uservalue, confirm]);

  const fetchTimeSlots = async () => {
    if (!docID || !rescheduledata.date) return;
    try {
      const res = await axios.get(
        `${BASE_URL}/api/appointment/getDoctorTimeSlots?doctorId=${docID}&date=${rescheduledata.date}`
      );
      if (res.status === 200 && res.data.data && res.data.data.length > 0) {
        setTimeslot(res.data.data);
      } else {
        setTimeslot([]);
        toast.error("No available time slots for this doctor on this date.");
      }
    } catch (error) {
      console.error("Error fetching time slots:", error);
      setTimeslot([]);
      toast.error("Error fetching time slots.");
    }
  };

  useEffect(() => {
    if (showRescheduleModal && docID && rescheduledata.date) {
      fetchTimeSlots();
    } else {
      setTimeslot([]);
    }
  }, [showRescheduleModal, docID, rescheduledata.date]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${BASE_URL}/api/user/updateprofile`, {
        updatedata: formData,
      });
      if (res.status === 200) {
        const updateData = { email: formData.email, role: "User" };
        localStorage.setItem("Users", JSON.stringify(updateData));
      }
      setEditable(false);
      toast.success("Profile edited");
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile. Please try again.");
    }
  };

  const InsertProfileImage = async () => {
    try {
      if (profileimage?.name) {
        const imagedata = new FormData();
        imagedata.append("image", profileimage);
        imagedata.append("email", formData.email);
        const res = await axios.post(`${BASE_URL}/api/user/insertimage`, imagedata, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        if (res.status === 201) {
          toast.success("Image inserted successfully.");
          setFormData((prev) => ({ ...prev, image: res.data.image }));
          setProfileimage("");
          fileInputRef.current.value = "";
          navigate("/profile");
        } else toast.error("Image not inserted.");
      } else toast.error("Select an image first.");
    } catch (error) {
      toast.error("Error from the server");
    }
  };

  const handleCancelAppointment = async (id) => {
    try {
      const res = await axios.put(`${BASE_URL}/api/appointment/cancelappointment/${id}`);
      if (res.status === 200) toast.success("Appointment cancelled.");
      else toast.error("Appointment cancellation failed.");
      setConfirm(false);
    } catch (error) {
      toast.error("Appointment cancellation failed.");
      setConfirm(false);
    }
  };

  const handleReschedule = (e) => {
    const { name, value } = e.target;
    setrescheduledata((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "date" ? { time: "" } : {}),
    }));
  };

  const handleUpdateReschedule = async () => {
    if (!rescheduledata.date || !rescheduledata.time) {
      toast.error("Please select both date and time.");
      return;
    }
    try {
      const [startTime, endTime] = rescheduledata.time.split(/\s*-\s*/);
      const payload = {
        appointmentID: rescheduledata.appointmentID,
        date: rescheduledata.date,
        startTime,
        endTime,
        doctorID: docID,
        patientID: rescheduledata.patientID,
      };

      const res = await axios.put(`${BASE_URL}/api/appointment/reschedule`, payload);
      if (res.status === 200) {
        toast.success("Appointment rescheduled successfully.");
        setShowRescheduleModal(false);
        setAppointments((prev) =>
          prev.map((appt) =>
            appt._id === rescheduledata.appointmentID
              ? { ...appt, date: rescheduledata.date, startTime, endTime }
              : appt
          )
        );
      } else toast.error("Failed to reschedule appointment.");
    } catch (error) {
      console.error("Error rescheduling appointment:", error);
      toast.error("Error rescheduling appointment.");
    }
  };

  const changeLocation = async () => {
    if (!navigator.onLine) {
      toast.error("You're offline. We may not be able to update your current location accurately.");
      return;
    }
    if ("geolocation" in navigator) {
      const getPosition = () =>
        new Promise((resolve, reject) => navigator.geolocation.getCurrentPosition(resolve, reject));
      const pos = await getPosition();
      const { latitude, longitude } = pos.coords;

      try {
        const res = await axios.put(`${BASE_URL}/api/user/changelocation`, {
          id: uservalue._id,
          location: { lat: latitude, lng: longitude },
        });
        if (res.status === 200) toast.success("Your location updated.");
        else toast.error("Failed to update your location.");
      } catch (error) {
        console.error("Error getting location or updating:", error);
        toast.error("Failed to get location or update your location.");
      }
    } else toast.error("Geolocation is not supported by your browser.");
  };

  const HandleavailableDays = async (id) => {
    try {
      const res = await axios.get(`${BASE_URL}/api/doctor/doctordata?id=${id}`);
      if (res.status === 200) setavailabledays(res.data.data[0].availableDays);
    } catch (error) {
      console.log("Error fetching available days:", error);
    }
  };

  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  return (
    // The JSX part remains unchanged
    <>{/* All your JSX remains exactly the same */}</>
  );
};

export default PatientProfile;
