import cloudinary from "../config/cloudinary.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const uploadProfileImage = async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ message: "No file uploaded" });

    // Upload to Cloudinary
    const upload = await cloudinary.uploader.upload_stream(
      { folder: "smartstay_users", resource_type: "image" },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        const updatedUser = await prisma.user.update({
          where: { id: req.user.id },
          data: { profileImage: result.secure_url },
        });

        res.status(200).json({
          message: "Profile image updated successfully",
          profileImage: updatedUser.profileImage,
        });
      }
    );

    upload.end(file.buffer);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};