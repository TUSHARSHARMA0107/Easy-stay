import { getBookingPrices } from "./providers/bookingProvider.js";
import { getAgodaPrices } from "./providers/agodaProvider.js";
import { getTripAdvisorPrices } from "./providers/tripAdvisorProvider.js";
import { getAirbnbPrices } from "./providers/airbnbProvider.js";
import { getHotelsComPrices } from "./providers/hotelsProvider.js";

export const comparePrices = async (placeName, location, type, ourPrice = null) => {
  const [booking, agoda, trip, airbnb, hotels] = await Promise.all([
    getBookingPrices(location),
    getAgodaPrices(),
    getTripAdvisorPrices(),
    getAirbnbPrices(),
    getHotelsComPrices(location),
  ]);

  let results = [...booking, ...agoda, ...trip, ...airbnb, ...hotels].filter((x) => x.price);

  if (ourPrice) {
    results.push({ platform: "Our Platform", name: placeName, price: ourPrice, link: null });
  }

  results.sort((a, b) => (a.price || 0) - (b.price || 0));
  return results;
};