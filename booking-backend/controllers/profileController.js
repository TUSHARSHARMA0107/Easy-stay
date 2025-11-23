import { PrismaClient } from "@prisma/client";
import { error } from "pdf-lib";
const prisma = new PrismaClient();

// ===========================
// GET PROFILE
// ===========================
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    return res.json({ user });
  } catch (err) {
    console.error("Get profile error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// UPLOAD AVATAR
// ===========================
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "Image upload failed" });
    }

    const avatarUrl = req.file.path;

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { avatar: avatarUrl },
    });

    res.json({
      message: "Avatar updated successfully",
      avatar: updatedUser.avatar,
    });
  } catch (err) {
    console.error("Avatar Upload Error →", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ===========================
// UPDATE NAME + PHONE
// ===========================
export const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { name, phone },
    });

    res.json({ message: "Profile updated", user: updated });
  } catch (err) {
    console.error("Update profile error:", err.stack || err);
   return res.status(500).json({ message: "Server error",error:err.message });
  }
};

// ===========================
// SET ROLE (user / owner)
// ===========================
export const setRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "owner"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { role },
    });

    return res.json({ message: "Role updated", role: updated.role });
  } catch (err) {
    console.error("Set role error:", err);
    res.status(500).json({ message: "Server error" });
  }
};