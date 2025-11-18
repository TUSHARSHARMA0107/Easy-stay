import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ---------------- REGISTER USER ----------------

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    // 1) Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2) Check email exist
    const existEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 3) Check phone exist
    const existPhone = await prisma.user.findUnique({
      where: { phone },
    });
    if (existPhone) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // 4) Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 5) Create user
    const user = await prisma.user.create({
      data: { name, email, phone, password: hashedPassword },
    });

    // 6) Generate JWT
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "User registered successfully",
      user: { id: user.id, name: user.name, email: user.email, phone: user.phone },
      token,
    });

  } catch (err) {
    console.error("Register Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// ---------------- GOOGLE AUTH ----------------

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ message: "Google token required" });
    }

    // 1) Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email.split("@")[0];

    if (!email) {
      return res.status(400).json({ message: "Google email not found" });
    }

    // 2) Check user exists in DB
    let user = await prisma.user.findUnique({ where: { email } });

    // 3) If not exists → create
    if (!user) {
      user = await prisma.user.create({
        data: {
          name,
          email,
          phone: "",
          password: "",
          googleId,
        },
      });
    } 
    // 4) If exists → update googleId if missing
    else if (!user.googleId) {
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId },
      });
    }

    // 5) Generate JWT
    const appToken = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({
      message: "Logged in with Google",
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: appToken,
    });

  } catch (err) {
    console.error("Google Auth Error:", err);
    return res.status(500).json({ message: "Google auth failed" });
  }
};