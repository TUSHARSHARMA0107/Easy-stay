import prisma from "../prismaClient.js";
import cloudinary from "../utils/cloudinary.js"; // optional, if using Cloudinary
import jwt from "jsonwebtoken";

// 🧩 Get user profile
export const getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
        authProvider: true,
        role: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🧩 Update user profile (name or image)
export const updateProfile = async (req, res) => {
  try {
    const { name } = req.body;
    let imageUrl;

    if (req.file) {
      // if you're using cloudinary or local upload
      const upload = await cloudinary.uploader.upload(req.file.path, {
        folder: "user_profiles",
      });
      imageUrl = upload.secure_url;
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name: name || undefined,
        profileImage: imageUrl || undefined,
      },
      select: {
        id: true,
        name: true,
        email: true,
        profileImage: true,
      },
    });

    res.json({ message: "Profile updated successfully", user: updated });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({ message: "Server error" });
  }
};