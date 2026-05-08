import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

const generateJwtToken = (user) => {
  if (!process.env.JWT_SECRET) {
    const error = new Error("JWT secret is not configured");
    error.statusCode = 500;
    throw error;
  }

  return jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, {
    subject: user._id.toString(),
    expiresIn: process.env.JWT_EXPIRES_IN || "7d"
  });
};

const sendAuthResponse = (res, user, statusCode = 200) => {
  const token = generateJwtToken(user);

  res.setHeader("Authorization", `Bearer ${token}`);

  return res.status(statusCode).json({
    success: true,
    token,
    user: user.toAuthJSON()
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
    return sendAuthResponse(res, user, 201);
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

    return sendAuthResponse(res, user);
  } catch (error) {
    next(error);
  }
};
