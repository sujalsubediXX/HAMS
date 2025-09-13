import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import ConfirmAlert from "../../Components/ConfirmAlert.jsx";
import { useAuth } from "../../Utils/AuthProvider";

const BASE_URL = "https://hams-7zpe.onrender.com";

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
    <>
      {!editable ? (
        <div
          className={`min-h-screen bg-gray-100 pt-[16vh]  w-full ${
            showRescheduleModal ? "hidden" : "block"
          }`}
        >
          <div className="w-[90%] mx-auto p-4 md:p-8">
            <main className="flex flex-col md:flex-row gap-6 items-start">
              <div
                className="bg-white shadow-xl rounded-xl p-6 flex flex-col items-center"
                style={{ width: "312px", minHeight: "500px" }}
              >
                <img
                  src={formData.image ? formData.image : "/patientimage.png"}
                  alt="Profile"
                  style={{ width: "200px", height: "200px" }}
                  className="rounded-full object-cover border-4 border-blue-500"
                />
                <div className="text-center mt-4">
                  <h2 className="text-2xl font-bold text-blue-700">
                    {formData.firstName}
                  </h2>
                  <p className="text-gray-600">{formData.email}</p>
                  <p className="text-gray-600">{formData.phone}</p>
                  <div className="flex gap-3 justify-center items-center mt-4">
                    <div className="flex flex-col items-start">
                      <label
                        htmlFor="profilePic"
                        className="bg-green-400 text-white p-2 rounded cursor-pointer hover:bg-green-600"
                      >
                        {formData.image ? "Change Image" : "Select Image"}
                      </label>
                      <input
                        id="profilePic"
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => setProfileimage(e.target.files[0])}
                      />
                    </div>
                    <button
                      onClick={InsertProfileImage}
                      className="bg-red-500 text-white p-2 rounded cursor-pointer hover:bg-red-600"
                    >
                      Update Image
                    </button>
                  </div>
                  <button
                    onClick={() => setEditable(true)}
                    className="bg-blue-500 text-white p-2 rounded cursor-pointer hover:bg-blue-600 w-full mt-4"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={() => changeLocation()}
                    className="bg-purple-500 text-white p-2 rounded cursor-pointer hover:bg-purple-600 w-full mt-4"
                  >
                    Update Location
                  </button>
                </div>
              </div>

              <div style={{ width: "1100px", height: "400px" }}>
                <section className="bg-white rounded-xl shadow-xl p-6 mb-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <p>
                      <strong className="text-gray-700">Name:</strong>{" "}
                      {formData.firstName} {formData.lastName}
                    </p>
                    <p>
                      <strong className="text-gray-700">Email:</strong>{" "}
                      {formData.email}
                    </p>
                    <p>
                      <strong className="text-gray-700">Phone:</strong>{" "}
                      {formData.phone}
                    </p>
                    <p>
                      <strong className="text-gray-700">Gender:</strong>{" "}
                      {formData.gender.slice(0, 1).toUpperCase() +
                        formData.gender.slice(1)}
                    </p>
                    <p>
                      <strong className="text-gray-700">Age:</strong>{" "}
                      {formData.age}
                    </p>
                  </div>
                </section>

                <div className="flex border-b mb-4 justify-between px-4">
                  <div className="">
                    {["Appointments", "History"].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`py-2 px-4 capitalize font-medium text-sm sm:text-base ${
                          activeTab === tab
                            ? "border-b-4 border-blue-600 text-blue-600"
                            : "text-gray-500 hover:text-blue-500"
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                  {activeTab == "Appointments" && (
                    <div className="ml-4 space-x-2 ">
                      <span>Show All</span>
                      <input
                        type="checkbox"
                        className="bg-blue-500 "
                        onChange={() => setShowallAppointment((prev) => !prev)}
                      />
                    </div>
                  )}
                </div>

                <div
                  className="bg-white p-6 rounded-lg shadow-md"
                  style={{ height: "46vh", overflowY: "auto" }}
                >
                  {activeTab === "Appointments" ? (
                    appointments.length > 0 ? (
                      <div className="overflow-x-auto overflow-scroll">
                        <table className="w-full text-center border border-gray-300">
                          <thead>
                            <tr className="bg-blue-100 text-blue-700">
                              <th className="p-3 border">Date</th>
                              <th className="p-3 border">Time</th>
                              <th className="p-3 border">Doctor</th>
                              <th className="p-3 border">Location</th>
                              <th className="p-3 border">Status</th>
                              <th className="p-3 border">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {appointments
                              .filter((data) =>
                                showallappointment
                                  ? data.status !== "cancelled"
                                  : [
                                      "pending",
                                      "cancelled",
                                      "completed",
                                    ].includes(data.status)
                              )
                              .map((appt, index) => (
                                <tr
                                  key={index}
                                  className="border-b hover:bg-gray-50"
                                >
                                  <td className="px-3 py-2 border">
                                    {new Date(appt.date).toLocaleDateString()}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {appt.startTime}-{appt.endTime}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    Dr. {appt.doctorName.toUpperCase()}
                                  </td>
                                  <td className="px-3 py-2 border">
                                    {appt.Location}
                                  </td>
                                  <td className={`border font-semibold `}>
                                    <span
                                      className={`px-3 py-2 rounded-2xl${
                                        appt.status.toLowerCase() ===
                                        "confirmed"
                                          ? "bg-green-400"
                                          : "bg-yellow-300 "
                                      }`}
                                    >
                                      {appt.status}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2 border space-x-2">
                                    {appt.status === "completed" && (
                                      <button
                                        onClick={() => setActiveTab("History")}
                                        className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700"
                                      >
                                        View
                                      </button>
                                    )}
                                    {appt.status === "cancelled" && (
                                      <button
                                        className="text-white px-4 py-2 rounded"
                                        style={{ background: "black" }}
                                      >
                                        Cancelled
                                      </button>
                                    )}
                                    {appt.status === "pending" && (
                                      <>
                                        <button
                                          onClick={() => {
                                            setConfirm(true);
                                            setcancelid(appt._id);
                                          }}
                                          className="bg-red-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-red-600"
                                        >
                                          Cancel
                                        </button>
                                        <button
                                          onClick={() => {
                                            setShowRescheduleModal(true);
                                            setDocID(appt.doctorId);
                                            HandleavailableDays(appt.doctorId);
                                            console.log(appt.doctorId);
                                            setrescheduledata({
                                              date: "",
                                              time: "",
                                              appointmentID: appt._id,
                                              doctorID: appt.doctorId || "",
                                              patientID: uservalue._id,
                                            });
                                          }}
                                          className="bg-blue-600 text-white px-4 py-2 cursor-pointer rounded hover:bg-blue-700"
                                        >
                                          ReSchedule
                                        </button>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-gray-600">No appointments found.</p>
                    )
                  ) : activeTab === "History" ? (
                    medicalhistory.length > 0 ? (
                      <div className="space-y-4">
                        {medicalhistory.map((record, idx) => (
                          <div
                            key={idx}
                            className="border rounded p-4 shadow-sm bg-gray-50"
                          >
                            <p>
                              <strong>Date:</strong>{" "}
                              {new Date(record.date).toLocaleDateString()}
                            </p>
                            <p>
                              <strong>Diagnosis:</strong> {record.diagnosis}
                            </p>
                            <p>
                              <strong>Treatment:</strong> {record.treatment}
                            </p>
                            <p>
                              <strong>Remarks:</strong> {record.remarks}
                            </p>
                            <p>
                              <strong>Doctor:</strong> {record.doctorName}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <h1>No Medical Records</h1>
                    )
                  ) : null}
                </div>
              </div>
            </main>
          </div>
        </div>
      ) : (
        <div className="min-h-screen bg-gray-100 pt-[16vh]">
          <div
            style={{ width: "70vw", height: "80vh" }}
            className="mx-auto bg-white p-8 rounded-lg shadow-md"
          >
            <h2 className="text-2xl font-bold text-blue-700 mb-6">
              Edit Patient Profile
            </h2>
            <form onSubmit={handleFormSubmit}>
              <div className="flex space-x-2">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="w-full p-2 mb-3 border rounded"
                  required
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="w-full p-2 mb-3 border rounded"
                  required
                />
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full p-2 my-3 border rounded"
                required
              />
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Phone"
                className="w-full p-2 my-3 border rounded"
                required
              />

              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full p-2 my-3 border rounded"
                required
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>

              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="Age"
                className="w-full p-2 my-3 border rounded"
                min="0"
                max="150"
                required
              />
              <div className="flex justify-between mt-12 ">
                <button
                  type="button"
                  onClick={() => setEditable(false)}
                  className="bg-black text-white px-3 py-2 rounded hover:bg-gray-500 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 cursor-pointer"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {confirm && (
        <ConfirmAlert
          onCancel={() => {
            setConfirm(false);
            setcancelid("");
          }}
          info="Yes"
          message="Do you want to cancel this Appointment?"
          onConfirm={() => handleCancelAppointment(cancelid)}
        />
      )}
      {showRescheduleModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-50 z-50 h-[100vh] w-[100vw]">
          <div className="bg-white shadow-2xl p-6 rounded w-[90vw] max-w-md">
            <h2 className="text-xl font-bold mb-4 text-blue-700">
              Reschedule Appointment
            </h2>
            <div className="space-y-3">
              <div>
                <label className="block text-gray-700 mb-1 font-medium">
                  Appointment Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={rescheduledata.date}
                  onChange={(e) => {
                    const selectedDate = e.target.value;
                    const dayName = getDayName(selectedDate);
                    console.log(dayName);
                    console.log(availabledays);
                    if (!availabledays.includes(dayName)) {
                      toast.error(`Doctor is not available on ${dayName}.`);
                    } else {
                      handleReschedule(e);
                    }
                  }}
                  min={today}
                  max={maxDate}
                  required
                  className={`w-full px-4 py-2 border rounded-lg ${
                    rescheduledata.date ? "border-gray-300" : "border-red-500"
                  }`}
                />
                <p className="text-sm text-gray-500 mt-1">
                  * Date must be within the next 30 days
                </p>
                <p className="text-sm text-gray-500 mt-1">AvailableDays:</p>
                <p className="text-sm text-gray-500 mt-1">
                  {availabledays.map((day, index) => (
                    <span
                      key={index}
                      className="mr-2 px-2 py-1 bg-blue-100 rounded"
                    >
                      {day}
                    </span>
                  ))}
                </p>
              </div>
              <div>
                <label className="block font-medium text-gray-700">
                  New Time Slot
                </label>
                <select
                  name="time"
                  value={rescheduledata.time}
                  onChange={handleReschedule}
                  className={`w-full p-2 border rounded ${
                    rescheduledata.time ? "border-gray-300" : "border-red-500"
                  }`}
                  required
                >
                  <option value="" disabled>
                    Select a time slot
                  </option>
                  {timeSlots.map((slot, index) => (
                    <option key={index}>
                      {slot.start}-{slot.end}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="mt-4 flex justify-end space-x-3">
              <button
                onClick={() => setShowRescheduleModal(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReschedule}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PatientProfile;
