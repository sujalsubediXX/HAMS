import MedicalHistory from "../modules/medicalHistory.module.js";
import BookAppointment from "../modules/bookAppointment.module.js";

export const insertMedicalData = async (req, res) => {
  try {
    const { patientID, doctorID, doctorName, diagnosis, treatment,remarks, appointmentId } =
      req.body;

    // Create medical history record
    const createmedicaldata = await MedicalHistory.create({
      patientID,
      doctorID,
      appointmentId,
      doctorName,
      diagnosis,
      treatment,
      remarks
    });

    if (!createmedicaldata) {
      return res.status(400).json({ message: "Medical data not inserted" });
    }

    const updatedAppointment = await BookAppointment.findByIdAndUpdate(
      appointmentId,
      { $set: { status: "completed" } },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    // Return success message with updated appointment data
    return res.status(200).json({
      message: "Medical data inserted and appointment marked as completed",
      appointment: updatedAppointment,
    });
  } catch (error) {
    console.error("Error inserting medical data:", error);
    return res.status(500).json({
      message: "Server error: Could not insert medical data",
      error: error.message,
    });
  }
};

// PUT /api/medicalhistory/updateMedicalData
export const UpatemedicalHistory = async (req, res) => {
  const { appointmentId, diagnosis, treatment } = req.body;
  try {
    const updated = await MedicalHistory.findOneAndUpdate(
      { appointmentId },
      { diagnosis, treatment },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "No record found." });

    res.status(200).json({ message: "Medical data updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
export const getMedicalhistory = async (req, res) => {
  const { doctorID,id } = req.query;
  try {
    let data = [];

    if (doctorID) {
      data = await MedicalHistory.find({ doctorID });
    } else if (id) {
     
      data = await MedicalHistory.find({ patientID: id }); 
    }

    if (!data) return res.status(404).json({ message: "No record found." });

    res.status(200).json({ message: "Medical data ", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
