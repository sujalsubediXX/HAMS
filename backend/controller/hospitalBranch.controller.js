import Branch from "../modules/hospitalBranch.module.js"; // adjust path as per your project

export const addHospitalBranch = async (req, res) => {
  try {
    // Extract branch data from request body
    const {
      name,
      address,
      city,
      contactNumber,
      location,  // should contain { lat, lng }
      isMainBranch,
    } = req.body;

    // Basic validation (you can extend this)
    if (!name || !address || !city || !location || location.lat === undefined || location.lng === undefined) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Optional: Check if a main branch already exists when trying to add a new main branch
    if (isMainBranch) {
      const existingMain = await Branch.findOne({ isMainBranch: true });
      if (existingMain) {
        return res.status(400).json({ message: 'Main branch already exists. Only one main branch allowed.' });
      }
    }

    // Create a new Branch document
    const newBranch = new Branch({
      name,
      address,
      city,
      contactNumber,
      location,
      isMainBranch: isMainBranch || false,
    });

    // Save to DB
    const savedBranch = await newBranch.save();

    // Return success response
    res.status(201).json({
      message: 'Branch added successfully',
      branch: savedBranch,
    });
  } catch (error) {
    console.error('Error adding branch:', error);

    // Handle mongoose validation errors specifically
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // General server error
    res.status(500).json({ message: 'Server error, please try again later.' });
  }
};
