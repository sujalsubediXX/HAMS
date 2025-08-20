import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendAppointmentReminderEmail = async (patientEmail, patientName, doctorName, date, startTime, endTime) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const formattedDate = new Date(date).toLocaleDateString();

    const mailOptions = {
      from: `"HAMS" <${process.env.EMAIL_USER}>`,
      to: patientEmail,
      subject: `⏰ Appointment Reminder | HAMS`,
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #3f51b5;">Hello ${patientName},</h2>
          <p>This is a reminder about your appointment scheduled for <strong>tomorrow</strong>.</p>
          <ul>
            <li><strong>Doctor:</strong> Dr. ${doctorName}</li>
            <li><strong>Date:</strong> ${formattedDate}</li>
            <li><strong>Time:</strong> ${startTime} - ${endTime}</li>
          </ul>
          <p>Please arrive 10 minutes early and bring any previous medical documents.</p>
          <br/>
          <p>Regards,<br/>HAMS Team</p>
          <p>Sujal Subedi and Nischal Shrestha Teams</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Reminder email sent to: ${patientEmail}`);
  } catch (error) {
    console.error(`❌ Failed to send reminder to ${patientEmail}:`, error.message);
  }
};

export default sendAppointmentReminderEmail;
