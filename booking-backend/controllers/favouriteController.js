import prisma from "../config/prismaClient.js";

export const addFavorite = async (req, res) => {
  const userId = req.user.id;
  const { placeId, name, address, image, type } = req.body;
  const exists = await prisma.favorite.findFirst({ where: { userId, placeId }});
  if (exists) return res.json({ message: "Already saved" });
  const fav = await prisma.favorite.create({ data: { userId, placeId, name, address, image, type }});
  res.json(fav);
};

export const removeFavorite = async (req, res) => {
  const userId = req.user.id;
  await prisma.favorite.deleteMany({ where: { userId, placeId: req.params.placeId }});
  res.json({ success: true });
};

export const getFavorites = async (req, res) => {
  const userId = req.user.id;
  const list = await prisma.favorite.findMany({ where: { userId }, orderBy: { createdAt: "desc" }});
  res.json(list);
};