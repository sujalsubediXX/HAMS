import mongoose from "mongoose";

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  contactNumber: { type: String },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  isMainBranch: {
    type: Boolean,
    default: false,
  },

},
{timestamps:true});

const Branch = mongoose.model("Branch", branchSchema);
export default Branch;
