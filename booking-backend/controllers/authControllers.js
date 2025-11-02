import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import dotenv from "dotenv";
import { sendEmail } from "../services/emailServices.js";
import { PrismaClient } from "@prisma/client";
dotenv.config();

const prisma = new PrismaClient();

// Utility: generate JWT
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

// Register new user or owner
export const registerUser = async (req, res) => {
  try {
    // Debug incoming request for troubleshooting
    console.log("[registerUser] incoming", {
      method: req.method,
      contentType: req.headers["content-type"],
      body: req.body,
      query: req.query,
    });

    // Accept JSON or form-encoded bodies. If empty, allow quick testing via query params (temporary fallback).
    const source = req.body && Object.keys(req.body).length ? req.body : req.query;
    let { name, email, password, role } = source || {};

    // Normalize role to uppercase enum values (USER/OWNER)
    if (role && typeof role === "string") role = role.toUpperCase();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role || "USER",
        verificationToken,
      },
      select: { id: true, name: true, email: true, role: true },
    });

    // send verification email
    const verifyLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
    await sendEmail(
      email,
      "Verify your Easy-Stay account",
      `<h3>Welcome to Easy-Stay, ${name}!</h3>
       <p>Please verify your email by clicking below:</p>
       <a href="${verifyLink}">Verify Email</a>`
    );

    const token = generateToken(user.id, user.role);

    res.status(201).json({ ...user, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error during registration" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user.id, user.role);

    res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
  }
};

//  Get logged in user details
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, profileImage: true },
    });

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};