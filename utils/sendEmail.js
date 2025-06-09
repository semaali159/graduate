const nodemailer = require("nodemailer");
const sendEmail = async (email, otpNumber) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PASS,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: email,
      subject: "The OTP Verification code",
      text: `Your OTP is: ${otpNumber}`,
    };

    console.log(transporter.sendMail(mailOptions));
    return transporter
      .sendMail(mailOptions)
      .then(() => otpNumber)
      .catch((error) => {
        throw error;
      });
  } catch (error) {
    throw error;
  }
};
module.exports = sendEmail;
