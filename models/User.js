const mysql = require('mysql2/promise');
const databaseConfig = require('../config/database');

const pool = mysql.createPool(databaseConfig);


const findByEmail = async (email) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0];
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const createUser = async (email, passwordHash, username) => {
  try {
    // Jika username undefined/null/kosong, isi dengan string kosong
    const usernameSafe = (!username || typeof username === 'undefined' || username === null) ? '' : username;
    console.log('Register params:', { emailSafe: email, passwordHashSafe: passwordHash, usernameSafe });
    const [result] = await pool.execute(
      'INSERT INTO users (email, password_hash, username) VALUES (?, ?, ?)',
      [email, passwordHash, usernameSafe]
    );
    return result.insertId;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = { findByEmail, createUser };