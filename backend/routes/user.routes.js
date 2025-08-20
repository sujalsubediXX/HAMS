import express from "express";
import { loginuser, registeruser ,userdata,UserImage,UpdatePassword,deleteAccount,getGenderStats,getAgeStats,ChangeLocation,getUserLocation,updateProfile} from "../controller/user.controller.js";
const router = express.Router();
import { Upload } from "../utils/upload.js";
router.post("/login", loginuser);
router.post("/register", registeruser);
router.get("/userdata",userdata);

router.post("/insertimage",Upload.single("image"),UserImage);
router.put("/updatepassword",UpdatePassword);
router.delete("/deleteaccount",deleteAccount);
router.get('/gender-stats', getGenderStats);
router.get('/getAgeStats', getAgeStats);
router.put('/changelocation', ChangeLocation);
router.get('/getuserlocation', getUserLocation);
router.put("/updateprofile",updateProfile)

export default router;
