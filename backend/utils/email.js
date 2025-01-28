require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmail = async (to, subject, html) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    html
  };

  await transporter.sendMail(mailOptions);
};

const sendOrderConfirmation = async (order, email) => {
  const subject = 'Order Confirmation';
  const html = `
    <h1>Thank you for your order!</h1>
    <p>Order ID: ${order._id}</p>
    <p>Total Amount: ₹${order.totalAmount}</p>
    <p>We will notify you once your order is shipped.</p>
  `;
  await sendEmail(email, subject, html);
};

const sendOTP = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, resetToken) => {
  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Password Reset',
    text: `Click the following link to reset your password: ${resetLink}`,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
  sendOrderConfirmation,
  sendOTP,
  sendPasswordResetEmail,
};