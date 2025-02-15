import express from 'express';
import { createResume, getResume, updateResume, deleteResume } from '../controllers/resumeController.js';

const router = express.Router();

router.post('/', createResume); // Create Resume
router.get('/:resumeId', getResume); // Fetch Resume
router.put('/:resumeId', updateResume); // Update Resume
router.delete('/:resumeId', deleteResume); // DELETE Resume 

export default router;
