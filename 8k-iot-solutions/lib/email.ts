import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const ADMIN_EMAILS = ['evangelista.agdiaz@gmail.com', 'jerowamelo11@gmail.com'];

export async function sendAdminLoginNotification(ip: string, userAgent: string) {
  const now = new Date().toLocaleString('en-US', { timeZone: 'Asia/Manila' });

  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: ADMIN_EMAILS.join(', '),
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

export async function sendTwoFactorCode(code: string) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: ADMIN_EMAILS.join(', '),
    subject: `🔐 Your 8K Admin 2FA Code: ${code}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 30px; border-radius: 10px; background-color: #ffffff;">
        <h2 style="color: #000; text-align: center; font-size: 24px; margin-bottom: 20px;">Verification Code</h2>
        <p style="color: #666; font-size: 16px; text-align: center;">Enter the following code to sign in to your admin account. This code will expire in 10 minutes.</p>
        <div style="background-color: #f4f4f5; padding: 20px; border-radius: 8px; text-align: center; font-size: 36px; font-weight: bold; letter-spacing: 5px; color: #000; margin: 30px 0;">
          ${code}
        </div>
        <p style="color: #999; font-size: 14px; text-align: center;">If you didn't request this code, you can safely ignore this email.</p>
        <hr style="border: 0; border-top: 1px solid #eee; margin: 30px 0;" />
        <p style="color: #ccc; font-size: 12px; text-align: center;">8K IoT Solutions &copy; 2026</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Failed to send 2FA code:', error);
    return { success: false, error };
  }
}
