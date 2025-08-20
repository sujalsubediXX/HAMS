import React from "react";
import { Outlet } from "react-router-dom";
import DoctorSidebar from "../Components/DoctorSidebar";
import TopBar from "../Components/TopBar";
const Doctorlayout = () => {
  return (
    <div className="w-[100vw] flex overflow-x-hidden bg-gray-100">
      <DoctorSidebar className="w-[16vw]  sm:w-[20vw]" />
      <div className="w-[84vw] sm:w-[85vw] h-[100vh]">
        <TopBar className="h-[12vh]" />
        <Outlet className="w-[84vh] sm:w-[80vw] h-[88vh] overflow-x-hidden " />
      </div>
    </div>
  );
};

export default Doctorlayout;
