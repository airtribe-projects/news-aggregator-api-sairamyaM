const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usersModel = require('../models/usersModel');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET;

const registerUser = async (user) => {
  try {
    if (!user.email || !user.password || !user.name) {
      throw new Error('Missing required fields');
    }

    const existing = await usersModel.findOne({ email: user.email.toLowerCase() });
    if (existing) {
      throw new Error('User already exists');
    }

    user.email = user.email.toLowerCase();
    user.password = bcrypt.hashSync(user.password, SALT_ROUNDS);

    const dbUser = await usersModel.create(user);
    const token = jwt.sign({ id: dbUser._id }, JWT_SECRET, { expiresIn: '1d' });
    dbUser.password = undefined;

    return { user: dbUser, token };
  } catch (err) {
    console.error('Signup failed:', err.message);
    throw err;
  }
};

const loginUser = async (email, password) => {

  const dbUser = await usersModel.findOne({ email });

  if (!dbUser) {
    throw new Error("User not found. Please sign up first.");
  }

  const isSamePassword = await bcrypt.compare(password, dbUser.password);

  if (!isSamePassword) {
    throw new Error("Wrong password.");
  }

  const token = jwt.sign({ id: dbUser._id }, JWT_SECRET, { expiresIn: "1d" });

  return { user: { id: dbUser._id, email: dbUser.email }, token };
};

const getPreferences = async (id) => {
  const user = await usersModel.findById(id);
  if (!user) throw new Error('User not found');
  return user.preferences;
};


const updatePreferences = async (id, prefs) => {
  const user = await usersModel.findByIdAndUpdate(id, { preferences: prefs }, { new: true });
  return user.preferences;
};

module.exports = { registerUser, loginUser, getPreferences, updatePreferences };
