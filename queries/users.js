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
    console.error(`Error updating verification status for user ${user_id}:`, error);
    throw error; 
  }
}

module.exports = { findUserByEmail, createUser, updateUserVerification }
