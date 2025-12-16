const smsIndiaHubService = require('../services/smsIndiaHubService');

/**
 * Send OTP via SMS using SMSIndia Hub
 * @param {string} phone - Phone number to send SMS to
 * @param {string} otp - OTP code to send
 * @returns {Promise<Object>} - Response object
 */
const sendOTP = async (phone, otp) => {
  try {
    console.log(`Attempting to send OTP ${otp} to phone: ${phone}`);
    
    const result = await smsIndiaHubService.sendOTP(phone, otp);
    
    console.log(`SMS sent successfully via SMSIndia Hub:`, result);
    return result;
    
  } catch (error) {
    console.error('Failed to send OTP via SMSIndia Hub:', error.message);
    
    // Re-throw the error to be handled by the calling function
    throw new Error(`SMS sending failed: ${error.message}`);
  }
};

/**
 * Send welcome SMS to new users
 * @param {string} phone - Phone number
 * @param {string} firstName - User's first name
 * @returns {Promise}
 */
const sendWelcomeSMS = async (phone, firstName) => {
  try {
    const message = `Welcome to CreateBharat, ${firstName}! Your account has been successfully created. Start exploring opportunities in internships, loans, mentors, and legal services.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('Error sending welcome SMS:', error);
    throw error;
  }
};

/**
 * Send loan application confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} loanType - Type of loan
 * @param {string} applicationId - Application ID
 * @returns {Promise}
 */
const sendLoanApplicationSMS = async (phone, loanType, applicationId) => {
  try {
    const message = `Your ${loanType} loan application #${applicationId} has been submitted successfully. Our team will review and contact you within 24 hours.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('Error sending loan application SMS:', error);
    throw error;
  }
};

/**
 * Send internship application confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} companyName - Company name
 * @param {string} position - Position applied for
 * @returns {Promise}
 */
const sendInternshipApplicationSMS = async (phone, companyName, position) => {
  try {
    const message = `Your application for ${position} at ${companyName} has been submitted successfully. Good luck!`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('Error sending internship application SMS:', error);
    throw error;
  }
};

/**
 * Send mentor booking confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} mentorName - Mentor name
 * @param {string} bookingDate - Booking date
 * @param {string} bookingTime - Booking time
 * @returns {Promise}
 */
const sendMentorBookingSMS = async (phone, mentorName, bookingDate, bookingTime) => {
  try {
    const message = `Your mentor session with ${mentorName} is confirmed for ${bookingDate} at ${bookingTime}. Please be ready for the session.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('Error sending mentor booking SMS:', error);
    throw error;
  }
};

/**
 * Send legal service confirmation SMS
 * @param {string} phone - Phone number
 * @param {string} serviceType - Type of legal service
 * @param {string} caseId - Case ID
 * @returns {Promise}
 */
const sendLegalServiceSMS = async (phone, serviceType, caseId) => {
  try {
    const message = `Your ${serviceType} legal service request #${caseId} has been received. Our legal team will contact you within 2 hours.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('Error sending legal service SMS:', error);
    throw error;
  }
};

/**
 * Send password reset OTP SMS
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 * @returns {Promise}
 */
const sendPasswordResetOTP = async (phone, otp) => {
  try {
    const message = `Your CreateBharat password reset OTP is ${otp}. This OTP is valid for 10 minutes. Do not share it with anyone.`;
    return await smsIndiaHubService.sendCustomSMS(phone, message);
  } catch (error) {
    console.error('Error sending password reset OTP SMS:', error);
    throw error;
  }
};

/**
 * Get SMSIndia Hub account balance
 * @returns {Promise<Object>} - Balance information
 */
const getSMSBalance = async () => {
  try {
    return await smsIndiaHubService.getBalance();
  } catch (error) {
    console.error('Error fetching SMS balance:', error);
    throw error;
  }
};

/**
 * Test SMSIndia Hub connection
 * @returns {Promise<Object>} - Test result
 */
const testSMSConnection = async () => {
  try {
    return await smsIndiaHubService.testConnection();
  } catch (error) {
    console.error('Error testing SMS connection:', error);
    throw error;
  }
};

module.exports = {
  sendOTP,
  sendWelcomeSMS,
  sendLoanApplicationSMS,
  sendInternshipApplicationSMS,
  sendMentorBookingSMS,
  sendLegalServiceSMS,
  sendPasswordResetOTP,
  getSMSBalance,
  testSMSConnection
};
