import {
  FaUserMd,
  FaCalendarAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
} from "react-icons/fa";
import { MdOutlineDoorBack } from "react-icons/md";
import { MdDashboard } from "react-icons/md";
import { Link, NavLink, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAuth } from "../Utils/AuthProvider";
const DoctorSidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    toast.success("Logout Success");
    logout();
    navigate("/");
  };
  return (
    <>
      <div className="h-screen w-[16vw] md:w-[236px]  sm:w-[26vw] flex flex-col shadow-2xl shadow-blue-400 z-10">
        <Link
          to="profile"
          className="px-5 py-7 flex justify-start items-center gap-2 border-b border-gray-700 "
        >
          <MdDashboard className="text-4xl text-blue-500" />
          <span className="hidden sm:block">DashBoard</span>
        </Link>

        <nav className="flex-1  space-y-2 p-4">
          <NavLink
            to="profile"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
                isActive ? "bg-gray-200" : ""
              }`
            }
          >
            <FaUserMd />
            <p className="hidden sm:block">Profile</p>
          </NavLink>
          <NavLink
            to="appointments"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
                isActive ? "bg-gray-200" : ""
              }`
            }
          >
            <FaCalendarAlt />
            <p className="hidden sm:block">Appointments</p>
          </NavLink>
          <NavLink
            to="patients"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
                isActive ? "bg-gray-200" : ""
              }`
            }
          >
            <FaUsers /> <p className="hidden sm:block">Patients</p>
          </NavLink>
          <NavLink
            to="settings"
            className={({ isActive }) =>
              `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
                isActive ? "bg-gray-200" : ""
              }`
            }
          >
            <FaCog />
            <p className="hidden sm:block">Settings</p>
          </NavLink>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button
            className="flex items-center space-x-2 p-2 mb-2 w-full text-red-400 hover:text-white hover:bg-red-600 rounded-md cursor-pointer"
            onClick={handleLogout}
          >
            <FaSignOutAlt />
            <span className="hidden sm:block">Logout</span>
          </button>
          <NavLink
            to="/"
            className="flex items-center space-x-2 p-2 w-full text-green-400 hover:text-white hover:bg-green-400 rounded-md cursor-pointer"
          >
            {" "}
            <span>
              <MdOutlineDoorBack />
            </span>
            <span className="hidden sm:block">GoBack</span>
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
