const cron = require('node-cron');
const Task = require('../models/Task');
const { sendTaskReminderEmail } = require('./emailService');

/**
 * Check for tasks due in 1 day (next 24 hours) and send email reminders
 */
const checkRemindersNow = async () => {
  try {
    const now = new Date();
    // 24 hours window (tasks due between now and now + 24 hours)
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    const pendingTasks = await Task.find({
      status: { $ne: 'Complete' },
      dueDate: {
        $ne: null,
        $gte: now,
        $lte: oneDayFromNow,
      },
      reminderSent: { $ne: true },
    }).populate('userId', 'name email');

    if (pendingTasks.length > 0) {
      console.log(`[Reminder Service] Found ${pendingTasks.length} task(s) due within 24 hours.`);
    }

    let sentCount = 0;
    for (const task of pendingTasks) {
      if (task.userId && task.userId.email) {
        await sendTaskReminderEmail({
          to: task.userId.email,
          userName: task.userId.name,
          taskName: task.taskName,
          description: task.description,
          dueDate: task.dueDate,
          status: task.status,
        });

        // Mark as sent to prevent duplicate reminders
        task.reminderSent = true;
        await task.save();
        sentCount++;
      }
    }

    return { success: true, count: sentCount };
  } catch (error) {
    console.error('[Reminder Service Error]:', error.message);
    return { success: false, error: error.message };
  }
};

/**
 * Start the background cron job (runs every 30 minutes)
 */
const initReminderCron = () => {
  // Run once shortly after server boots
  setTimeout(() => {
    checkRemindersNow();
  }, 5000);

  // Run every 30 minutes: "*/30 * * * *"
  cron.schedule('*/30 * * * *', async () => {
    console.log('[Reminder Cron] Checking for pending task due-date reminders...');
    await checkRemindersNow();
  });

  console.log('[Reminder Service] Scheduled background cron job initialized (checks every 30 mins).');
};

module.exports = {
  checkRemindersNow,
  initReminderCron,
};
