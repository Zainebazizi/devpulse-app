
import express from 'express';
import {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
} from '../controllers/BugController.js';

const router = express.Router();

router.get('/', getBugs);
router.get('/:id', getBugById);
router.post('/', createBug);
router.put('/:id', updateBug);
router.delete('/:id', deleteBug);

export default router;