import { Outlet } from "react-router-dom";
import Footer from "./Components/Footer.jsx";
import Header from "./Components/Header.jsx";
const UserLayout = () => {
  return (
    <div className="w-full">
    <Header  />
      <Outlet  /> 
    <Footer/>
    
    </div>
  );
};

export default UserLayout;
