import Specialty from "../modules/specialty.module.js";
export const getAllSpecialties = async (req, res) => {
  try {
    const specialties = await Specialty.find({});
    return res.status(200).json({ data: specialties });
  } catch (error) {
    console.error("Error fetching specialties:", error);
    return res.status(500).json({ message: "Error fetching specialties" });
  }
};
export const addSpecialty = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Specialty name is required" });
    }

    const existingSpecialty = await Specialty.findOne({ name });
    if (existingSpecialty) {
      return res.status(400).json({ message: "Specialty already exists" });
    }

    const newSpecialty = new Specialty({ name });
    await newSpecialty.save();
    return res.status(201).json({ message: "Specialty added successfully"});
  } catch (error) {
    console.error("Error adding specialty:", error);
    return res.status(500).json({ message: "Error adding specialty" });
  }
};

export const updateSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === "") {
      return res.status(400).json({ message: "Specialty name is required" });
    }

    const updatedSpecialty = await Specialty.findByIdAndUpdate(id, { name }, { new: true });
    if (!updatedSpecialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }

    return res.status(200).json({ message: "Specialty updated successfully", data: updatedSpecialty });
  } catch (error) {
    console.error("Error updating specialty:", error);
    return res.status(500).json({ message: "Error updating specialty" });
  }
};
export const deleteSpecialty = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpecialty = await Specialty.findByIdAndDelete(id);
    if (!deletedSpecialty) {
      return res.status(404).json({ message: "Specialty not found" });
    }
    return res.status(200).json({ message: "Specialty deleted successfully" });
  } catch (error) {
    console.error("Error deleting specialty:", error);
    return res.status(500).json({ message: "Error deleting specialty" });
  }
};