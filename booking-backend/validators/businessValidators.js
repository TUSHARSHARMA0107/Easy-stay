import Joi from "joi";

export const createBusinessSchema = Joi.object({
  name: Joi.string().min(2).max(200).required(),
  type: Joi.string().valid("HOTEL","HOSTEL","AIRBNB","RESTAURANT","GUESTHOUSE").required(),
  description: Joi.string().max(2000).allow(null, ""),
  address: Joi.string().max(500).allow(null, ""),
  location: Joi.string().max(200).allow(null, ""),
});