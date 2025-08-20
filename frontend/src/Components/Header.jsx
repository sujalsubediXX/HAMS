import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";
import { useAuth } from "../Utils/AuthProvider";
import toast from "react-hot-toast";
import logo1 from "/logo1.jpg";
import patientimage from "/patientimage.png";
import ConfirmAlert from "./ConfirmAlert";


const Header = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(true);
  const [showModel, setShowModal] = useState(false);
  const [showProfile, setShowprofile] = useState(false);
  const [userdata, setuserdata] = useState({});
  const lastScroll = useRef(0);
  const navigate = useNavigate();
  const { user, logout,userData } = useAuth();

  const userRole = user?.role;
  useEffect(() => {
    if (user?.role) {
      setuserdata(userData)
    } else {
      setuserdata({}); 
    }
  }, [user,userData]);
 

  const outsidediv = useRef(null);
  const profileDivRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = showModel ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showModel]);

  useEffect(() => {
    const handleScroll = () => {
      setShowprofile(false);
      const currentScroll = window.scrollY;
      if (currentScroll > lastScroll.current && currentScroll > 100) {
        setVisible(false);
        setShowMenu(false);
      } else {
        setVisible(true);
      }
      lastScroll.current = currentScroll;
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logout Success");
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        showProfile &&
        outsidediv.current &&
        !outsidediv.current.contains(event.target) &&
        profileDivRef.current &&
        !profileDivRef.current.contains(event.target)
      ) {
        setShowprofile(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showProfile]);

  return (
    <>
      <header
        className={`fixed top-0 w-[93vw] sm:w-[94vw] md:w-[95vw] lg:w-[98vw] h-[12vh] rounded-xl mt-2 border-t-2 border-blue-300 flex justify-between items-center px-6 mx-3 shadow-blue-500 shadow-lg z-50 bg-white transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo */}
        <div className="cursor-pointer">
          <Link to="/">
            <img src={logo1} alt="Logo" className="h-[10vh]" />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-2 text-lg font-medium">
          <Link to="/" className="hover:bg-gray-100 p-3 rounded-2xl">
            🏠 Home
          </Link>
          <Link to="/about" className="hover:bg-gray-100 p-3 rounded-2xl">
            ℹ️ About
          </Link>
          <Link to="/service" className="hover:bg-gray-100 p-3 rounded-2xl">
            🩺 Services
          </Link>
        </nav>

        {/* Right Section */}
        <div className="flex md:flex items-center gap-4">
          {userRole === "User" && (
            <>
            
              <div
                ref={profileDivRef}
                className="rounded-full overflow-hidden cursor-pointer w-14 h-14"
                onClick={() => setShowprofile((prev) => !prev)}
              >
                <img
                  src={userdata.image ? userdata.image : patientimage}
                  alt="Patient"
                  className="w-full h-full object-cover"
                />
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="py-2 px-4 bg-red-500 text-white cursor-pointer rounded-xl hover:bg-red-600 hidden md:block"
              >
                Logout
              </button>
            </>
          )}

          {userRole === "Doctor" && (
            <Link
              to="/doctor/profile"
              className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
            >
              Dashboard
            </Link>
          )}

          {userRole === "Admin" && (
            <Link
              to="/admin/managedoctor"
              className="px-3 py-2 rounded bg-blue-500 hover:bg-blue-600 cursor-pointer text-white"
            >
              Dashboard
            </Link>
          )}

          {showProfile && (
            <div
              className={`absolute rounded-lg bg-white shadow-2xl top-20 right-16 z-20 transition-all duration-300 ease-in-out transform origin-top ${
                showProfile ? "scale-y-100 opacity-100" : "scale-y-0 opacity-0"
              }`}
              ref={outsidediv}
            >
              <ul className="overflow-hidden flex flex-col justify-center items-center w-[26vw] lg:w-[12vw]">
                <li className="hover:bg-gray-100 px-2 py-[6px] w-full md:px-3 md:py-2 text-[18px] md:text-md cursor-pointer">
                  <Link to="profile"   onClick={() => setShowprofile((prev) => !prev)}>Profile</Link>
                </li>
                <hr />
                <li className="hover:bg-gray-100 px-2 py-[6px] w-full md:px-3 md:py-2 text-[18px] md:text-md cursor-pointer">
                  <Link to="patientsetting"   onClick={() => setShowprofile((prev) => !prev)}>Setting</Link>
                </li>
                <li className="hover:bg-gray-100 px-2 py-[6px] w-full md:px-3 md:py-2 text-[18px] md:text-md cursor-pointer">
                  <Link to="patientlocation"   onClick={() => setShowprofile((prev) => !prev)}>YourLocation</Link>
                </li>
                {/* <li className="hover:bg-gray-100 px-2 py-[6px] w-full md:px-3 md:py-2 text-[18px] md:text-md cursor-pointer">
                  <Link to="tictactoe"   onClick={() => setShowprofile((prev) => !prev)}>TicTacToe</Link>
                </li> */}
                <hr />
          
              </ul>
            </div>
          )}

          {!user && (
            <Link
              to="/login"
              className="py-2 px-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
            >
              Login
            </Link>
          )}

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center gap-2">
            <button onClick={() => setShowMenu(!showMenu)}>
              {showMenu ? (
                <HiX className="text-3xl text-blue-700" />
              ) : (
                <HiMenu className="text-3xl text-blue-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="absolute top-[12vh] left-0 w-full bg-white shadow-md border-t rounded-b-xl md:hidden flex flex-col items-center py-4 space-y-1 z-40">
            <Link to="/" onClick={() => setShowMenu(false)} className="hover:bg-gray-100 p-3 px-6 rounded-2xl">
            🏠 Home
            </Link>
            <Link to="about" onClick={() => setShowMenu(false)} className="hover:bg-gray-100 p-3 px-6 rounded-2xl">
            ℹ️ About
            </Link>
            <Link to="service" onClick={() => setShowMenu(false)} className="hover:bg-gray-100 p-3 px-6 rounded-2xl">
            🩺 Services
            </Link>

            {userRole && (
              <button
                onClick={() => setShowModal(true)}
                className="py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600"
              >
                Logout
              </button>
            )}

          </div>
        )}
      </header>

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
    </>
  );
};

export default Header;
