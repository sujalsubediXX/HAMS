// utils/sendDoctorWelcomeEmail.js
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const sendDoctorWelcomeEmail = async (doctorEmail, doctorName, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"HAMS - Healthcare Appointment Management System" <${process.env.EMAIL_USER}>`,
      to: doctorEmail,
      subject: `Welcome to HAMS, Dr. ${doctorName}!`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #3f51b5;">Welcome to HAMS, Dr. ${doctorName} 👨‍⚕️</h2>
          <p>We are pleased to have you as part of our healthcare network.</p>
          <p><strong>Your login credentials:</strong></p>
          <ul>
            <li><strong>Email:</strong> ${doctorEmail}</li>
            <li><strong>Password:</strong> ${password}</li>
          </ul>
          <p>You can log in at <a href="http://localhost:5173/login">Doctor Login</a></p>
          <p style="color: grey;">For your security, please change your password after logging in.</p>
          <br/>
          <p>Warm regards,<br/>HAMS Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Email sent to Dr. ${doctorName} at ${doctorEmail}`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to send email:`, error);
    return false;
  }
};

export default sendDoctorWelcomeEmail;
