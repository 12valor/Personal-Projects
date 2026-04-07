import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendAdminLoginNotification(ip: string, userAgent: string) {
  const adminEmail = 'evangelista.agdiaz@gmail.com';
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: adminEmail,
    subject: `⚠️ Admin Access Detected - 8K IoT Solutions`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #d32f2f;">Admin Login Alert 🔐</h2>
        <p>A successful login to the 8K IoT Solutions Admin Dashboard was detected.</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p><strong>Time:</strong> ${now} (Manila Time)</p>
        <p><strong>IP Address:</strong> ${ip}</p>
        <p><strong>Browser/Device:</strong> ${userAgent}</p>
        <hr style="border: 0; border-top: 1px solid #eee;" />
        <p style="font-size: 12px; color: #666;">If this wasn't you, please change your admin password immediately in your environment settings.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send admin login notification:', error);
    return { success: false, error };
  }
}
