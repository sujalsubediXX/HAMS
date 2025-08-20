import { FaUserMd, FaCalendarAlt, FaCog, FaSignOutAlt,FaStethoscope, FaRegUser  } from "react-icons/fa"; 
import { MdOutlineDoorBack } from "react-icons/md";
import { IoLocation } from "react-icons/io5";
import admindashboard2 from "/admindashboard2.jpg";

import { MdDashboard } from "react-icons/md";
import toast from "react-hot-toast";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../Utils/AuthProvider";
const AdminSidebar = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handlelogout = () => {
    logout();
    toast.success("Logout Success");
    navigate("/");
  };
  return (
    <section className="h-screen w-[16vw] md:w-[14vw] sm:w-[26vw] flex flex-col shadow-xl shadow-blue-400 z-20 ">
      <Link
        to="/admin/admindashboard"
        className="w-full border-b border-gray-700 cursor-pointer  "
      >
        <img src={admindashboard2}  className="w-38 mx-auto my-3" />
      </Link>

      <nav className="flex-1  space-y-2 p-4">
        <NavLink
          to="admindashboard"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
              isActive ? "bg-gray-200" : ""
            }`
          }
        >
          <MdDashboard className=" text-blue-500" />
          <p className="hidden sm:block">Dashboard</p>
        </NavLink>
        <NavLink
          to="/admin/managedoctor"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
              isActive ? "bg-gray-200" : ""
            }`
          }
        >
          <FaUserMd />
          <p className="hidden sm:block">Doctors</p>
        </NavLink>
        <NavLink
          to="managepatients"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
              isActive ? "bg-gray-200" : ""
            }`
          }
        >
         <FaRegUser />
          <p className="hidden sm:block">Patients</p>
        </NavLink>
        <NavLink
          to="managedspecialty"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
              isActive ? "bg-gray-200" : ""
            }`
          }
        >
          <FaStethoscope />
          <p className="hidden sm:block">Specialty</p>
        </NavLink>
        <NavLink
          to="totalappointment"
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
          to="branchlocation"
          className={({ isActive }) =>
            `flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start ${
              isActive ? "bg-gray-200" : ""
            }`
          }
        >
          <IoLocation className="" />
          <p className="hidden sm:block">AffiliatedLocation</p>
        </NavLink>

       
      </nav>
      <div className=""></div>

      <div className="p-4 border-t border-gray-700">
        <button
          className="flex items-center space-x-2 p-2 w-full text-red-400 hover:text-white hover:bg-red-600 rounded-md cursor-pointer"
          onClick={handlelogout}
        >
          <FaSignOutAlt />
          <span className="hidden sm:block">Logout</span>
        </button>
        <Link
          to="/"
          className="flex items-center space-x-2 p-2 w-full text-green-400 hover:text-white hover:bg-green-400 rounded-md cursor-pointer"
        >
          <span>
            <MdOutlineDoorBack />
          </span>
          <span className="hidden sm:block">GoBack</span>
        </Link>
      </div>
    </section>
  );
};

export default AdminSidebar;
