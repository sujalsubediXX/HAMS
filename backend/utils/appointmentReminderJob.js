import cron from "node-cron";
import sendAppointmentReminderEmail from "./sendAppointmentReminderEmail.js";
// import BookAppointment from '../modules/BookAppointment.js';
// import User from '../modules/User.js';
import BookAppointment from "../modules/bookAppointment.module.js";
import User from "../modules/user.module.js";
const appointmentReminderJob = () => {
  // Runs every day at 8 AM
  cron.schedule("0 8 * * *", async () => {
    sendDailyEmail();
    // cron.schedule('*/1 * * * *', async () => { // Runs every minute
  });
};
(async () => {
  console.log("Running daily email task on server start");
  await sendDailyEmail();
})();

async function sendDailyEmail() {
  console.log("📬 Starting daily appointment reminder job...");

  try {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 1);

    const appointments = await BookAppointment.find({
      date: { $gte: tomorrow, $lt: dayAfter },
      status: "pending",
    });

    for (const appt of appointments) {
      const patient = await User.findById(appt.patientId);
      if (!patient) continue;

      await sendAppointmentReminderEmail(
        patient.email,
        patient.firstName,
        appt.doctorName,
        appt.date,
        appt.startTime,
        appt.endTime
      );
    }

    console.log("✅ Daily reminders sent.");
  } catch (err) {
    console.error("❌ Error during appointment reminder job:", err.message);
  }
}
export default appointmentReminderJob;
