const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

const findByEmail = async (email) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Supabase error on findByEmail:', error);
      throw error;
    }

    return data || null;
  } catch (error) {
    console.error('Error finding user by email:', error);
    throw error;
  }
};

const createUser = async (email, passwordHash, username) => {
  try {
    const usernameSafe = (!username || typeof username === 'undefined' || username === null) ? '' : username;

    const { data, error } = await supabase
      .from('users')
      .insert([
        {
          email,
          password_hash: passwordHash,
          username: usernameSafe,
        },
      ])
      .select('id')
      .single();

    if (error) {
      console.error('Supabase error on createUser:', error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

module.exports = { findByEmail, createUser };
