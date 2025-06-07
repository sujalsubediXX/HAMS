import express from "express";
import dotenv from "dotenv";
import dbconnect from "./utils/DBconnection.js";
import cors from "cors";
import Branch from "./modules/hospitalBranch.module.js";
import userRouter from "./routes/user.routes.js";
import doctorRouter from "./routes/doctor.routes.js";
import adminRouter from "./routes/admin.route.js";
import bookAppointment from "./routes/bookappointment.route.js";
import medicalHistory from "./routes/medicalHistory.route.js";
import hospitalBranch from "./routes/hospitalBranch.route.js";
import appointmentReminderJob from './utils/appointmentReminderJob.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const dblink = process.env.MONGODB_URL;

dbconnect(dblink).then(() => {
  appointmentReminderJob();
  app.use("/api/user", userRouter);
  app.use("/api/doctor", doctorRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/appointment", bookAppointment);
  app.use("/api/medicalhistory", medicalHistory);
  app.use("/api/hospital", hospitalBranch);
 
  app.listen(port, () => {
    console.log(`APP listening on port : ${port}`);
  });
});
