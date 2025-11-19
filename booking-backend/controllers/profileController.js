import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

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

    return res.json({
      message: "Avatar updated successfully",
      avatar: updatedUser.avatar,
    });

  } catch (err) {
    console.error("Avatar Upload Error →", err);
    return res.status(500).json({ message: "Server error" });
  }
};