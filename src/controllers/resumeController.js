import Resume from "../models/Resume.js";

// Create Resume (Only Logged-in Users)
export const createResume = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Login required to create a resume" });
    }

    const { title, jobTitle, email, phone, address } = req.body;
    const userId = req.user._id; // Ensure userId is stored

    const newResume = new Resume({
      userId,
      title,
      jobTitle,
      email,
      phone,
      address,
    });

    await newResume.save();
    res.status(201).json(newResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get Resume (Only Logged-in Users)
export const getResume = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Login required to access resume" });
    }

    const { resumeId } = req.params;
    const resume = await Resume.findOne({
      _id: resumeId,
      userId: req.user._id,
    }); // Fetch only the logged-in user’s resume

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(resume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Resume (Only Logged-in Users)
export const updateResume = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Login required to update resume" });
    }

    const { resumeId } = req.params;
    const updates = req.body;

    const updatedResume = await Resume.findOneAndUpdate(
      { _id: resumeId, userId: req.user._id }, // Ensure user owns the resume
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!updatedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json(updatedResume);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Resume (Only Logged-in Users)
export const deleteResume = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Login required to delete resume" });
    }

    const { resumeId } = req.params;
    const deletedResume = await Resume.findOneAndDelete({
      _id: resumeId,
      userId: req.user._id,
    }); // Only delete if owned by user

    if (!deletedResume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({ message: "Resume deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { createResume, getResume, updateResume, deleteResume };
