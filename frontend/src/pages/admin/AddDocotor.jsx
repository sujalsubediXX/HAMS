import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../../Utils/AuthProvider.jsx";
// const specializations = [
//   "Cardiologist",
//   "Pulmonologist",
//   "Dermatologist",
//   "General Physician",
//   "Neurologist",
//   "Pediatrician",
//   "Psychiatrist",
//   "ENT Specialist",
//   "Radiologist",
//   "Gastroenterologist",
//   "Orthopedic",
//   "Ophthalmologist",
//   "Gynecologist",
//   "Endocrinologist",
// ];

const daysOfWeek = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const AddDoctor = () => {
  const {specialties} = useAuth();
  const specializations = specialties.map((spec) => spec.name);
  const navigate = useNavigate();
  const [locations, setlocations] = useState([]);
  useEffect(() => {
    const fetchlocation = async () => {
      try {
        const res = await axios.get("/api/hospital/location");
        if (res.status == 201) {
          setlocations(res.data.location);
        } else {
          toast.error("failed to fetch branch location.");
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 503) {
            toast.error("Email is already in use. Please try a different one.");
          }
        }else {
          console.log(error);
        }
      
      }
    };
    fetchlocation();
  }, []);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      slots: { start: "", end: "" },
      availableDays: [],
      specialization: [],
      branch: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Handle specialization and availableDays in array form if single
      data.availableDays = Array.isArray(data.availableDays)
        ? data.availableDays
        : data.availableDays
        ? [data.availableDays]
        : [];
      data.specialization = Array.isArray(data.specialization)
        ? data.specialization
        : data.specialization
        ? [data.specialization]
        : [];

      // Convert slots object to array with one object
      data.slots = [{ start: data.slots.start, end: data.slots.end }];

      // Validate end time is after start time
      const startTime = new Date(`1970-01-01T${data.slots[0].start}:00`);
      const endTime = new Date(`1970-01-01T${data.slots[0].end}:00`);
      if (endTime <= startTime) {
        toast.error("End time must be after start time");
        setLoading(false);
        return;
      }

      // Find the selected branch object for lat/lng
      const selectedBranch = locations.find(
        (branch) => branch.name === data.branch
      );
      console.log(selectedBranch);

      if (!selectedBranch) {
        toast.error("Please select a valid branch/location");
        setLoading(false);
        return;
      }

      // Add lat/lng to data
      data.location = {
        lat: selectedBranch.location.lat,
        lng: selectedBranch.location.lng,
      };
      data.address = selectedBranch.name;

      const response = await axios.post("/api/doctor/appointdoctor", data);
      console.log(data);

      if (response.status === 200) {
        toast.success("Doctor account created successfully!");

        navigate("/admin/managedoctor");
      } else {
        toast.error("Account creation failed.");
        setLoading(false);
        return;
      }
      reset();
    } catch (error) {
      toast.error("Failed to add doctor!");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[100vw] min-h-screen bg-gray-100 flex justify-between items-center">
      <div className="w-[58vw] mx-auto px-6 py-3 bg-white shadow-2xl shadow-blue-700 rounded-xl text-[16px] h-[96vh]">
        <h2 className="text-xl font-bold mb-5 mt-2 text-center">
          Add New Doctor
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <input
                {...register("name", { required: "Full name is required" })}
                placeholder="Full Name"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.name && (
                <span className="text-sm text-red-400">
                  {errors.name.message}
                </span>
              )}
            </div>
            <div>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                placeholder="Email"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.email && (
                <span className="text-sm text-red-400">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div>
              <input
                {...register("phone", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^(97|98)\d{8}$/,
                    message:
                      "Phone number must start with 97 or 98 and be 10 digits",
                  },
                })}
                placeholder="Phone"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.phone && (
                <span className="text-sm text-red-400">
                  {errors.phone.message}
                </span>
              )}
            </div>
            <div>
              <input
                {...register("age", {
                  required: "Age is required",
                  min: { value: 18, message: "Age must be at least 18" },
                })}
                placeholder="Age"
                type="number"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.age && (
                <span className="text-sm text-red-400">
                  {errors.age.message}
                </span>
              )}
            </div>
            <div>
              <select
                {...register("gender", { required: "Gender is required" })}
                className="border-[1px] border-gray-600 px-2 py-[6px] rounded-lg w-full"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && (
                <span className="text-sm text-red-400">
                  {errors.gender.message}
                </span>
              )}
            </div>
            <div>
              <input
                {...register("qualification", {
                  required: "Qualification is required",
                })}
                placeholder="Qualification"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.qualification && (
                <span className="text-sm text-red-400">
                  {errors.qualification.message}
                </span>
              )}
            </div>
          </div>

          {/* Branch Selection */}
          <label className="block font-semibold mt-4">Branch / Location</label>
          <select
            {...register("branch", {
              required: "Please select a branch/location",
            })}
            className="border-[1px] border-gray-600 px-2 py-[6px] rounded-lg w-full"
          >
            <option value="">Select Branch / Location</option>
            {locations.map((branch) => (
              <option key={branch.name} value={branch.name}>
                {branch.name}
              </option>
            ))}
          </select>
          {errors.branch && (
            <span className="text-sm text-red-400">
              {errors.branch.message}
            </span>
          )}

          {/* Specialization (multi-select) */}
          <label className="block  mt-4">Specialization</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {specializations.map((spec) => (
              <label key={spec} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={spec}
                  {...register("specialization", {
                    required: "At least one specialization is required",
                  })}
                  className="bg-white text-black"
                />
                {spec}
              </label>
            ))}
          </div>
          {errors.specialization && (
            <span className="text-sm text-red-400">
              {errors.specialization.message}
            </span>
          )}

          {/* Experience & License */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                {...register("experience", {
                  required: "Experience is required",
                  min: { value: 0, message: "Experience cannot be negative" },
                })}
                placeholder="Experience (years)"
                type="number"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.experience && (
                <span className="text-sm text-red-400">
                  {errors.experience.message}
                </span>
              )}
            </div>
            <div>
              <input
                {...register("license", {
                  required: "License number is required",
                })}
                placeholder="License Number"
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              {errors.license && (
                <span className="text-sm text-red-400">
                  {errors.license.message}
                </span>
              )}
            </div>
          </div>

          {/* Available Days (multi-select) */}
          <label className="block font-semibold mt-4">Available Days</label>
          <div className="grid grid-cols-3 md:grid-cols-7 gap-2">
            {daysOfWeek.map((day) => (
              <label key={day} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={day}
                  {...register("availableDays", {
                    required: "Please select at least one available day",
                  })}
                  className="bg-white text-black"
                />
                {day}
              </label>
            ))}
          </div>
          {errors.availableDays && (
            <span className="text-sm text-red-400">
              {errors.availableDays.message}
            </span>
          )}

          {/* Available Slot */}
          <div className=" flex gap-5  items-center">
            <label className="block font-semibold mt-4">
              Available Slot :{" "}
            </label>
            <div className="flex gap-2 items-center">
              <input
                type="time"
                {...register("slots.start", {
                  required: "Start time is required",
                })}
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
              <span className="text-xl font-bold">to</span>
              <input
                type="time"
                {...register("slots.end", {
                  required: "End time is required",
                })}
                className="border-[1px] border-gray-600 px-2 py-1 rounded-lg w-full"
              />
            </div>
          </div>

          {(errors.slots?.start || errors.slots?.end) && (
            <span className="text-sm text-red-400">
              {errors.slots?.start?.message || errors.slots?.end?.message}
            </span>
          )}

          {/* Submit Button */}
          <div className=" flex justify-between items-center mt-5">
            <Link
              to="/admin/managedoctor"
              className=" bg-red-500 text-white rounded-lg px-4 py-2  hover:bg-red-700"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white rounded-lg px-4 py-2  hover:bg-green-700"
            >
              {loading ? "Adding Doctor..." : "Add Doctor"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDoctor;
