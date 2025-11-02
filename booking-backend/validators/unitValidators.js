import Joi from "joi";

export const createUnitSchema = Joi.object({
  businessId: Joi.string().required(),
  name: Joi.string().min(2).max(150).required(),
  description: Joi.string().max(500).allow(null, ""),
  capacity: Joi.number().integer().min(1).required(),
  pricePerNight: Joi.number().min(0).required(),
});

export const updateUnitSchema = Joi.object({
  name: Joi.string().min(2).max(150),
  description: Joi.string().max(500).allow(null, ""),
  capacity: Joi.number().integer().min(1),
  pricePerNight: Joi.number().min(0),
  isAvailable: Joi.boolean(),
});