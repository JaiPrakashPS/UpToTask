const Task = require('../models/Task');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { taskName, description, progress, duration, status } = req.body;

    if (!taskName || !taskName.trim()) {
      return res.status(400).json({ success: false, message: 'Task name is required' });
    }

    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: 'Description is required' });
    }

    // Default or normalize progress
    let numericProgress = progress !== undefined ? Number(progress) : 0;
    if (isNaN(numericProgress) || numericProgress < 0 || numericProgress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be a number between 0 and 100',
      });
    }

    // Validate duration
    if (!duration || typeof duration !== 'object') {
      return res.status(400).json({
        success: false,
        message: 'Duration is required with value and unit',
      });
    }

    const durationValue = Number(duration.value);
    if (isNaN(durationValue) || durationValue <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Duration value must be a positive number',
      });
    }

    const validUnits = ['Minutes', 'Hours', 'Days'];
    if (!duration.unit || !validUnits.includes(duration.unit)) {
      return res.status(400).json({
        success: false,
        message: 'Duration unit must be Minutes, Hours, or Days',
      });
    }

    // Validate status
    const taskStatus = status || 'Planned';
    const validStatuses = ['Planned', 'In Progress', 'Complete'];
    if (!validStatuses.includes(taskStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Planned, In Progress, or Complete',
      });
    }

    // Auto-adjust progress if status is Complete
    if (taskStatus === 'Complete') {
      numericProgress = 100;
    }

    const task = await Task.create({
      userId: req.user._id,
      taskName: taskName.trim(),
      description: description.trim(),
      progress: numericProgress,
      duration: {
        value: durationValue,
        unit: duration.unit,
      },
      status: taskStatus,
    });

    return res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for the logged-in user
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user._id }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only view your own tasks',
      });
    }

    return res.status(200).json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only edit your own tasks',
      });
    }

    const { taskName, description, progress, duration, status } = req.body;

    if (taskName !== undefined) {
      if (!taskName.trim()) {
        return res.status(400).json({ success: false, message: 'Task name cannot be empty' });
      }
      task.taskName = taskName.trim();
    }

    if (description !== undefined) {
      if (!description.trim()) {
        return res.status(400).json({ success: false, message: 'Description cannot be empty' });
      }
      task.description = description.trim();
    }

    if (status !== undefined) {
      const validStatuses = ['Planned', 'In Progress', 'Complete'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: 'Status must be Planned, In Progress, or Complete',
        });
      }
      task.status = status;
    }

    if (progress !== undefined) {
      const numericProgress = Number(progress);
      if (isNaN(numericProgress) || numericProgress < 0 || numericProgress > 100) {
        return res.status(400).json({
          success: false,
          message: 'Progress must be a number between 0 and 100',
        });
      }
      task.progress = numericProgress;
    }

    // Auto-adjust progress to 100% if status was updated to Complete and progress wasn't explicitly set to something else
    if (task.status === 'Complete' && (progress === undefined || Number(progress) === 100)) {
      task.progress = 100;
    }

    if (duration !== undefined) {
      if (typeof duration !== 'object') {
        return res.status(400).json({
          success: false,
          message: 'Duration must be an object with value and unit',
        });
      }
      if (duration.value !== undefined) {
        const val = Number(duration.value);
        if (isNaN(val) || val <= 0) {
          return res.status(400).json({
            success: false,
            message: 'Duration value must be a positive number',
          });
        }
        task.duration.value = val;
      }
      if (duration.unit !== undefined) {
        const validUnits = ['Minutes', 'Hours', 'Days'];
        if (!validUnits.includes(duration.unit)) {
          return res.status(400).json({
            success: false,
            message: 'Duration unit must be Minutes, Hours, or Days',
          });
        }
        task.duration.unit = duration.unit;
      }
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only delete your own tasks',
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update task status
// @route   PATCH /api/tasks/:id/status
// @access  Private
const updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;

    const validStatuses = ['Planned', 'In Progress', 'Complete'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Status must be Planned, In Progress, or Complete',
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Check ownership
    if (task.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied: You can only update your own tasks',
      });
    }

    task.status = status;
    if (status === 'Complete') {
      task.progress = 100;
    } else if (status === 'Planned' && task.progress === 100) {
      task.progress = 0;
    }

    await task.save();

    return res.status(200).json({
      success: true,
      message: 'Task status updated successfully',
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  updateStatus,
};
