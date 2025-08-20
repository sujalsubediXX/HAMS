import {getAllSpecialties,addSpecialty,updateSpecialty,deleteSpecialty} from "../controller/specialty.controller.js";
import express from "express";

const router = express.Router();
router.get("/getAllSpecialties", getAllSpecialties);
router.post("/addSpecialty", addSpecialty);  
router.put("/updateSpecialty/:id", updateSpecialty);
router.delete("/deleteSpecialty/:id", deleteSpecialty);

export default router;