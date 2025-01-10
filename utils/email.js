require('dotenv').config();

const sgMail = require('@sendgrid/mail');
const { saveOtpForUser } = require("../queries/users")

sgMail.setApiKey(process.env.SENDGRID_API_KEY); 

const sendVerificationEmail = async (email, token) => {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${token}`;

    const msg = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Verify Your Email Address',
        text: `Please verify your email by clicking the following link: ${verificationUrl}`,
        html: `<p>Please verify your email by clicking the following link: <a href="${verificationUrl}">Verify Email</a></p>`,
    };

    try {
        await sgMail.send(msg);
        console.log(`Verification email sent to ${email}`);
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error('Failed to send verification email');
    }
}

const sendOtpEmail = async (email, id, otp) => {

    // OTP expiration time (5 minutes from generation)
    const expirationTime = new Date(Date.now() + 5 * 60 * 1000); 

    const msg = {
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Your One-Time Passcode (OTP)',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
        html: `<p>Your OTP is <strong>${otp}</strong>. It will expire in 5 minutes.</p>`,
    };

    try {
        if (!id) {
            throw new Error("User ID is required to save OTP.");
        }

        const isSaved = await saveOtpForUser(id, otp, expirationTime); 
        if(isSaved){
            await sgMail.send(msg);
            console.log(`OTP sent to ${email}`);
        }
    } catch (error) {
        console.error('Error sending OTP email:', error);
        throw new Error('Failed to send OTP email');
    }
}

const sendPasswordChangeEmail = async (user) => {

    const msg = {
        to: user.email,
        from: process.env.EMAIL_USER,
        subject: 'Password Changed Successfully', 
        text: `Dear ${user.first_name},\n\nYour password was successfully changed. If you did not request this change, please contact support immediately.`
    };

    try {
        await sgMail.send(msg);
        console.log(`Password change notification email was sent successfully to ${user.email}`);
    } catch (error) {
        console.error("Error sending email:", error);
        throw new Error(`Failed to send password change email to ${user.email}`);
    }
}

const sendTempPasswordEmail = async (email, temporaryPass) => {
    const msg = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: "Your Temporary Password",
      text: `Your temporary password is: ${temporaryPass}\n\nPlease log in and change your password immediately.`,
      html: `
        <p>Your temporary password is: <strong>${temporaryPass}</strong></p>
        <p>Please log in and change your password immediately.</p>
        <p>If you didn't request this, please contact support.</p>
      `,
    };
  
    try {
      await sgMail.send(msg);
      console.log(`Temporary password email sent to ${email}`);
    } catch (error) {
      console.error("Error sending temp password email:", error);
      throw new Error("Failed to send temp password email.");
    }
  };

module.exports = { sendVerificationEmail, sendOtpEmail, sendPasswordChangeEmail, sendTempPasswordEmail }
