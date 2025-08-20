import mongoose from "mongoose";

const medicalHistorySchema = mongoose.Schema({
  patientID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  doctorID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Doctor"
  },
  appointmentId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "BookAppointments"
  },
  doctorName: {
    type: String,
    required: true
  },
  diagnosis: {
    type: String,
    required: true
  },
  treatment: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

const MedicalHistory = mongoose.model("MedicalHistory", medicalHistorySchema);
export default MedicalHistory;
