import User from "../modules/user.module.js";
import bcrypt from "bcryptjs";

// Register User
export const registeruser = async (req, res) => {
  try {
    const {
      age,
      email,
      firstName,
      gender,
      lastName,
      password,
      phonenumber,
      location,
    } = req.body;

    const ifexistuser = await User.findOne({ email });

    if (ifexistuser) {
      return res
        .status(409)
        .json({ message: "This email is already in use. Try another one." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const createuser = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      age,
      phone: phonenumber,
      gender,
      location,
    });

    if (createuser) {
      res.status(201).json({ message: "User Registered Successfully" });
    } else {
      res.status(500).json({ message: "User creation failed" });
    }
  } catch (error) {
    console.log("Error in register user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Login User
export const loginuser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      if (!user.isActive) {
        return res
          .status(403)
          .json({
            message:
              "Your account was deleted. Please contact admin for further assistance.",
          });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
   const username = user.firstName + " " + user.lastName;
      return res.status(200).json({ message: "Login Success",username });

  } catch (error) {
    console.log("Error in login user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const userdata = async (req, res) => {
  try {
    let userinfo = [];
    if (req.query.email) {
      userinfo = await User.findOne({ email: req.query.email });
    } else {
      userinfo = await User.find();
    }
    if (userinfo) {
      return res
        .status(200)
        .json({ message: "Fetched user data", data: userinfo });
    } else {
      return res.status(400).json({ message: "Fetched user data failed" });
    }
  } catch (error) {
    return res.status(400).json({ message: "Fetched user data failed", error });
  }
};

// userController.js

export const UserImage = async (req, res) => {
  try {
    const { email } = req.body;
    const imagefile = req.file;

    if (!email || !imagefile) {
      return res.status(400).json({ message: "Email and Image are required." });
    }

    const imageUrl = `/` + imagefile.filename;

    const updated = await User.updateOne(
      { email },
      { $set: { image: imageUrl } }
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
export const UpdatePassword = async (req, res) => {
  try {
    const { email, pass, cpass } = req.body;
    const existUser = await User.findOne({ email });
    if (existUser) {
      const matchpassword = await bcrypt.compare(pass, existUser.password);
      if (matchpassword) {
        const salt = await bcrypt.genSalt(10);
        const hashpassword = await bcrypt.hash(cpass, salt);
        const update = await User.updateOne(
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

export const deleteAccount = async (req, res) => {
  try {
    const { email } = req.body;

    const result = await User.updateOne({ email }, { isActive: false });

    if (result.modifiedCount === 1) {
      return res.status(201).json("User deleted");
    } else {
      return res.status(400).json("Account deletion failed");
    }
  } catch (error) {
    console.error("Error in deleteAccount:", error);
    return res.status(500).json("Account deletion failed in catch block");
  }
};
// controllers/userController.js

export const getGenderStats = async (req, res) => {
  // Your logic here, maybe:
  try {
    const maleCount = await User.countDocuments({ gender: "Male" });
    const femaleCount = await User.countDocuments({ gender: "Female" });
    const otherCount = await User.countDocuments({ gender: "Other" });

    res.status(200).json({
      male: maleCount,
      female: femaleCount,
      other: otherCount,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error while fetching gender stats" });
  }
};

export const getAgeStats = async (req, res) => {
  try {
    const age_0_18 = await User.countDocuments({ age: { $gte: 0, $lte: 18 } });
    const age_19_40 = await User.countDocuments({ age: { $gt: 18, $lte: 40 } });
    const age_41_60 = await User.countDocuments({ age: { $gt: 40, $lte: 60 } });
    const age_60_plus = await User.countDocuments({ age: { $gt: 60 } });

    res.status(200).json({
      "0-18": age_0_18,
      "19-40": age_19_40,
      "41-60": age_41_60,
      "60+": age_60_plus,
    });
  } catch (error) {
    console.error("Error fetching age stats:", error);
    res.status(500).json({ error: "Server error while fetching age stats" });
  }
};

export const ChangeLocation = async (req, res) => {
  try {
    const { id, location } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: { location } },
      { new: true } // this returns the updated document
    );

    if (updatedUser) {
      return res
        .status(200)
        .json({ message: "Location updated successfully", user: updatedUser });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating location:", error);
    return res
      .status(500)
      .json({ message: "Location update failed", error: error.message });
  }
};

export const getUserLocation = async (req, res) => {
  try {
    const { email } = req.query;
    const patient = await User.findOne({ email });
    return res.status(200).json({ data: patient.location });
  } catch (error) {
    console.log("Error in fetching user location");
    return res.status(400).json({ message: "Error in fetching user location" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { updatedata } = req.body;
    
    const updateUser = await User.findOneAndUpdate(
      { email: updatedata.oldemail },
      {
        firstName: updatedata.firstName,
        lastName: updatedata.lastName,
        email: updatedata.email,
        gender: updatedata.gender,
        age: updatedata.age,
        phone: updatedata.phone,
      },
      { new: true } 
    );
    if(updateUser){
      return res.status(200).json({messsage:"User data updated."})
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({messsage:"User data not updated."})
  }
};
