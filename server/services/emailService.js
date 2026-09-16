const nodemailer = require('nodemailer');

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  const emailUser = process.env.EMAIL_USER ? process.env.EMAIL_USER.trim() : '';
  const emailPass = process.env.EMAIL_PASS ? process.env.EMAIL_PASS.replace(/\s+/g, '') : '';

  if (emailUser && emailPass) {
    transporter = nodemailer.createTransport({
      service: process.env.EMAIL_SERVICE || 'gmail',
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    console.log(`[Email Service] Configured for ${emailUser} via ${process.env.EMAIL_SERVICE || 'gmail'}`);
  }

  return transporter;
};

/**
 * Send a due date reminder email to user's Gmail
 */
const sendTaskReminderEmail = async ({ to, userName, taskName, description, dueDate, status }) => {
  const emailClient = getTransporter();

  const formattedDueDate = dueDate
    ? new Date(dueDate).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Tomorrow';

  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const mailOptions = {
    from: `"UpToTask Reminders" <${process.env.EMAIL_USER || 'no-reply@uptotask.com'}>`,
    to,
    subject: `[Reminder] Your task "${taskName}" is due tomorrow!`,
    text: `Hello ${userName || 'User'},\n\nThis is a reminder that your task "${taskName}" is due on ${formattedDueDate}.\n\nDescription: ${description || 'N/A'}\nStatus: ${status}\n\nView and manage your task on UpToTask: ${clientUrl}\n\nBest regards,\nUpToTask Team`,
    html: `
      <div style="font-family: Arial, -apple-system, BlinkMacSystemFont, sans-serif; max-width: 580px; margin: 0 auto; background-color: #ffffff; border: 1px solid #dddddd; border-radius: 6px; padding: 32px 28px; color: #000000;">
        <div style="border-bottom: 1px solid #eeeeee; padding-bottom: 16px; margin-bottom: 24px;">
          <h2 style="margin: 0; font-size: 22px; font-weight: 700; letter-spacing: -0.5px;">UpToTask</h2>
          <span style="font-size: 13px; color: #666666;">Task Deadline Reminder</span>
        </div>

        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 20px;">
          Hello <strong>${userName || 'User'}</strong>,
        </p>
        <p style="font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
          Your task deadline ends in <strong>1 day</strong>. Here are the details of your pending task:
        </p>

        <div style="background-color: #fafafa; border: 1px solid #e5e5e5; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
          <h3 style="margin: 0 0 8px 0; font-size: 17px; font-weight: 600;">${taskName}</h3>
          <p style="margin: 0 0 16px 0; font-size: 14px; color: #444444; line-height: 1.5;">${description || 'No description provided.'}</p>
          <div style="font-size: 13px; color: #666666;">
            <p style="margin: 4px 0;"><strong>Due Date:</strong> ${formattedDueDate}</p>
            <p style="margin: 4px 0;"><strong>Current Status:</strong> <span style="display: inline-block; background-color: #000000; color: #ffffff; padding: 2px 8px; border-radius: 10px; font-size: 11px; font-weight: 600;">${status}</span></p>
          </div>
        </div>

        <div style="text-align: center; margin-bottom: 28px;">
          <a href="${clientUrl}" style="background-color: #000000; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 600; display: inline-block;">
            Open UpToTask Dashboard
          </a>
        </div>

        <div style="border-top: 1px solid #eeeeee; padding-top: 16px; font-size: 12px; color: #888888; text-align: center;">
          You received this email because you have an upcoming task deadline on UpToTask.
        </div>
      </div>
    `,
  };

  if (!emailClient) {
    console.log(`[Email Reminder Simulation] (Gmail credentials not yet configured in .env):
      To: ${to}
      Task: "${taskName}"
      Due: ${formattedDueDate}
      Status: ${status}
    `);
    return { success: true, simulated: true };
  }

  try {
    const info = await emailClient.sendMail(mailOptions);
    console.log(`[Email Sent] Reminder delivered to ${to} (MessageId: ${info.messageId})`);
    return { success: true, messageId: info.messageId };
  } catch (err) {
    console.error(`[Email Send Error] Failed to send reminder to ${to}:`, err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  sendTaskReminderEmail,
};
