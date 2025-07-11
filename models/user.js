const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.PGUSER,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  password: process.env.PGPASSWORD,
  port: process.env.PGPORT,
});

const findByEmail = async (email) => {
  try {
    const res = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return res.rows[0]; // PostgreSQL menyimpan hasil di rows
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const createUser = async (email, passwordHash, username) => {
  try {
    const usernameSafe = (!username || typeof username === 'undefined' || username === null) ? '' : username;

    console.log('Register params:', { emailSafe: email, passwordHashSafe: passwordHash, usernameSafe });

    const res = await pool.query(
      'INSERT INTO users (email, password_hash, username) VALUES ($1, $2, $3) RETURNING id',
      [email, passwordHash, usernameSafe]
    );

    return res.rows[0].id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = { findByEmail, createUser };
