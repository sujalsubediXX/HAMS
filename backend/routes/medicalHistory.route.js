import express from "express";
import {insertMedicalData,UpatemedicalHistory,getMedicalhistory} from "../controller/medicalHistory.controller.js"
const router=express.Router();
router.post("/insertmedicaldata",insertMedicalData);
router.put("/updateMedicalData",UpatemedicalHistory);
router.get("/getMedicalHistory",getMedicalhistory);

export default router