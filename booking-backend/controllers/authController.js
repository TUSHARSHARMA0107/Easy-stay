import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const prisma = new PrismaClient();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// --------------------------------------------
// REGISTER USER
// --------------------------------------------

export const registerUser = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, Email & Password required" });
    }

    // Check existing email
    const existEmail = await prisma.user.findUnique({ where: { email } });
    if (existEmail) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Check existing phone
    if (phone) {
      const existPhone = await prisma.user.findUnique({ where: { phone } });
      if (existPhone) {
        return res.status(400).json({ message: "Phone already registered" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || "",
        password: hashedPassword,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
      },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};


// --------------------------------------------
// GOOGLE LOGIN / REGISTER
// --------------------------------------------

export const googleAuth = async (req, res) => {
  try {
    const { token } = req.body;

    if (!token)
      return res.status(400).json({ message: "Google token missing" });

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || email.split("@")[0];
    const avatar = payload.picture;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create google user
      user = await prisma.user.create({
        data: {
          name,
          email,
          googleId,
          phone: "",
          password: "",
          avatar,
        },
      });
    } else if (!user.googleId) {
      // Update if google login added later
      user = await prisma.user.update({
        where: { id: user.id },
        data: { googleId, avatar },
      });
    }

    const jwtToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Google Login Successful",
      user,
      token: jwtToken,
    });

  } catch (err) {
    console.error("Google auth error:", err);
    return res.status(500).json({ message: "Google auth failed" });
  }
};


// --------------------------------------------
// LOGIN USER
// --------------------------------------------

export const loginUser = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({ message: "Email/Phone & Password required" });
    }

    let user = null;

    if (email) {
      user = await prisma.user.findUnique({ where: { email } });
    } else {
      user = await prisma.user.findUnique({ where: { phone } });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Google-only accounts don't have passwords
    if (!user.password) {
      return res.status(400).json({
        message: "This account uses Google Login only",
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.json({
      message: "Login successful",
      user,
      token,
    });

  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

