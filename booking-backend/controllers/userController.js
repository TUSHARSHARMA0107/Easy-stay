import cloudinary from "../config/cloudinary.js";
import { PrismaClient } from "@prisma/client";
import prisma from "../prismaClient.js";
import { uploadBufferToCloudinary } from "../middleware/upload.js";

export const updatePhoto = async (req, res) => {
  try {
    const userId = req.user.id;
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No image uploaded" });

    const uploaded = await uploadBufferToCloudinary(file.buffer, "profile_photos");
    const photoUrl = uploaded.secure_url;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: { photo: photoUrl },
      select: { id: true, name: true, email: true, photo: true }
    });

    return res.json({ success: true, user: updated });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



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