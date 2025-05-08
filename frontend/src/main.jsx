import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import { Toaster } from "react-hot-toast";

// UserPanel
import Userlayout from "./Userlayout.jsx";
import Home from "./pages/patient/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// AdminPanel
import Adminlayout from "./Adminlayout.jsx";
import Dashboard from "./pages/doctor/DoctorDashboard.jsx";
import { AuthProvider } from "./Utils/AuthProvider.jsx";

import ProtectedRoutes from "./Utils/ProtectedRoutes.jsx";
import BookAppointment from "./pages/patient/BookAppointment.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import PatientProfile from "./pages/patient/PatientProfile.jsx";
import Doctorlayout from "./Doctorlayout.jsx";
import DoctorProfile from "./pages/doctor/DoctorProfile.jsx";
import Appointments from "./pages/doctor/Appointments.jsx";
import Patients from "./pages/doctor/Patients.jsx";
import Settings from "./pages/doctor/Settings.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Userlayout />,
        children: [
          { path: "",
            element: <Home />
          },
          {
            path: "profile",
            element: <PatientProfile />,
          },
        ],
      },
      {
        path: "/doctor",
        element: <Doctorlayout />,
        children: [
          {
            path: "profile",
            element:<DoctorProfile />,
          },
          {
            path: "appointments",
            element:<Appointments />,
          },
          {
            path: "patients",
            element:<Patients />,
          },
          {
            path: "settings",
            element:<Settings />,
          },
          
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/bookappointment",
        element: <BookAppointment />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <Toaster />
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
