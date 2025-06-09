const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../models");
const asynchandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { validateRegister, validateLogin } = require("../utils/authValidate");
const { generateRandomNumber, generateToken } = require("../utils/generateOTP");
const sendEmail = require("../utils/sendEmail");
const sequelize = require("../config/config");

const register = asynchandler(async (req, res) => {
  const { error } = validateRegister(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { name, email, password, provinces, interests, phoneNumber } = req.body;
  let user = await db.user.findOne({ where: { email } });
  if (user) {
    return res
      .status(400)
      .json({ message: "Email already exists, please login" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = generateRandomNumber(1000, 9999);

  try {
    await sendEmail(email, otp);
  } catch (error) {
    console.error("Error sending email:", error);
    return res
      .status(500)
      .json({ message: "Failed to send verification email" });
  }
  const t = await sequelize.transaction();

  try {
    user = await db.user.create(
      {
        name,
        email,
        password: hashedPassword,
        isAdmin: false,
        phoneNumber,
        otpNum: otp,
      },
      { transaction: t }
    );
    console.log("11111111111");
    if (interests && interests.length > 0) {
      const interestPromises = interests.map(async (interest) => {
        const existInterest = await db.interest.findOne(
          { where: { name: interest } },
          { transaction: t }
        );
        console.log(existInterest);
        if (existInterest) {
          await db.userInterests.create(
            {
              userId: user.id,
              interestId: existInterest.id,
            },
            { transaction: t }
          );
        }
      });

      await Promise.all(interestPromises);
    }
    console.log("111545");
    if (provinces && provinces.length > 0) {
      const provincePromises = provinces.map(async (province) => {
        let existLocation = await db.province.findOne(
          {
            where: { adm1_en: province },
          },
          { transaction: t }
        );

        await db.userProvinces.create(
          {
            userId: user.id,
            provinceId: existLocation.gid,
          },
          { transaction: t }
        );
      });

      await Promise.all(provincePromises);
    }

    await t.commit();
    return res.status(201).json({ message: "User registered successfully!" });
  } catch (error) {
    await t.rollback();
    console.error("Error during user registration:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during registration." });
  }
});
module.exports = { register };
