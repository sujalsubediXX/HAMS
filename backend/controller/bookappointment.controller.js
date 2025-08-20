import Doctor from "../modules/doctor.module.js";
import User from "../modules/user.module.js";
import BookAppointment from "../modules/bookAppointment.module.js";
import {
  hungarianAlgorithm,
  intervalScheduling,
  HaversineAlgorithm,
} from "../utils/Algorithms.js";

export const getDoctorTimeSlots = async (req, res) => {
  try {
    const { doctorId, date } = req.query;

    if (!doctorId) {
      return res.status(400).json({ message: "doctorId is required" });
    }

    const doctor = await Doctor.findById(doctorId).select(
      "name specialization timeSlots"
    );
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

     const doctorTimeSlots = doctor.timeSlots || [];
    if (doctorTimeSlots.length === 0) {
      return res
        .status(404)
        .json({ message: "No time slots defined for this doctor" });
    }

    let timeSlots = doctorTimeSlots.map((slot) => ({
      start: slot.start,
      end: slot.end,
    }));

    if (date) {

      const parsedDate = new Date(date);
      if (isNaN(parsedDate)) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (parsedDate < today) {
        return res
          .status(400)
          .json({ message: "Cannot fetch slots for past dates" });
      }

      const bookedAppointments = await BookAppointment.find({
        doctorId: doctor._id,
        date: parsedDate,
        status: { $ne: "cancelled" },
      }).select("startTime endTime");

      timeSlots = timeSlots.filter((slot) => {
        return !bookedAppointments.some(
          (appt) => appt.startTime === slot.start && appt.endTime === slot.end
        );
      });

      const allAppointments = bookedAppointments.map((appt) => ({
        id: appt._id.toString(),
        start: appt.startTime,
        end: appt.endTime,
        isNew: false,
      }));

      const availableAppointments = timeSlots.map((slot, index) => ({
        id: `temp-${index}`,
        start: slot.start,
        end: slot.end,
        isNew: true,
      }));

      const combinedAppointments = [
        ...allAppointments,
        ...availableAppointments,
      ];
      const selectedAppointments = intervalScheduling(combinedAppointments);

      timeSlots = selectedAppointments
        .filter((appt) => appt.isNew)
        .map((appt) => ({
          start: appt.start,
          end: appt.end,
        }));
    }

    if (timeSlots.length === 0 && date) {
      return res.status(404).json({
        message: "No available slots for this doctor on the specified date",
      });
    }

    res.status(200).json({
      message: date
        ? "Available time slots retrieved successfully"
        : "Doctor's time slots retrieved successfully",
      doctor: {
        doctorId: doctor._id,
        name: doctor.name,
        specialization: doctor.specialization,
      },
      data: timeSlots,
    });
  } catch (error) {
    console.error("Error fetching doctor's time slots:", error);
    res
      .status(500)
      .json({ message: "Server error while fetching doctor's time slots" });
  }
};

// export const matchDoctors = async (req, res) => {
//   try {
//     const { specialty, patientEmail } = req.body;

//     if (!specialty || !patientEmail) {
//       return res
//         .status(400)
//         .json({ message: "Specialty and patientEmail are required" });
//     }
//     const patient = await User.findOne({ email: patientEmail });
//     if (!patient || !patient.location) {
//       return res
//         .status(400)
//         .json({ message: "Patient location not available" });
//     }

//     const doctors = await Doctor.find({ specialization: specialty });
//     if (doctors.length === 0) {
//       return res.status(404).json({ message: "No doctors found" });
//     }

//     const maxExperience = Math.max(...doctors.map((d) => d.experience || 1));
//     const maxDistance =
//       Math.max(
//         ...doctors.map((d) =>
//           Number(HaversineAlgorithm(patient.location, d.location).toFixed(6))
//         )
//       ) || 1;
//     const maxScore =
//       Math.max(
//         ...doctors.map((doctor) => {
//           const distance = Number(
//             HaversineAlgorithm(patient.location, doctor.location).toFixed(6)
//           );
//           const availableSlots = doctor.timeSlots.filter(
//             (slot) => !slot.isBooked
//           ).length;

//           const distanceScore = ((maxDistance - distance) / maxDistance) * 70;
//           const experienceScore = 10 - (doctor.experience / maxExperience) * 15;
//           const availabilityScore = availableSlots * 15;

//           return distanceScore + experienceScore + availabilityScore;
//         })
//       ) || 1;
//     const costMatrix = [
//       doctors.map((doctor) => {
//         const distance = Number(
//           HaversineAlgorithm(patient.location, doctor.location).toFixed(6)
//         );
//         const availableSlots = doctor.timeSlots.filter(
//           (slot) => !slot.isBooked
//         ).length;

//         const distanceScore = ((maxDistance - distance) / maxDistance) * 75;

//         const experienceScore = 10 - (doctor.experience / maxExperience) * 15;
//         const availabilityScore = availableSlots * 15;

//         const score = distanceScore + experienceScore + availabilityScore;
//         return maxScore - score;
//       }),
//     ];
//     const matches = hungarianAlgorithm(costMatrix);
//     const patientIndex = 0;

//     const matchedDoctors = matches
//       .filter((match) => match[0] === patientIndex)
//       .slice(0, 2) // limit to 2 doctors
//       .map((match) => doctors[match[1]]);

//     if (!matchedDoctors.length) {
//       return res.status(404).json({ message: "No match found" });
//     }

//     const matchedDoctorObjs = matchedDoctors.map((doctor) => {
//       const doctorIndex = doctors.indexOf(doctor);
//       const cost = costMatrix[patientIndex][doctorIndex];
//       const score = maxScore - cost;
//       return {
//         ...doctor.toObject(),
//         score,
//         distance: Number(
//           HaversineAlgorithm(patient.location, doctor.location).toFixed(6)
//         ),
//       };
//     });

//     res.json({ data: matchedDoctorObjs });
//   } catch (error) {
//     console.error("Error in matchDoctors:", error.message);
//     res.status(500).json({ message: "Matching failed", error: error.message });
//   }
// };
export const matchDoctors = async (req, res) => {
  try {
    const { specialty, patientEmail } = req.body;

    if (!specialty || !patientEmail) {
      return res.status(400).json({
        message: "Specialty and patientEmail are required",
      });
    }

    const patient = await User.findOne({ email: patientEmail });
    if (!patient || !patient.location) {
      return res.status(400).json({
        message: "Patient location not available",
      });
    }

    const doctors = await Doctor.find({ specialization: specialty, isActive: true });

    if (doctors.length < 5) {
      return res.status(404).json({
        message: "Not enough doctors found",
      });
    }

    const maxExperience = Math.max(...doctors.map((d) => d.experience || 1));
    const maxDistance = Math.max(
      ...doctors.map((d) =>
        Number(HaversineAlgorithm(patient.location, d.location).toFixed(6))
      )
    ) || 1;

    const doctorScores = doctors.map((doctor) => {
      const distance = Number(
        HaversineAlgorithm(patient.location, doctor.location).toFixed(6)
      );
      const availableSlots = doctor.timeSlots.filter((slot) => !slot.isBooked)
        .length;

      const distanceScore = ((maxDistance - distance) / maxDistance) * 75;
      const experienceScore = 10 - (doctor.experience / maxExperience) * 15;
      const availabilityScore = availableSlots * 15;

      const totalScore = distanceScore + experienceScore + availabilityScore;

      return {
        doctor,
        distance,
        score: totalScore,
        cost: 1000 - totalScore, // Lower cost = better
      };
    });

    // ✅ Sort by cost ascending (best matches)
    const top5Doctors = doctorScores
      .sort((a, b) => a.cost - b.cost)
      .slice(0, 5)
      .map(({ doctor, distance, score }) => ({
        ...doctor.toObject(),
        distance,
        score,
      }));

    res.status(200).json({
      message: "Top 5 doctor matches",
      data: top5Doctors,
    });
  } catch (error) {
    console.error("Error in matchDoctors:", error.message);
    res.status(500).json({ message: "Matching failed", error: error.message });
  }
};

// export const matchDoctors = async (req, res) => {
//   try {
//     const { specialty, patientEmail } = req.body;

//     if (!specialty || !patientEmail) {
//       return res
//         .status(400)
//         .json({ message: "Specialty and patientEmail are required" });
//     }

//     const patient = await User.findOne({ email: patientEmail });
//     if (!patient || !patient.location) {
//       return res
//         .status(400)
//         .json({ message: "Patient location not available" });
//     }

//     const doctors = await Doctor.find({ specialization: specialty , isActive: true});
//     // const doctor = await Doctor.findOne({ email: doctoremail, isActive: true });

//     if (doctors.length < 5) {
//       return res.status(404).json({ message: "Not enough doctors found" });
//     }

//     const maxExperience = Math.max(...doctors.map((d) => d.experience || 1));
//     const maxDistance = Math.max(
//       ...doctors.map((d) =>
//         Number(HaversineAlgorithm(patient.location, d.location).toFixed(6))
//       )
//     ) || 1;

//     const doctorScores = doctors.map((doctor) => {
//       const distance = Number(
//         HaversineAlgorithm(patient.location, doctor.location).toFixed(6)
//       );
//       const availableSlots = doctor.timeSlots.filter((slot) => !slot.isBooked)
//         .length;

//       const distanceScore = ((maxDistance - distance) / maxDistance) * 75;
//       const experienceScore = 10 - (doctor.experience / maxExperience) * 15;
//       const availabilityScore = availableSlots * 15;

//       const totalScore = distanceScore + experienceScore + availabilityScore;
//       return {
//         doctor,
//         cost: 1000 - totalScore, // Hungarian minimizes cost, so invert
//         distance,
//         score: totalScore,
//       };
//     });

//     // Step 1: Build cost matrix with two identical rows (same patient)
//     const costMatrix = [
//       doctorScores.map((d) => d.cost),
//       doctorScores.map((d) => d.cost), // duplicated patient
//     ];

//     // Step 2: Apply Hungarian Algorithm
//     const matches = hungarianAlgorithm(costMatrix); // returns [[0, x], [1, y]]

//     // Step 3: Pick unique doctor matches
//     const matchedDoctorIndices = Array.from(
//       new Set(matches.map((m) => m[1])) // ensure uniqueness
//     ).slice(0, 5); // limit to top 2 matches

//     const matchedDoctors = matchedDoctorIndices.map((idx) => {
//       const { doctor, distance, score } = doctorScores[idx];
//       return {
//         ...doctor.toObject(),
//         distance,
//         score,
//       };
//     });
//     matchedDoctors.sort((a, b) => b.score - a.score);

//     res.status(200).json({
//       message: "Top 5 doctor matches using Hungarian Algorithm",
//       data: matchedDoctors,
//     });
//   } catch (error) {
//     console.error("Error in matchDoctors:", error.message);
//     res.status(500).json({ message: "Matching failed", error: error.message });
//   }
// };

export const bookAppointment = async (req, res) => {
  try {
    const { email,name, date, time, specialty, doctorname, doctoremail } = req.body;

    // Parse time slot "10:00 - 10:30"
    const [newStart, newEnd] = time.split(" - ").map((t) => t.trim());

    // Find patient
    const patient = await User.findOne({ email });
    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }
    const doctor = await Doctor.findOne({ email: doctoremail });
    // const doctor = await Doctor.findOne({ email: doctoremail, isActive: true });

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Validate time slot exists in doctor's timeSlots
    const doctorTimeSlot = doctor.timeSlots.find(
      (slot) => slot.start === newStart && slot.end === newEnd
    );

    if (!doctorTimeSlot) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    // Fetch existing appointments for assigned doctor on the date
    const existingAppointments = await BookAppointment.find({
      doctorId: doctor._id,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });
    const appointmentCount = existingAppointments.length;
    const totalSlots = doctor.timeSlots.length;
    const userTotalAppointment = await BookAppointment.find({
      doctorId: doctor._id,
      patientId: patient._id,
      date: new Date(date),
      status: { $ne: "cancelled" },
    });
    if (userTotalAppointment.length >= 1) {
      return res.status(411).json({
        message:
          "You cannot book more than One appointment for the same doctor in the same day.",
      });
    }
    if (appointmentCount == totalSlots) {
      return res.status(410).json({
        message: "All slots are filled for this day. Select another day.",
      });
    }
    const isSlotBooked = existingAppointments.some(
      (appt) => appt.startTime === newStart && appt.endTime === newEnd
    );

    if (isSlotBooked) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked." });
    }

    // Combine existing and new appointment for interval scheduling
    const allAppointments = existingAppointments.map((appt) => ({
      id: appt._id.toString(),
      start: appt.startTime,
      end: appt.endTime,
      isNew: false,
      apptData: appt,
    }));

    allAppointments.push({
      id: "new",
      start: newStart,
      end: newEnd,
      isNew: true,
    });

    // Apply interval scheduling
    const selectedAppointments = intervalScheduling(allAppointments);
    const newAppointmentSelected = selectedAppointments.some(
      (appt) => appt.isNew
    );

    if (!newAppointmentSelected) {
      return res.status(409).json({
        message: "This time slot conflicts with existing appointments.",
      });
    }

    // Create and save new appointment
    const newAppointment = new BookAppointment({
      doctorName: doctorname,
      patientName: name,
      patientId: patient._id,
      doctorId: doctor._id,
      date: new Date(date),
      doctorSpecialty: specialty,
      Location:doctor.address,
      startTime: newStart,
      endTime: newEnd,
      status: "pending",
    });

    await newAppointment.save();

    res.status(201).json({
      message: "Appointment booked successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Appointment booking error:", error);
    res
      .status(500)
      .json({ message: "Server error during appointment booking" });
  }
};

export const rescheduleAppointment = async (req, res) => {
  try {
    const { appointmentID, date, startTime, endTime, doctorID, patientID } =
      req.body;

    if (
      !appointmentID ||
      !date ||
      !startTime ||
      !endTime ||
      !doctorID ||
      !patientID
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const appointment = await BookAppointment.findById(appointmentID);
    if (!appointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }


    const doctor = await Doctor.findById(doctorID);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    // Validate the slot exists in doctor.timeSlots
    const doctorTimeSlot = doctor.timeSlots.find(
      (slot) => slot.start === startTime && slot.end === endTime
    );
    if (!doctorTimeSlot) {
      return res.status(400).json({ message: "Invalid time slot" });
    }

    const existingAppointments = await BookAppointment.find({
      doctorID,
      date: new Date(date),
      _id: { $ne: appointmentID },
      status: { $ne: "cancelled" },
    });


    const isSlotBooked = existingAppointments.some(
      (appt) => appt.startTime === startTime && appt.endTime === endTime
    );
    if (isSlotBooked) {
      return res
        .status(409)
        .json({ message: "This time slot is already booked." });
    }

    // Prepare for interval scheduling
    const allAppointments = existingAppointments.map((appt) => ({
      id: appt._id.toString(),
      start: appt.startTime,
      end: appt.endTime,
      isNew: false,
    }));

    allAppointments.push({
      id: "new",
      start: startTime,
      end: endTime,
      isNew: true,
    });

    const selectedAppointments = intervalScheduling(allAppointments);
    const isNewIncluded = selectedAppointments.some((a) => a.isNew);

    if (!isNewIncluded) {
      return res
        .status(409)
        .json({ message: "New time conflicts with existing appointments." });
    }

    // Update appointment
    appointment.date = new Date(date);
    appointment.startTime = startTime;
    appointment.endTime = endTime;
    appointment.status = "pending";
    await appointment.save();

    res.status(200).json({
      message: "Appointment rescheduled successfully",
      updatedAppointment: appointment,
    });
  } catch (error) {
    console.error("Rescheduling error:", error);
    res.status(500).json({ message: "Server error during rescheduling" });
  }
};

export const getappointmentdata = async (req, res) => {
 
  try {
    let data;
    if (req.query.id) {
      data = await BookAppointment.find({ patientId: req.query.id });
    } else if (req.query.doctorID) {
      data = await BookAppointment.find({ doctorId: req.query.doctorID });
    }

    if (data) {
      return res.status(200).json({
        message: "Appointment data fetched successfully.",
        appointment: data,
      });
    }
  } catch (error) {
    console.error("Error fetching appointment data:", error);
    return res.status(500).json({
      message: "Internal server error while fetching appointment data.",
    });
  }
};

export const patientByDoctorEmail = async (req, res) => {
  const email = req.query.email;

  try {
    const doctor = await Doctor.findOne({ email });
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    const appointments = await BookAppointment.find({ doctorId: doctor._id });

    const patientIds = [
      ...new Set(appointments.map((app) => app.patientId.toString())),
    ];

    const patients = await User.find({ _id: { $in: patientIds } });
    res.json({ data: patients });
  } catch (error) {
    console.error("Error fetching patients by doctor email:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const pendingCount = await BookAppointment.countDocuments({
      status: "pending",
    });
    const completedCount = await BookAppointment.countDocuments({
      status: "completed",
    });
    const cancelledCount = await BookAppointment.countDocuments({
      status: "cancelled",
    });

    res.status(200).json({
      pending: pendingCount,
      completed: completedCount,
      cancelled: cancelledCount,
    });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Server error while fetching appointment stats" });
  }
};

export const getTopSpecialties = async (req, res) => {
  try {
    const topSpecialties = await BookAppointment.aggregate([
      {
        $group: {
          _id: "$doctorSpecialty",
          count: { $sum: 1 },
        },
      },
      {
        $sort: { count: -1 },
      },
      {
        $limit: 4,
      },
    ]);

    res.status(200).json(topSpecialties);
  } catch (error) {
    console.error("Error fetching top specialties:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const chartdayData = async (req, res) => {
  try {
    const appointments = await BookAppointment.find();

    const today = new Date();

    today.setHours(0, 0, 0, 0);

    const next7Days = new Date(today);
    next7Days.setDate(today.getDate() + 6);

    const filteredAppointments = appointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.date);
      appointmentDate.setHours(0, 0, 0, 0);
      return appointmentDate >= today && appointmentDate <= next7Days;
    });

    const grouped = filteredAppointments.reduce((acc, appointment) => {
      const date = new Date(appointment.date).toISOString().split("T")[0];
      acc[date] = (acc[date] || 0) + 1;
      return acc;
    }, {});

    const result = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);
      const dateStr = currentDate.toISOString().split("T")[0];
      result.push({
        date: dateStr,
        count: grouped[dateStr] || 0,
      });
    }

    res.json(result);
  } catch (err) {
    console.error("Failed to fetch appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
};
export const chartDoctorAppointments = async (req, res) => {
  try {
    const appointments = await BookAppointment.find();

    const grouped = appointments.reduce((acc, appointment) => {
      const doctor = appointment.doctorName || "Unknown";
      acc[doctor] = (acc[doctor] || 0) + 1;
      return acc;
    }, {});

    let formattedData = Object.entries(grouped).map(([doctorName, count]) => ({
      doctorName,
      count,
    }));
    formattedData.sort((a, b) => b.count - a.count);

    formattedData = formattedData.slice(0, 5);

    res.json(formattedData);
  } catch (err) {
    console.error("Failed to fetch doctor appointments:", err);
    res.status(500).json({ error: "Server error" });
  }
};

export const CancelAppointment = async (req, res) => {
  const { _id } = req.params;

  try {
    const appointment = await BookAppointment.findByIdAndUpdate(
      _id,
      { $set: { status: "cancelled" } },
      { new: true }
    );

    if (appointment) {
      return res
        .status(200)
        .json({ message: "Appointment cancelled successfully", appointment });
    } else {
      return res.status(404).json({ message: "Appointment not found" });
    }
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return res
      .status(500)
      .json({ message: "Internal server error while cancelling appointment" });
  }
};
