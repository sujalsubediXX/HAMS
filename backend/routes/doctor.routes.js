import express from "express"
import { appointDoctor,getDoctorInfo,loginDoctor ,doctorSpeciality,getdoctordataQuery,doctorById,UpdatePassword,DoctordeleteAccount,doctorimageUpload} from "../controller/doctor.controller.js";
import { Upload } from "../upload.js";
const router = express.Router();

router.post("/appointdoctor", appointDoctor);
router.post("/login", loginDoctor);
router.get("/doctordata", getDoctorInfo);
router.get("/doctordataquery", getdoctordataQuery);
router.get('/by-query', doctorSpeciality);
router.get('/doctor_id', doctorById);
router.put("/updatepassword",UpdatePassword)
router.delete("/deleteaccount",DoctordeleteAccount)
router.post("/insertdoctorimage",Upload.single("image"), doctorimageUpload);

export default router;
