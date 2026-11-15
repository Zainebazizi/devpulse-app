import express from 'express';
import { 
  getBugs, 
  getBugById, 
  createBug, 
  updateBug, 
  deleteBug 
} from '../controllers/BugController.js';

const router = express.Router();

router.route('/')
  .get(getBugs)       // جلب كل الـ Bugs (مع دعم البحث)
  .post(createBug);   // إنشاء Bug جديد

router.route('/:id')
  .get(getBugById)    // جلب Bug برقم الـ ID
  .put(updateBug)     // تحديث Bug
  .delete(deleteBug); // حذف Bug

export default router;