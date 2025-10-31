const nodemailer = require('nodemailer');
require('dotenv').config();

// Create transporter
const getTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_SECURE === 'true' || false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD
    }
  });
};

// Email template for booking accepted
const getBookingAcceptedEmailTemplate = (booking, mentor, user) => {
  const mentorName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Mentor';
  const mentorTitle = mentor.title || '';
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  
  const date = booking.date ? new Date(booking.date).toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }) : 'To be scheduled';
  
  const time = booking.time || 'To be scheduled';
  const sessionLink = booking.sessionLink || 'Will be provided later';
  const duration = booking.duration || 'N/A';
  const amount = booking.amount || 0;

  return {
    subject: `Booking Accepted - Session Confirmed with ${mentorName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #10b981; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #10b981; }
          .info-label { font-weight: bold; color: #374151; }
          .info-value { color: #1f2937; margin-left: 10px; }
          .session-link { background-color: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✓ Booking Accepted</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            
            <p>Great news! Your booking has been accepted by your mentor.</p>
            
            <div class="info-box">
              <div><span class="info-label">Mentor Name:</span><span class="info-value">${mentorName}${mentorTitle ? ` - ${mentorTitle}` : ''}</span></div>
              <div style="margin-top: 10px;"><span class="info-label">Session Duration:</span><span class="info-value">${duration}</span></div>
              <div style="margin-top: 10px;"><span class="info-label">Amount:</span><span class="info-value">₹${amount}</span></div>
            </div>

            <h3 style="color: #1f2937; margin-top: 25px;">Session Details:</h3>
            <div class="info-box">
              <div><span class="info-label">Date:</span><span class="info-value">${date}</span></div>
              <div style="margin-top: 10px;"><span class="info-label">Time:</span><span class="info-value">${time}</span></div>
              ${booking.sessionLink ? `<div style="margin-top: 15px;">
                <div class="info-label" style="margin-bottom: 8px;">Session Link:</div>
                <a href="${sessionLink}" class="session-link" target="_blank">Join Session</a>
              </div>` : ''}
            </div>

            <p style="margin-top: 25px;">Please make sure to be available at the scheduled time. We look forward to your session!</p>
            
            <p>If you have any questions or need to reschedule, please contact your mentor.</p>
            
            <div class="footer">
              <p>Best regards,<br>CreateBharat Team</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Email template for booking rejected
const getBookingRejectedEmailTemplate = (booking, mentor, user) => {
  const mentorName = `${mentor.firstName || ''} ${mentor.lastName || ''}`.trim() || 'Mentor';
  const userName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'User';
  const reason = booking.cancellationReason || 'No reason provided';
  const duration = booking.duration || 'N/A';
  const amount = booking.amount || 0;

  return {
    subject: `Booking Update - Session Request Status`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 5px 5px 0 0; }
          .content { background-color: #f9fafb; padding: 30px; border-radius: 0 0 5px 5px; }
          .info-box { background-color: white; padding: 15px; margin: 15px 0; border-radius: 5px; border-left: 4px solid #ef4444; }
          .reason-box { background-color: #fef2f2; padding: 15px; margin: 15px 0; border-radius: 5px; border: 1px solid #fecaca; }
          .info-label { font-weight: bold; color: #374151; }
          .info-value { color: #1f2937; margin-left: 10px; }
          .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Booking Update</h1>
          </div>
          <div class="content">
            <p>Dear ${userName},</p>
            
            <p>We regret to inform you that your booking request has been declined by ${mentorName}.</p>
            
            <div class="info-box">
              <div><span class="info-label">Mentor Name:</span><span class="info-value">${mentorName}</span></div>
              <div style="margin-top: 10px;"><span class="info-label">Session Duration:</span><span class="info-value">${duration}</span></div>
              <div style="margin-top: 10px;"><span class="info-label">Amount:</span><span class="info-value">₹${amount}</span></div>
            </div>

            <h3 style="color: #1f2937; margin-top: 25px;">Reason for Rejection:</h3>
            <div class="reason-box">
              <p style="margin: 0; color: #991b1b;">${reason}</p>
            </div>

            <p style="margin-top: 25px;">If payment has been made, you will receive a refund according to our refund policy.</p>
            
            <p>We apologize for any inconvenience this may cause. Feel free to book a session with another mentor or try again later.</p>
            
            <div class="footer">
              <p>Best regards,<br>CreateBharat Team</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `
  };
};

// Send email function
const sendEmail = async (to, subject, html) => {
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASSWORD) {
      console.warn('SMTP credentials not configured. Email not sent.');
      return { success: false, error: 'SMTP not configured' };
    }

    const transporter = getTransporter();
    
    const mailOptions = {
      from: `"CreateBharat" <${process.env.SMTP_USER}>`,
      to: to,
      subject: subject,
      html: html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send booking accepted email
const sendBookingAcceptedEmail = async (booking, mentor, user) => {
  const emailTemplate = getBookingAcceptedEmailTemplate(booking, mentor, user);
  return await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
};

// Send booking rejected email
const sendBookingRejectedEmail = async (booking, mentor, user) => {
  const emailTemplate = getBookingRejectedEmailTemplate(booking, mentor, user);
  return await sendEmail(user.email, emailTemplate.subject, emailTemplate.html);
};

module.exports = {
  sendEmail,
  sendBookingAcceptedEmail,
  sendBookingRejectedEmail
};

