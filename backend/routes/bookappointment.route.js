import express from "express";
import {bookAppointment,getappointmentdata,patientByDoctorEmail,getAppointmentStats,getTopSpecialties,chartdayData,chartDoctorAppointments,CancelAppointment,getDoctorTimeSlots,rescheduleAppointment,matchDoctors} from "../controller/bookappointment.controller.js"

const route=express.Router();
route.post("/bookappointment",bookAppointment);
route.get("/getappointment",getappointmentdata);

route.get("/patients-by-doctor-email",patientByDoctorEmail);
route.get("/appointmentstats",getAppointmentStats);
route.get("/getTopSpecialties",getTopSpecialties);
route.get("/getchartdata",chartdayData);
route.get("/chartDoctorAppointments",chartDoctorAppointments);
route.put("/cancelappointment/:_id",CancelAppointment);
route.get("/getDoctorTimeSlots",getDoctorTimeSlots);
route.put("/reschedule",rescheduleAppointment);
route.post("/matchDoctors",matchDoctors);



export default route;