const axios = require('axios');

const sendPasswordResetEmail = async ({ email, name, resetUrl }) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;

  if (!apiKey || !from) {
    if (process.env.NODE_ENV !== 'production') {
      console.info(`[password-reset] Development reset URL for ${email}: ${resetUrl}`);
      return { delivered: false, resetUrl };
    }

    console.error('Password reset email is not configured. Set RESEND_API_KEY and MAIL_FROM.');
    return { delivered: false };
  }

  await axios.post(
    'https://api.resend.com/emails',
    {
      from,
      to: [email],
      subject: 'Reset your TravelMate password',
      html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#17211f;max-width:560px"><p style="letter-spacing:.14em;text-transform:uppercase;font-size:11px;color:#5d6b65">TravelMate account access</p><h1 style="font-family:Georgia,serif;font-weight:400">A small reset, then back to the journey.</h1><p>Hi ${name || 'traveler'},</p><p>Use the button below to choose a new password. This link expires in 15 minutes.</p><p><a href="${resetUrl}" style="display:inline-block;background:#123c35;color:#fff;text-decoration:none;padding:13px 20px;border-radius:8px">Reset password</a></p><p style="color:#5d6b65;font-size:13px">If you did not request this, you can safely ignore this email.</p></div>`,
    },
    { headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' } },
  );

  return { delivered: true };
};

module.exports = { sendPasswordResetEmail };
