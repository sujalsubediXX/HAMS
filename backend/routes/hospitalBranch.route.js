import express from "express";
import { addHospitalBranch,hospitalBranchlocation} from "../controller/hospitalBranch.controller.js";
const router = express.Router();

router.post("/addHospitalbranch", addHospitalBranch);
router.get("/location", hospitalBranchlocation);

export default router;
