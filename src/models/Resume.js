import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }, // Reference to User
  title: { type: String, default: "Untitled Resume" },
  jobTitle: { type: String },
  email: { type: String, required: true },
  phone: { type: String },
  address: { type: String },

  // Optional sections (Only stored if user adds them)
  links: [{ name: String, url: String }],
  profileSummary: { type: String },
  languages: [{ language: String, level: String }],
  experiences: [
    {
      employer: String,
      jobTitle: String,
      location: String,
      startDate: String,
      endDate: String,
      description: String,
    },
  ],
  education: [
    {
      degree: String,
      school: String,
      location: String,
      startDate: String,
      endDate: String,
    },
  ],
  skills: [{ skill: String, level: String }],
  certifications: [
    { title: String, link: String, issuingOrganization: String },
  ],
  interests: [{ title: String }],
  projects: [
    {
      title: String,
      subtitle: String,
      link: String,
      startDate: String,
      endDate: String,
    },
  ],

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
