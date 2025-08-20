import Admin from "../modules/admin.module.js";
import bcrypt from "bcryptjs";


export const adminLogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and Password are required." });
        }

        const adminUser = await Admin.findOne({ email });

        if (!adminUser) {
            return res.status(404).json({ message: "No admin found with this email." });
        }

        const isMatch = await bcrypt.compare(password, adminUser.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Wrong Credentials." });
        }

        return res.status(200).json({ message: "Admin login success." });

    } catch (error) {
        console.log("Admin login error:", error);
        return res.status(500).json({ message: "Admin login Error" });
    }
};

export const adminRegister=async(req,res)=>{
    try {
        const {fullname,email,password}=req.body;
        if(!fullname || !email || !password){
            return res.status(500).json({message:"All fields are required."});
        }
        const adminuser=await Admin.findOne({email});
        if(adminuser){
           return res.status(409).json({message:"This email is already in Use.Try another one."});
        }
        const salt=await bcrypt.genSalt(10);
        const hashpassword=await bcrypt.hash(password,salt);
        const createadmin=await Admin.create({
            fullname,email,password:hashpassword
        })
        if(createadmin){
           return res.status(200).json({message:"Admin Created."});

       }
    } catch (error) {
       console.log("Admin login error") ;
       return res.status(500).json({message:"Admin login Error"});
    }
}