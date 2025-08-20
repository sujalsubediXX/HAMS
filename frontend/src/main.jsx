
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
// UserPanel
import Userlayout from "./layouts/Userlayout.jsx";
import Home from "./pages/patient/Home.jsx";
import PatientSetting from "./pages/patient/PatientSetting.jsx";
import PatientLocation from "./pages/patient/PatientLocation.jsx";
// AdminPanel
import Adminlayout from "./layouts/Adminlayout.jsx";
import AddDoctor from "./pages/admin/AddDocotor.jsx";
import ManageDoctors from "./pages/admin/ManageDoctors.jsx";
import ManagePatients from "./pages/admin/ManagePatients.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminSetting from "./pages/admin/AdminSetting.jsx";
import BranchLocation from "./pages/admin/BranchLocation.jsx";
import { AuthProvider } from "./Utils/AuthProvider.jsx";

import ProtectedRoutes from "./Utils/ProtectedRoutes.jsx";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import PatientProfile from "./pages/patient/PatientProfile.jsx";
import Doctorlayout from "./layouts/Doctorlayout.jsx";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";
import Appointments from "./pages/doctor/Appointments.jsx";
import Patients from "./pages/doctor/Patients.jsx";
import Settings from "./pages/doctor/Settings.jsx";
import About from "./pages/patient/About.jsx";
import Service from "./pages/patient/Service.jsx";
import TotalAppointments  from "./pages/admin/TotalAppointments.jsx";
import ManageSpecialty from "./pages/admin/ManageSpecialty.jsx";
import AdminLogin from "./pages/AdminLogin.jsx";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Userlayout />,
        children: [
          { path: "", element: <Home /> },
          { path: "/about", element: <About /> },
          { path: "/service", element: <Service /> },
       
          {
            path: "profile",
            element: (
              <>
                <ProtectedRoutes role="User">
                  <PatientProfile />
                </ProtectedRoutes>
              </>
            ),
          },
          {
            path: "/patientsetting",
            element: (
              <>
                <ProtectedRoutes role="User">
                  <PatientSetting />
                </ProtectedRoutes>
              </>
            ),
          },
          {
            path: "/patientlocation",
            element: (
              <>
                <ProtectedRoutes role="User">
                  <PatientLocation />
                </ProtectedRoutes>
              </>
            ),
          },
        ],
      },
      {
        path: "/doctor",
        element: (
          <>
            <ProtectedRoutes role="Doctor">
              <Doctorlayout />
            </ProtectedRoutes>
          </>
        ),
        children: [
          {
            path: "profile",
            element: <DoctorProfile />,
          },
          {
            path: "appointments",
            element: <Appointments />,
          },
          {
            path: "patients",
            element: <Patients />,
          },
          {
            path: "settings",
            element: <Settings />,
          },
        ],
      },
      {
        path: "/admin",
        element: (
          <>
            {/* <ProtectedRoutes role="Admin"> */}
            <Adminlayout />

            {/* </ProtectedRoutes> */}
          </>
        ),

        children: [
          {
            path: "admindashboard",
            element: <AdminDashboard />,
          },
          {
            path: "managedoctor",
            element: <ManageDoctors />,
          },
          {
            path: "managedspecialty",
            element: <ManageSpecialty />,
          },
          {
            path: "totalappointment",
            element: <TotalAppointments />,
          },
          {
            path: "branchlocation",
            element: <BranchLocation />,
          },
          {
            path: "managepatients",
            element: <ManagePatients />,
          },
          {
            path: "adminsetting",
            element: <AdminSetting />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path:"/hams-admin",
        element:<AdminLogin />
      },

      {
        path: "/register",
        element: <Register />,
      },

      {
        path: "/bookappointment",
        element: (
          <>
            <ProtectedRoutes role="User">
              <BookAppointment />
            </ProtectedRoutes>
          </>
        ),
      },
      {
        path: "/adddoctor",
        element: (
          <>
          <ProtectedRoutes role="Admin">

            <AddDoctor />
          </ProtectedRoutes>
          </>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
);
