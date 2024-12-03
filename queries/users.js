const db = require("../db/dbConfig");

const findUserByEmail = async (email) => {
  try {
    const user = await db.oneOrNone("SELECT * FROM users WHERE email = $1", email);

    return user;
  } catch (error) {
    console.error("Error finding user by email:", error);
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
    const otpRecord = await db.one(
      `INSERT INTO user_otps (user_id, otp, expiration_time) 
      VALUES ($1, $2, $3) 
      RETURNING user_id, otp, expiration_time`,
      [userId, otp, expirationTime]
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

// Delete expired OTPs (for cleanup)
// const deleteExpiredOtps = async () => {
//   try {
//     await db.none("DELETE FROM user_otps WHERE expiration_time < NOW()");
//   } catch (error) {
//     console.error("Error deleting expired OTPs:", error);
//     throw error;
//   }
// };

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

    if (otpRecord.otp !== otp) {
      console.log(`Incorrect OTP entered for user ${userId}`);
      return false;
    }
    return true;
  } catch(error) {
    console.error("Error verifying OTP:", error);
    throw new Error("An error occurred while verifying OTP.");
  }
};

const updateUserPassword = async (id, newHashedPassword) => {
  try {
    const updatedUser = await db.one(
      "UPDATE user SET password_hash=$1 WHERE id=$2 RETURNING id",
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

module.exports = { findUserByEmail, createUser, updateUserVerification, saveOtpForUser, findOtpByUserId, verifyOtp, updateUserPassword }
