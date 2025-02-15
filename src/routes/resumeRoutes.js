import express from 'express';
import { createResume, getResume, updateResume, deleteResume } from '../controllers/resumeController.js';
import { getUserDetails } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/',getUserDetails,  createResume); // Create Resume
router.get('/:resumeId',getUserDetails, getResume); // Fetch Resume
router.put('/:resumeId', getUserDetails, updateResume); // Update Resume
router.delete('/:resumeId', getUserDetails, deleteResume); // DELETE Resume 

export default router;
