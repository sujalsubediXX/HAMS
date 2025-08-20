import express from "express"
import { appointDoctor,getDoctorInfo,loginDoctor ,UpdatePassword,DoctordeleteAccount,doctorimageUpload} from "../controller/doctor.controller.js";
import { Upload } from "../utils/upload.js";
const router = express.Router();

router.post("/appointdoctor", appointDoctor);
router.post("/login", loginDoctor);
router.get("/doctordata", getDoctorInfo);

router.put("/updatepassword",UpdatePassword)
router.delete("/deleteaccount",DoctordeleteAccount)
router.post("/insertdoctorimage",Upload.single("image"), doctorimageUpload);

export default router;
