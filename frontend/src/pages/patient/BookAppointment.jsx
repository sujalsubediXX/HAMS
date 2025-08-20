import React, { useEffect, useState } from "react";
import axios from "axios";

function BookAppointment() {
  const [symptom, setSymptom] = useState("");
  const [date, setDate] = useState("");
  const [doctor, setDoctor] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [slot, setSlot] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const handleSymptom = async () => {
    try {
      const loaddata = { symptom, date };
      const res = await axios.post(
        "https://hams-eegi.onrender.com/api/appointment/matchDoctors",
        loaddata,
        { withCredentials: true }
      );
      setDoctor(res.data.doctors);
      setSlot(res.data.slots);
    } catch (err) {
      console.error(err);
    }
  };

  const handleBook = async () => {
    try {
      const appointment = {
        doctorId: selectedDoctor,
        slot: selectedSlot,
        date,
        symptom,
      };
      const res = await axios.post(
        "https://hams-eegi.onrender.com/api/appointment/bookappointment",
        appointment,
        { withCredentials: true }
      );
      alert("Appointment booked successfully!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      alert("Error booking appointment!");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Book Appointment</h1>

      <input
        type="text"
        placeholder="Enter symptom"
        value={symptom}
        onChange={(e) => setSymptom(e.target.value)}
        className="border p-2 mr-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border p-2 mr-2"
      />
      <button
        onClick={handleSymptom}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Find Doctors
      </button>

      {doctor.length > 0 && (
        <div className="mt-4">
          <select
            value={selectedDoctor}
            onChange={(e) => setSelectedDoctor(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="">Select Doctor</option>
            {doctor.map((doc) => (
              <option key={doc._id} value={doc._id}>
                {doc.name} ({doc.specialty})
              </option>
            ))}
          </select>

          <select
            value={selectedSlot}
            onChange={(e) => setSelectedSlot(e.target.value)}
            className="border p-2 mr-2"
          >
            <option value="">Select Slot</option>
            {slot.map((s, idx) => (
              <option key={idx} value={s}>
                {s}
              </option>
            ))}
          </select>

          <button
            onClick={handleBook}
            className="bg-green-500 text-white px-4 py-2 rounded"
          >
            Book Appointment
          </button>
        </div>
      )}
    </div>
  );
}

export default BookAppointment;
