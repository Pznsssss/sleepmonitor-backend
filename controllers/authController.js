const bcrypt = require('bcrypt');
const User = require('../models/user');

const registerUser = async (req, res) => {
  const { email, password, username } = req.body;
  console.log('Data dari req.body saat login:', { email, password }); 

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Account already exists!' });
  }   

    const hashedPassword = await bcrypt.hash(password, 10);
    const userId = await User.createUser(email, hashedPassword, username);

    return res.status(201).json({ message: 'Registration successful', userId });
  } catch (error) {
    console.error('Error during registration:', error);
    return res.status(500).json({ message: 'Failed to register' });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    return res.status(200).json({ message: 'Login successful', userId: user.id });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ message: 'Failed to login' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};