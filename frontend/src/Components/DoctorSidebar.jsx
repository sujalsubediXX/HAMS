import {
  FaUserMd,
  FaCalendarAlt,
  FaUsers,
  FaCog,
  FaSignOutAlt,
  FaBars,
} from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { Link } from "react-router-dom";

const DoctorSidebar = () => {
  return (
    <>
      <div
        className="h-screen w-[16vw] md:w-[236px]  sm:w-[26vw] flex flex-col shadow-xl "
      >
        <div className="px-5 py-7 flex justify-start items-center gap-2 border-b border-gray-700 ">
          <MdDashboard className="text-4xl text-blue-500" />
          <span className="hidden sm:block">DashBoard</span>
        </div>

        <nav className="flex-1  space-y-2 p-4">
          <Link
            to="/doctor/profile"
            className="flex items-center space-x-3 p-2  rounded-md hover:bg-gray-200 justify-center sm:justify-start"
          >
            <FaUserMd />
            <p className="hidden sm:block">Profile</p>
          </Link>
          <Link
            to="/doctor/appointments"
            className="flex items-center space-x-3 p-2 rounded-md  hover:bg-gray-200 justify-center sm:justify-start"
          >
            <FaCalendarAlt />
            <p className="hidden sm:block">Appointments</p>
          </Link>
          <Link
            to="/doctor/patients"
            className="flex items-center space-x-3 p-2 rounded-md  hover:bg-gray-200 justify-center sm:justify-start"
          >
            <FaUsers /> <p className="hidden sm:block">Patients</p>
          </Link>
          <Link
            to="/doctor/settings"
            className="flex items-center space-x-3 p-2 rounded-md  hover:bg-gray-200 justify-center sm:justify-start"
          >
            <FaCog />
            <p className="hidden sm:block">Settings</p>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <button className="flex items-center space-x-2 p-2 w-full text-red-400 hover:text-white hover:bg-red-600 rounded-md cursor-pointer">
            <FaSignOutAlt />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default DoctorSidebar;
