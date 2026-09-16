const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Task must belong to a user'],
      index: true,
    },
    taskName: {
      type: String,
      required: [true, 'Task name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    progress: {
      type: Number,
      required: [true, 'Progress is required'],
      min: [0, 'Progress cannot be less than 0%'],
      max: [100, 'Progress cannot exceed 100%'],
      default: 0,
    },
    duration: {
      value: {
        type: Number,
        required: [true, 'Duration value is required'],
        min: [1, 'Duration value must be at least 1'],
      },
      unit: {
        type: String,
        required: [true, 'Duration unit is required'],
        enum: {
          values: ['Minutes', 'Hours', 'Days'],
          message: '{VALUE} is not a supported duration unit. Choose Minutes, Hours, or Days.',
        },
        default: 'Hours',
      },
    },
    status: {
      type: String,
      required: [true, 'Status is required'],
      enum: {
        values: ['Planned', 'In Progress', 'Complete'],
        message: '{VALUE} is not a supported status',
      },
      default: 'Planned',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Task', taskSchema);
