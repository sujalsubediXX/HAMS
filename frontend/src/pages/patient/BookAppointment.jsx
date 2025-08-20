import axios from "axios";
import React, { useState, useEffect } from "react";
import { FaUserMd, FaCheckCircle, FaArrowAltCircleLeft } from "react-icons/fa";
import { useAuth } from "../../Utils/AuthProvider.jsx";
import toast, { Toaster } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import doctorSpecialties from "../../Utils/Symptoms.js";

export default function BookAppointment() {
   const {user,specialties} = useAuth();

   const specializations = specialties.map((spec) => spec.name);
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [symptom, setSymptom] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedemail, setselectEmail] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [availabledays, setavailabledays] = useState([]);
  const [docname, setDocName] = useState("");
  const [day, setDay] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    date: "",
    time: "",
  });

  const today = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  const maxDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];


  useEffect(() => {
    if (user?.role) {
      
      setFormData((prev) => ({
        ...prev,
        name:user.name,
        email: user.email || "",
      }));
    }
  }, [user]);

  // Handle input changes for form fields
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    const loaddata = {
      specialty: selectedSpecialty,
      patientEmail: user.email,
    };
    const fetchMatchDoctor = async () => {
      try {
        const res = await axios.post("/api/appointment/matchDoctors", loaddata);
        setFilteredDoctors(res.data.data);
      } catch (error) {
        console.log("No data");
      }
    };
    fetchMatchDoctor();
  }, [selectedSpecialty, step]);
  const getDayName = (dateStr) => {
    const date = new Date(dateStr);
    setDay(date);
    return date.toLocaleDateString("en-US", { weekday: "long" });
  };

  // When symptom is submitted, map to specialty and go to next step
  const handleSymptomSubmit = () => {
    const symptomInput = symptom.toLowerCase().trim();

    if (symptomInput.length < 2) {
      toast.error("Please enter at least 2 characters for symptoms.");
      return;
    }

    const matchedSpecialtyEntry = Object.entries(doctorSpecialties).find(
      ([key]) => key.toLowerCase().includes(symptomInput)
    );

    if (matchedSpecialtyEntry) {
      const specialty = matchedSpecialtyEntry[1];
      setSelectedSpecialty(specialty);
      setStep(2);
    } else {
      toast.error("Please enter a valid symptom or select a specialty.");
    }
  };

  // Select specialty directly by clicking buttons
  const handleSpecialtySelect = (specialty) => {
    setSelectedSpecialty(specialty);
    setStep(2);
  };

  // When doctor is selected, extract their available time slots
  const handleDoctorSelect = (doctorName) => {
    setSelectedDoctor(doctorName);
    setDocName(doctorName);

    const doctorObj = filteredDoctors?.find((doc) => doc.name === doctorName);

    if (doctorObj && doctorObj.timeSlots) {
      const available = doctorObj.timeSlots
        .filter((slot) => !slot.isBooked)
        .map((slot) => `${slot.start} - ${slot.end}`);
      setAvailableSlots(available);
      setavailabledays(doctorObj.availableDays);
    } else {
      setAvailableSlots([]);
    }

    setFormData((prev) => ({ ...prev, time: "" }));
  };

  // Handle booking appointment
  const handleBooking = async (e) => {
    e.preventDefault();
    if (!selectedDoctor || !formData.time) {
      toast.error("Please select a doctor and time slot.");
      return;
    }
    if (!formData.name || !formData.email || !formData.date) {
      toast.error("Please fill in all required patient details.");
      return;
    }

    const appointment = {
      ...formData,
      specialty: selectedSpecialty,
      doctorname: docname,
      doctoremail: selectedemail,
      symptom: symptom || "",
      day: day,
    };

    try {
      const res = await axios.post(
        "/api/appointment/bookappointment",
        appointment
      );

      if (res.status === 201) {
        const { doctorName } = res.data.appointment;
        toast.success(`Appointment booked with ${doctorName}`);

        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      }
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error(
          "This time slot is already booked. Please select another slot."
        );
        setFormData((prev) => ({ ...prev, time: "" }));
      } else if (error.response && error.response.status === 410) {
        setFormData((prev) => ({ ...prev, date: "" }));
        toast.error(
          error.response.data.message ||
            "All slots are filled for this day. Select another day."
        );
      } else if (error.response && error.response.status === 411) {
        toast.error(
          error.response.data.message ||
            "You cannot book more then One appointment for the same doctor in the same day."
        );
      } else if (error.response && error.response.status === 404) {
        toast.error(
          error.response.data.message || "Doctor or patient not found."
        );
      } else {
        toast.error("Failed to book appointment. Please try again later.");
      }
    }
  };

  const GoBack = () => {
    setStep(1);
    setSelectedSpecialty("");
    setSelectedDoctor("");
    setFilteredDoctors([]);
  };

  return (
    <>
      <div className="max-w-2xl mx-auto mt-6 bg-white shadow-2xl shadow-blue-500 rounded-2xl p-8">
        {step === 2 && (
          <button
            type="button"
            onClick={GoBack}
            className="absolute top-4 left-4 text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
            title="Go Back"
          >
            <FaArrowAltCircleLeft size={30} />
          </button>
        )}
        <Toaster />
        <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
          Book Your Appointment
        </h1>

        {/* Step Indicator */}
        <div className="flex justify-center mb-6 space-x-4">
          {[1, 2].map((s) => (
            <div
              key={s}
              className={`w-4 h-4 rounded-full ${
                step >= s ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
          ))}
        </div>

        {/* Step 1: Symptom or Specialty Selection */}
        {step === 1 && (
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Describe your symptoms
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., chest pain, headache"
              value={symptom}
              onChange={(e) => setSymptom(e.target.value)}
            />

            <p className="text-sm text-gray-600 mb-2">Or choose a specialty:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {specializations.map(
                (spec, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSpecialtySelect(spec)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-full hover:bg-blue-600 transition cursor-pointer"
                  >
                    {spec}
                  </button>
                )
              )}
            </div>
         
            <button
              onClick={handleSymptomSubmit}
              className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition cursor-pointer"
            >
              Continue
            </button>
          </div>
        )}

        {/* Step 2: Doctor & Details */}
        {step === 2 && (
          <div>
            <form className="space-y-5" onSubmit={handleBooking}>
              <div className="flex gap-2 justify-between items-center w-full">
                <div className="w-1/2">
                  <label className="block text-gray-700 mb-1 font-medium w-1/2">
                    Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>

                <div className="w-1/2 ">
                  <label className="block text-gray-700 mb-1 font-medium w-1/2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">
                  {filteredDoctors.length === 0 ? (
                    <p className="text-md  mb-4">
                      {symptom ? (
                        <>
                          No available{" "}
                          <span className="text-xl text-red-500 text-bold">
                            {selectedSpecialty}
                          </span>{" "}
                          doctor found for{" "}
                          <span className="text-xl text-red-500 text-bold">
                            {symptom}
                          </span>{" "}
                        </>
                      ) : (
                        <>
                          No available{" "}
                          <span className="text-xl text-red-500 text-bold">
                            {selectedSpecialty}
                          </span>{" "}
                          doctor found.
                        </>
                      )}
                    </p>
                  ) : (
                    <>
                      {" "}
                      Available Recommended{" "}
                      <span className="text-blue-600">
                        {selectedSpecialty}
                      </span>{" "}
                    </>
                  )}
                </h3>
                {filteredDoctors.length === 0 ? (
                  <p className="text-md text-gray-500 mb-4">
                    No doctors found for this specialty.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    {filteredDoctors.map((doc, index) => (
                      <div
                        key={index}
                        onClick={() => {
                          handleDoctorSelect(doc.name);
                          setselectEmail(doc.email);
                        }}
                        className={`border rounded-lg p-4 flex items-center gap-4 cursor-pointer transition hover:shadow-lg ${
                          selectedDoctor === doc.name
                            ? "border-green-600 bg-green-50"
                            : "border-gray-300"
                        }`}
                      >
                        
                        <FaUserMd className="text-2xl text-blue-500" />
                        <div>
                          <h4 className="font-bold text-lg">{doc.name}</h4>
                          <p className="text-gray-600">{doc.specialization}</p>
                          <p className="text-gray-600">Score : {Math.round(doc.score)}</p>
                        </div>
                        {selectedDoctor === doc.name && (
                          <FaCheckCircle className="ml-auto text-green-600 text-2xl" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedDoctor && (
                <>
                  <div>
                    <label className=" text-gray-700 mb-1 font-medium flex  items-center">
                      Appointment Date (
                      <p className="text-sm text-red-500 ">
                        Date must be within the next 30 days
                      </p>
                      )
                    </label>
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={(e) => {
                        handleChange(e);
                        const selectedDate = e.target.value;
                        const dayName = getDayName(selectedDate);
                        if (!availabledays.includes(dayName)) {
                          toast.error(`Doctor is not available on ${dayName}.`);
                          setFormData((prev) => ({ ...prev, date: "" }));
                        }
                      }}
                      min={today}
                      max={maxDate}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    />

                    <p className="text-sm text-gray-500 mt-1">Available days</p>
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
                    <label className="block mb-1 font-medium text-gray-700">
                      Available Time Slots
                    </label>
                    {availableSlots.length === 0 ? (
                      <p className="text-sm text-gray-500">
                        No available slots for selected doctor.
                      </p>
                    ) : (
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      >
                        <option value="">Select a time</option>
                        {availableSlots.map((slot, idx) => (
                          <option key={idx} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </>
              )}
              {filteredDoctors.length != 0 ? (
                <button
                  type="submit"
                  className="w-full mt-4 bg-green-600 text-white py-3 rounded-lg cursor-pointer hover:bg-green-700 transition"
                >
                  Book Appointment
                </button>
              ) : (
                <button
                  type="button"
                  onClick={GoBack}
                  className="w-full mt-4 bg-red-600 text-white py-3 rounded-lg transition cursor-pointer"
                >
                  Go Back
                </button>
              )}
            </form>
          </div>
        )}
      </div>
    </>
  );
}
