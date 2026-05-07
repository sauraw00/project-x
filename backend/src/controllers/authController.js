import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const validateCredentials = ({ email, password }) => {
  if (!email || !password) {
    const error = new Error("Email and password are required");
    error.statusCode = 400;
    throw error;
  }
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    validateCredentials({ email, password });

    if (!name) {
      const error = new Error("Name is required");
      error.statusCode = 400;
      throw error;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("Email is already registered");
      error.statusCode = 409;
      throw error;
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toAuthJSON() });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    validateCredentials({ email, password });

    const user = await User.findOne({ email }).select("+password").populate("bookmarks");
    if (!user || !(await user.comparePassword(password))) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    const token = signToken(user._id);
    res.json({ token, user: user.toAuthJSON() });
  } catch (error) {
    next(error);
  }
};
