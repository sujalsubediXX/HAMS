import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../Utils/AuthProvider.jsx";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import ConfirmAlert from "../../Components/ConfirmAlert.jsx";
import { useNavigate } from "react-router-dom";
export default function PatientSetting() {
  const { user ,logout} = useAuth();

  const [pass, setpass] = useState("");
  const [cpass, setcpass] = useState("");
  const [cpass2, setcpass2] = useState("");

  const [showPassword, setShowpassword] = useState(false);
  const [shownewPassword, setShownewpassword] = useState(false);
  const [showconfirmPassword, setShowconfirmpassword] = useState(false);

  const [showModel,setShowModal]=useState(false);
  const [showConformation,setshowConformation]=useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!pass || !cpass || !cpass2) {
      toast.error("Fill all the fields.");
    } else if (cpass !== cpass2) {
      toast.error("Passwords don't match.");
    } else if (cpass.length < 6) {
      toast.error("Password length should be more than 6 characters.");
    } else {
      try {
        const res = await axios.put(`/api/user/updatepassword`, {
          email: user.email,
          pass,
          cpass,
        });

        if (res.status === 200) {
          toast.success(res.data.message || "Password updated successfully!");
          setpass("");
          setcpass("");
          setcpass2("");
        }
      } catch (error) {
        const msg = error?.response?.data?.message || "Something went wrong!";
        toast.error(msg);
        console.error("Password update error:", error);
      }
    }
  };
  const navigate=useNavigate();
    const handleLogout = () => {
      logout();
      toast.success("Logout Success");
      navigate("/");
    };
  
    const handledelete = async () => {
      try {
        const res = await axios.delete("/api/user/deleteaccount", {
          data: { email: user.email }, // ✅ pass data here properly
        });
    
        if (res.status === 201) {
          toast.success("Your account was deleted Successfully.");
          logout();
          navigate("/");
          // Optionally log the user out and redirect
        } else {
          toast.error("Account not deleted.");
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        toast.error("Account not deleted.");
      }
    };
    
  return (
    <>
    <div className="max-w-4xl mx-auto py-[20vh] px-[14vw]">
      <h2 className="text-3xl font-bold mb-6">Settings</h2>

      <form
        className="bg-white shadow-md shadow-green-500 rounded-xl p-6 mb-6"
        onSubmit={handlePasswordChange}
      >
        <h3 className="text-xl font-semibold mb-4">Change Password</h3>

        <div className="flex flex-col gap-4">
          {/* Current Password */}
          <div className="border p-2 rounded-md flex justify-between items-center">
            <input
              name="currentPassword"
              value={pass}
              onChange={(e) => setpass(e.target.value)}
              type={showPassword ? "text" : "password"}
              placeholder="Current Password"
              className="border-none outline-none w-[90%]"
            />
            {showPassword ? (
              <FaEyeSlash
                className="cursor-pointer text-xl"
                onClick={() => setShowpassword((prev) => !prev)}
              />
            ) : (
              <FaEye
                className="cursor-pointer text-xl"
                onClick={() => setShowpassword((prev) => !prev)}
              />
            )}
          </div>

          {/* New Password */}
          <div className="border p-2 rounded-md flex justify-between items-center">
            <input
              name="newPassword"
              value={cpass}
              onChange={(e) => setcpass(e.target.value)}
              type={shownewPassword ? "text" : "password"}
              placeholder="New Password"
              className="border-none outline-none w-[90%]"
            />
            {shownewPassword ? (
              <FaEyeSlash
                className="cursor-pointer text-xl"
                onClick={() => setShownewpassword((prev) => !prev)}
              />
            ) : (
              <FaEye
                className="cursor-pointer text-xl"
                onClick={() => setShownewpassword((prev) => !prev)}
              />
            )}
          </div>

          {/* Confirm Password */}
          <div className="border p-2 rounded-md flex justify-between items-center">
            <input
              name="confirmPassword"
              value={cpass2}
              onChange={(e) => setcpass2(e.target.value)}
              type={showconfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              className="border-none outline-none w-[90%]"
            />
            {showconfirmPassword ? (
              <FaEyeSlash
                className="cursor-pointer text-xl"
                onClick={() => setShowconfirmpassword((prev) => !prev)}
              />
            ) : (
              <FaEye
                className="cursor-pointer text-xl"
                onClick={() => setShowconfirmpassword((prev) => !prev)}
              />
            )}
          </div>
        </div>

        <button
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded-xl cursor-pointer"
          type="submit"
        >
          Update Password
        </button>
      </form>

      {/* Account Actions */}
      <div className="flex justify-between">
        <button className="bg-red-500 text-white px-4 py-2 rounded-xl cursor-pointer" onClick={()=>setshowConformation(true)}>
          Delete Account
        </button>
        <button className="bg-gray-600 text-white px-4 py-2 rounded-xl cursor-pointer" onClick={()=>setShowModal(true)}>
          Logout
        </button>
      </div>
    </div>
      {/* Confirm Logout Modal */}
      {showModel && (
        <ConfirmAlert
          onConfirm={() => {
            handleLogout();
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
          message="Do you really want to logout ?"
              info="Logout"
        />
      )}
      {showConformation && (
        <ConfirmAlert
          onConfirm={() => {
            handledelete();
            setShowModal(false);
          }}
          onCancel={() => setshowConformation(false)}
           info="Delete"
          message="Do you really want to delete the account ?"
        />
      )}
    </>

  );
}
