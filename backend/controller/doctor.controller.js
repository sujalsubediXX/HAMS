import bcrypt from "bcryptjs";
import Doctor from "../modules/doctor.module.js";

import sendDoctorWelcomeEmail from "../utils/sendDoctorWelcomeEmail.js";

// Helper function to create hourly slots
const generateTimeSlots = (start, end) => {
  const slots = [];
  const [startHour, startMinute] = start.split(":").map(Number);
  const [endHour, endMinute] = end.split(":").map(Number);

  let current = new Date(1970, 0, 1, startHour, startMinute);
  const endTime = new Date(1970, 0, 1, endHour, endMinute);

  while (current < endTime) {
    const next = new Date(current.getTime() + 30 * 60 * 1000);

    if (next <= endTime) {
      const from = current.toTimeString().slice(0, 5);
      const to = next.toTimeString().slice(0, 5);

      slots.push({ start: from, end: to, isBooked: false });
    }

    current = next;
  }

  return slots;
};

export const appointDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      gender,
      age,
      specialization,
      experience,
      qualification,
      license,
      availableDays,
      slots,
      address,
      bio,
      location,
    } = req.body;
    

    const existingDoctor = await Doctor.findOne({ email });
    if (existingDoctor) {
      return res.status(409).json({ message: "Email already in use." });
    }
    
    // Generate random password
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars[Math.floor(Math.random() * chars.length)];
    }

    const salt = await bcrypt.genSalt(10);
    // const hashedPassword = await bcrypt.hash(password, salt);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate timeSlots
    const generatedTimeSlots = generateTimeSlots(slots[0].start, slots[0].end);
    console.log(password);
    const newDoctor = new Doctor({
      name,
      email,
      password: hashedPassword,
      phone,
      gender,
      age,
      specialization,
      experience,
      qualification,
      license,
      availableDays,
      availabletime: slots,
      address,
      bio,
      location,
      timeSlots: generatedTimeSlots, // ⬅️ Add to schema too!
    });

    await newDoctor.save();
    sendDoctorWelcomeEmail(email, name, password);
    console.log(password)
   
    res.status(200).json({ message: "Doctor created successfully", password });
  } catch (error) {
    console.error("Error creating doctor:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getDoctorInfo = async (req, res) => {
  try {
    let doctorinfo = [];
    if (req.query.email) {
      doctorinfo = await Doctor.findOne({ email: req.query.email });
    } else if (req.query.specialty) {
      doctorinfo = await Doctor.find({ specialization: { $in: [req.query.specialty] } });
    } else if (req.query.id) {
      doctorinfo = await Doctor.find({ _id: req.query.id });
    } else {
      doctorinfo = await Doctor.find();
    }
  
      return res
        .status(200)
        .json({ message: "Doctor data accessed.", data: doctorinfo });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "doctor data fetching error" });
  }
};

export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctorinfo = await Doctor.findOne({ email });

    if (!doctorinfo) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (!doctorinfo.isActive) {
      return res.status(403).json({
        message: "Your account is deactivated. Please contact admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, doctorinfo.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Optional: you can generate a JWT token here if needed

    return res.status(200).json({
      message: "Login success for doctor",
      doctor: {
        name: doctorinfo.name,
        email: doctorinfo.email,
        role: "Doctor",
      },
    });
  } catch (error) {
    console.error("Error in doctor login:", error);
    return res
      .status(500)
      .json({ message: "Internal Server Error in doctor login" });
  }
};


// export const UpdatePassword=async(req,res)=>{
//   try {
//     const {email,pass}=req.body;

//         const salt=await bcrypt.genSalt(10);
//         const hashpassword=await bcrypt.hash(pass,salt);
//          const update=await Doctor.updateOne({
//           email
//          },
//         {
//           password:hashpassword
//         });
//         if(update){
//           return res.status(200).json({message:"Password update Successfully"});
//         }

//   } catch (error) {
//     return res.status(402).json({message:"Error occured in update password",error});
//   }
//  }

export const UpdatePassword = async (req, res) => {
  try {
    const { email, pass, cpass } = req.body;
    const existUser = await Doctor.findOne({ email });
    if (existUser) {
      const matchpassword = await bcrypt.compare(pass, existUser.password);
      if (matchpassword) {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(cpass, salt);
        const update = await Doctor.updateOne(
          {
            email,
          },
          {
            password: hashpassword,
          }
        );
        if (update) {
          return res
            .status(200)
            .json({ message: "Password update Successfully" });
        }
      } else {
        return res
          .status(400)
          .json({ message: "The password you have provided is invalid" });
      }
    }
  } catch (error) {
    return res
      .status(402)
      .json({ message: "Error occured in update password", error });
  }
};

export const DoctordeleteAccount = async (req, res) => {
  try {
    const body = req.body || {};
    const { email, id } = body;


    if (!email && !id) {
      return res.status(400).json("Either email or ID must be provided.");
    }

    const filter = email ? { email } : { _id: id };
    const result = await Doctor.updateOne(filter, { isActive: false });

    if (result.modifiedCount === 1) {
      return res.status(201).json("Doctor deleted");
    } else {
      return res.status(400).json("Account deletion failed");
    }
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return res.status(500).json("Account deletion failed in catch block");
  }
};

export const doctorimageUpload = async (req, res) => {
  try {
    const { email } = req.body;
    const imagefile = req.file;

    if (!email || !imagefile) {
      return res.status(400).json({ message: "Email and Image are required." });
    }

    const imageUrl = `/` + imagefile.filename;

    const updated = await Doctor.updateOne(
      { email },
      { $set: { profileImage: imageUrl } }
    );

    if (updated.modifiedCount > 0) {
      res
        .status(201)
        .json({ message: "Image uploaded successfully", imageUrl });
    } else {
      res.status(400).json({ message: "User not found or image not updated" });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
