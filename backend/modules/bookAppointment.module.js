import mongoose from "mongoose";

const appointmentSchema = mongoose.Schema(
  {
    doctorName: { type: String },
    patientName: { type: String },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    Location: { 
      type:String,
     required:true
    }, // NEW
    date: { type: Date, required: true },
    doctorSpecialty: { type: String },
    startTime: { type: String, required: true }, // e.g., "10:00"
    endTime: { type: String, required: true }, // e.g., "10:30"
    status: { type: String, default: "pending" },

    // NEW - patient location at booking time (optional)
    patientLocation: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  { timestamps: true }
);

const BookAppointment = mongoose.model("BookAppointment", appointmentSchema);
export default BookAppointment;
