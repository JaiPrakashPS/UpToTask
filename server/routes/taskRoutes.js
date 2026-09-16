const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateStatus,
  getTaskStats,
  triggerReminderCheck,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

router.route('/')
  .post(createTask)
  .get(getTasks);

router.get('/stats', getTaskStats);
router.post('/check-reminders', triggerReminderCheck);

router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

router.patch('/:id/status', updateStatus);

module.exports = router;
