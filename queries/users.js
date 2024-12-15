const db = require("../db/dbConfig");
const bcrypt = require("bcrypt");

const findUserByEmail = async (email) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", email);

    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw error;
  }
};

const findUserById = async (id) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE id = $1", id);

    return user;
  } catch (error) {
    console.error("Error finding user by id:", error);
    throw error;
  }
};

const createUser = async ({passwordHash, email, first_name, last_name}) => {
  try {
    const newUser = await db.one(`INSERT INTO users (password_hash, email, first_name, last_name) VALUES ($1,$2,$3,$4) RETURNING id, email, first_name, last_name`, [passwordHash, email, first_name, last_name])
    return newUser
  } catch (error){
      console.error("Error creating new user:", error);
      throw error;
  }
}
const updateUserVerification = async ({id, is_verified}) => {
  try {
    if (!id) {
      throw new Error("User ID is required to update verification status.");
    }

    const updatedUser = await db.one(
      `UPDATE users 
       SET is_verified = $1 
       WHERE id = $2 
       RETURNING id, email, first_name, last_name, is_verified`,
      [is_verified, id]
    );

    return updatedUser;
  } catch(error) {
    console.error(`Error updating verification status for user ${id}:`, error);
    throw error; 
  }
}

const saveOtpForUser = async (userId, otp, expirationTime) => {
  try {
    const hashedOTP = await bcrypt.hash(otp, 10);
    const otpRecord = await db.one(
      `INSERT INTO user_otps (user_id, otp, expiration_time) 
      VALUES ($1, $2, $3) 
      RETURNING user_id, otp, expiration_time`,
      [userId, hashedOTP, expirationTime]
    );
    return otpRecord;
  } catch (error) {
    console.error("Error saving OTP:", error);
    throw error;
  }
};

const findOtpByUserId = async (userId) => {
  try {
    const otp = await db.oneOrNone(
      `SELECT * FROM user_otps WHERE user_id = $1 AND expiration_time > NOW()`,
      userId
    );
    return otp;
  } catch (error) {
    console.error("Error finding OTP for user:", error);
    throw error;
  }
};

const verifyOtp = async (userId, otp) => {
  try {
    const otpRecord = await db.oneOrNone(
      "SELECT * FROM user_otps WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1",
      [userId]
    );

    if (!otpRecord) {
      return false;
    }

    const now = new Date();
    const expirationTime = otpRecord.expiration_time;

    if (now > expirationTime) {
      return false;
    }

    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      console.log(`Incorrect OTP entered for user ${userId}`);
      return false;
    }

    await db.none(
      "DELETE FROM user_otps WHERE user_id = $1 AND otp = $2",
      [userId, otpRecord.otp]
    );

    return true;
  } catch(error) {
    console.error("Error verifying OTP:", error);
    throw new Error("An error occurred while verifying OTP.");
  }
};

const updateUserPassword = async (id, newHashedPassword) => {
  try {
    console.log("Updating password for user ID:", id);
    console.log("New hashed password:", newHashedPassword);
    const updatedUser = await db.oneOrNone(
      "UPDATE users SET password_hash=$1 WHERE id=$2 RETURNING *",
      [
        newHashedPassword,
        id,
      ]
    );
    return updatedUser
  } catch(error) {
    console.error("Error updating password:", error);
    throw new Error("An error occurred updating password.");
  }
}

module.exports = { findUserByEmail, createUser, updateUserVerification, saveOtpForUser, findOtpByUserId, verifyOtp, updateUserPassword, findUserById }
