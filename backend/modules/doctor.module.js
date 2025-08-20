import mongoose from "mongoose";

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  gender: { type: String, required: true },
  age: { type: Number, required: true },
  specialization: { type: [String], required: true },
  experience: { type: Number, required: true },
  qualification: { type: String, required: true },
  license: { type: String, required: true },
  availableDays: { type: [String], required: true },
  timeSlots: [
    {
      start: { type: String, required: true },
      end: { type: String, required: true },
      _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    },
  ],
  profileImage: { type: String, default: "" },
  address: { type: String },
  isActive: { type: Boolean, default: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});
const Doctor = mongoose.model("Doctor", doctorSchema);
export default Doctor;
