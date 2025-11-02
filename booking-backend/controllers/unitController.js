import prisma from "../prismaClient.js";
import { createUnitSchema, updateUnitSchema } from "../validators/unitValidators.js";

// Create new unit
export const createUnit = async (req, res) => {
  const { error, value } = createUnitSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const ownerId = req.user.id;

  // verify business ownership
  const business = await prisma.business.findUnique({
    where: { id: value.businessId },
    select: { id: true, ownerId: true },
  });
  if (!business) return res.status(404).json({ message: "Business not found" });
  if (business.ownerId !== ownerId)
    return res.status(403).json({ message: "You do not own this business" });

  const unit = await prisma.unit.create({
    data: {
      businessId: value.businessId,
      name: value.name,
      description: value.description || null,
      capacity: value.capacity,
      pricePerNight: value.pricePerNight,
    },
  });

  return res.status(201).json({ success: true, unit });
};

// Update unit
export const updateUnit = async (req, res) => {
  const { error, value } = updateUnitSchema.validate(req.body);
  if (error) return res.status(400).json({ message: error.message });

  const ownerId = req.user.id;
  const unitId = req.params.id;

  // verify ownership
  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { business: true },
  });
  if (!unit) return res.status(404).json({ message: "Unit not found" });
  if (unit.business.ownerId !== ownerId)
    return res.status(403).json({ message: "Not authorized" });

  const updated = await prisma.unit.update({
    where: { id: unitId },
    data: value,
  });

  return res.json({ success: true, unit: updated });
};

// Delete unit
export const deleteUnit = async (req, res) => {
  const ownerId = req.user.id;
  const unitId = req.params.id;

  const unit = await prisma.unit.findUnique({
    where: { id: unitId },
    include: { business: true },
  });
  if (!unit) return res.status(404).json({ message: "Unit not found" });
  if (unit.business.ownerId !== ownerId)
    return res.status(403).json({ message: "Not authorized" });

  await prisma.unit.delete({ where: { id: unitId } });
  return res.json({ success: true, message: "Unit deleted" });
};

// Get all units of a business
export const getUnitsByBusiness = async (req, res) => {
  const ownerId = req.user.id;
  const businessId = req.params.businessId;

  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { ownerId: true },
  });
  if (!business) return res.status(404).json({ message: "Business not found" });
  if (business.ownerId !== ownerId)
    return res.status(403).json({ message: "Not authorized" });

  const units = await prisma.unit.findMany({
    where: { businessId },
    orderBy: { createdAt: "desc" },
  });

  return res.json({ success: true, units });
};