import prisma from "../prismaClient.js";
import * as googleService from "../services/googleService.js";
import * as compareService from "../services/compareService.js";

export const searchPlaces = async (req, res) => {
  const { q, location, radius, type } = req.query;
  if (!q && !location) return res.status(400).json({ message: "q or location required" });

  try {
    const result = await googleService.textSearch({
      query: q,
      location,
      radius: Number(radius || 50000),
      type,
    });
    return res.json(result);
  } catch (err) {
    console.error("googleController.searchPlaces:", err);
    return res.status(500).json({ message: "Google Search failed" });
  }
};

export const getPlace = async (req, res) => {
  const placeId = req.params.placeId;
  try {
    const result = await googleService.placeDetails(placeId);
    return res.json(result);
  } catch (err) {
    console.error("googleController.getPlace:", err);
    return res.status(500).json({ message: "Google Place Details failed" });
  }
};

export const compareListing = async (req, res) => {
  const { businessId, name, location, placeId } = req.query;

  try {
    let internal = null;
    if (businessId) {
      internal = await prisma.business.findUnique({
        where: { id: businessId },
        include: { units: true },
      });
    }

    let googleData = null;
    if (placeId) {
      googleData = (await googleService.placeDetails(placeId)).results;
    } else if (name) {
      googleData = (await googleService.textSearch({ query: name, location })).results;
    }

    const externalPrices = await compareService.fetchExternalPrices({
      name: name || internal?.name,
      location: location || internal?.location,
      placeId,
    });

    return res.json({ internal, googleData, externalPrices });
  } catch (err) {
    console.error("compareListing:", err);
    return res.status(500).json({ message: "Compare failed" });
  }
};