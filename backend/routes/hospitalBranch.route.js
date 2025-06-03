import express from "express";
import { addHospitalBranch } from "../controller/hospitalBranch.controller.js";
const router = express.Router();

router.post("/addHospitalbranch", addHospitalBranch);

export default router;
