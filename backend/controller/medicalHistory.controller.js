import MedicalHistory from "../modules/medicalHistory.module.js";
import BookAppointment from "../modules/bookAppointment.module.js";

export const insertMedicalData = async (req, res) => {
  try {
    const { patientID, doctorID, doctorName, diagnosis, treatment, _id } =
      req.body;

    // Create medical history record
    const createmedicaldata = await MedicalHistory.create({
      patientID,
      doctorID,
      doctorName,
      diagnosis,
      treatment,
    });

    if (!createmedicaldata) {
      return res.status(400).json({ message: "Medical data not inserted" });
    }

    const updatedAppointment = await BookAppointment.findByIdAndUpdate(
      _id,
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
  const { _id, diagnosis, treatment } = req.body;
  try {
    const updated = await MedicalHistory.findOneAndUpdate(
      { appointmentId: _id },
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
      // Assuming 'id' here refers to a patientID or _id in your MedicalHistory schema
      data = await MedicalHistory.find({ patientID: id }); // Or _id: id, depending on your schema
    }

    if (!data) return res.status(404).json({ message: "No record found." });

    res.status(200).json({ message: "Medical data ", data });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
