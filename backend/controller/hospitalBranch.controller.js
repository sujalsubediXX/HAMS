import Branch from "../modules/hospitalBranch.module.js";

export const addHospitalBranch = async (req, res) => {
  try {
    const { name, address, city, contactNumber, location, isMainBranch } =
      req.body;

    if (
      !name ||
      !address ||
      !city ||
      !location ||
      location.lat === undefined ||
      location.lng === undefined
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields." });
    }

    if (isMainBranch) {
      const existingMain = await Branch.findOne({ isMainBranch: true });
      if (existingMain) {
        return res
          .status(400)
          .json({
            message:
              "Main branch already exists. Only one main branch allowed.",
          });
      }
    }

    const newBranch = new Branch({
      name,
      address,
      city,
      contactNumber,
      location,
      isMainBranch: isMainBranch || false,
    });

    const savedBranch = await newBranch.save();

    res.status(201).json({
      message: "Branch added successfully",
      branch: savedBranch,
    });
  } catch (error) {
    console.error("Error adding branch:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }

    res.status(500).json({ message: "Server error, please try again later." });
  }
};


export const hospitalBranchlocation=async (req, res) => {
  try {
    const data = await Branch.find();
    if (data) {
      return res.status(201).json({ location: data });
    } else {
      return res
        .status(404)
        .json({ message: "branch location data not found" });
    }
  } catch (error) {
    return res.status(404).json({ message: "location data error" });
  }
}