import mongoose from "mongoose";

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
    },
    lastName: {
      type: String,

    },
    email: {
      type: String,
      required: true,
   
    },
    password: {
      type: String,

    },
    age: {
      type: Number,

    },
    phone: {
      type: String,

    },
    gender: {
      type: String,
 
    },
    image:{
      type:String,
      default: "",
    },
    isActive:{
      type:Boolean,
      default:true,
    },
    location: {
      lat: { type: Number, required: false },  // latitude
      lng: { type: Number, required: false }   // longitude
    },
    role: {
      type: String, 
        default: "User",
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);
export default User;
