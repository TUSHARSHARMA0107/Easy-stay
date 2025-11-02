import prisma from "../prismaClient.js";
import { createBusinessSchema } from "../validators/businessValidators.js";
import { uploadBufferToCloudinary } from "../middleware/upload.js"; // upload helper lives in middleware/upload.js

// Create business (owner only)
export const createBusiness = async (req, res) => {
  // validation
  const { error, value } = createBusinessSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const ownerId = req.user?.id;
  if (!ownerId) return res.status(401).json({ message: "Unauthorized" });

  // Minimal duplicate check: owner shouldn't create exact name duplicate
  const exists = await prisma.business.findFirst({
    where: { ownerId, name: { equals: value.name, mode: "insensitive" } },
  });
  if (exists) return res.status(400).json({ message: "You already have a business with that name" });

  // Create
  const business = await prisma.business.create({
    data: {
      owner: { connect: { id: ownerId } },
      name: value.name,
      type: value.type,
      description: value.description || null,
      address: value.address || null,
      location: value.location || null,
    },
    select: {
      id: true, name: true, type: true, description: true, address: true, location: true, images: true, ownerId: true, createdAt: true
    }
  });

  return res.status(201).json({ success: true, business });
};

// Upload a single image and attach to business images array
export const uploadBusinessImage = async (req, res) => {
  const ownerId = req.user?.id;
  const businessId = req.params.id;
  const file = req.file;

  if (!file) return res.status(400).json({ message: "No file uploaded" });

  // verify business exists and belongs to owner
  const business = await prisma.business.findUnique({ where: { id: businessId }, select: { ownerId: true, images: true } });
  if (!business) return res.status(404).json({ message: "Business not found" });
  if (business.ownerId !== ownerId) return res.status(403).json({ message: "Not your business" });

  // upload buffer to cloudinary
  const result = await uploadBufferToCloudinary(file.buffer, "business_images");
  const url = result.secure_url || result.url || result.secureUrl;

  // push to images array
  const updated = await prisma.business.update({
    where: { id: businessId },
    data: { images: { push: url } },
    select: { id: true, images: true },
  });

  return res.json({ success: true, images: updated.images });
};

// Simple public listing helpers (basic, optimized)
export const listBusinesses = async (req, res) => {
  const { q, type, location, page = 1, limit = 12 } = req.query;
  const take = Math.min(Number(limit) || 12, 50);
  const skip = (Math.max(Number(page) || 1, 1) - 1) * take;

  const where = {
    AND: []
  };
  if (q) where.AND.push({ name: { contains: q, mode: "insensitive" } });
  if (type) where.AND.push({ type });
  if (location) where.AND.push({ location: { contains: location, mode: "insensitive" } });

  // remove empty AND to avoid Prisma complaining
  if (where.AND.length === 0) delete where.AND;

  const [total, businesses] = await Promise.all([
    prisma.business.count({ where }),
    prisma.business.findMany({
      where,
      skip,
      take,
      orderBy: { createdAt: "desc" },
      select: {
        id: true, name: true, type: true, location: true, images: true, rating: true,
        units: { take: 1, select: { pricePerNight: true } } // sample price
      }
    })
  ]);

  return res.json({ success: true, total, page: Number(page), businesses });
};

export const getBusinessById = async (req, res) => {
  const id = req.params.id;
  const business = await prisma.business.findUnique({
    where: { id },
    include: {
      units: true,
      owner: { select: { id: true, name: true, email: true } }
    }
  });
  if (!business) return res.status(404).json({ message: "Business not found" });
  return res.json({ success: true, business });
};