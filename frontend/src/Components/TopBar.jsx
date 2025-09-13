import React, { useState, useRef } from "react";
import { FaUsers, FaClipboardList, FaCog, FaInfoCircle } from "react-icons/fa";
import { useAuth } from "../Utils/AuthProvider";
import axios from "axios";
import { useLocation } from "react-router-dom";
import doctorimg from "/doctoriamge.png";
import { toast } from "react-hot-toast"; 

const TopBar = () => {
  const { userData} = useAuth();

  const [previewImg, setPreviewImg] = useState(null);
  const fileInputRef = useRef(null);
  
  const location = useLocation();
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreviewImg(URL.createObjectURL(file));

      const imagedata = new FormData();
      imagedata.append("image", file);
      imagedata.append("email", userData.email);

      try {
        const res = await axios.post("https://hams-7zpe.onrender.com/api/doctor/insertdoctorimage", imagedata, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (res.status === 201) {
          toast.success("Image inserted successfully.");
     
        } else {
          toast.error("Image not inserted.");
        }
      } catch (error) {
        toast.error("Error from the server");
        console.error(error);
      }
    } else {
      toast.error("Select an image first.");
    }
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="h-[12vh] bg-black  text-white px-6 py-3 flex items-center justify-between w-full">
      <div className="flex items-center space-x-4">
        {location.pathname === "/doctor/profile" && (
          <>
            <FaInfoCircle className="text-3xl" />
            <h1 className="text-2xl font-bold">Your Details</h1>
          </>
        )}
        {location.pathname === "/doctor/appointments" && (
          <>
            <FaClipboardList className="text-3xl" />
            <h1 className="text-2xl font-bold">Appointments</h1>
          </>
        )}
        {location.pathname === "/doctor/patients" && (
          <>
            <FaUsers className="text-3xl" />
            <h1 className="text-2xl font-bold">Patients</h1>
          </>
        )}
        {location.pathname === "/doctor/settings" && (
          <>
            <FaCog className="text-3xl" />
            <h1 className="text-2xl font-bold">Settings</h1>
          </>
        )}
      </div>

      <div
        className="relative flex justify-center items-center rounded-2xl px-3 py-1 space-x-3 border-white border-2 cursor-pointer group"
        onClick={handleImageClick}
      >
        <label className="select-none">Dr {userData.name || "Loading..."}</label>
        <img
          src={previewImg || userData.profileImage || doctorimg}
          alt="Doctor"
          className="w-12 h-12 rounded-full object-cover"
        />

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Overlay text shown on hover */}
        <div className="absolute inset-0 bg-black bg-opacity-50 text-white flex justify-center items-center opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300 pointer-events-none">
          Change image
        </div>
      </div>
    </div>
  );
};

export default TopBar;
