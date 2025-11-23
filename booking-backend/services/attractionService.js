import axios from "axios";

const booking = axios.create({
  baseURL: "https://booking-com15.p.rapidapi.com/api/v1",
  headers: {
    "x-rapidapi-host": "booking-com15.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_KEY,
  },
});

const google = axios.create({
  baseURL: "https://google-search-master-mega.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "google-search-master-mega.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_KEY,
  },
});

// 1) Find attraction UFI for a city
export async function findAttractionLocation(city) {
  try {
    const r = await booking.get("/attraction/searchLocation", {
      params: {
        query: city,
        languagecode: "en-us",
      },
    });

    return r.data?.data?.[0] || null;
  } catch (err) {
    console.log("findAttractionLocation ERROR:", err.response?.data);
    return null;
  }
}

// 2) Get list of attractions using UFI
export async function getAttractionList(ufi) {
  try {
    const r = await booking.get("/attraction/searchAttractions", {
      params: {
        id: ufi,
        sortBy: "trending",
        page: 1,
        currency_code: "INR",
        languagecode: "en-us",
      },
    });

    return r.data?.data || [];
  } catch (err) {
    console.log("getAttractionList ERROR:", err.response?.data);
    return [];
  }
}

// 3) Google image search for single attraction
export async function getAttractionImage(query) {
  try {
    const r = await google.get("/images", {
      params: {
        q: query,
        gl: "us",
        hl: "en",
        num: 1,
        page: 1,
        autocorrect: true,
      },
    });

    return r.data?.data?.[0]?.url || null;
  } catch (err) {
    return null;
  }
}

// 4) FINAL function -> return READY attractions with images
export async function buildAttractions(city) {
  try {
    const location = await findAttractionLocation(city);
    if (!location) return [];

    const ufi =
      location?.ufi ||
      location?.id ||
      location?.location_id ||
      null;

    if (!ufi) return [];

    const list = await getAttractionList(ufi);

    const final = [];

    for (const a of list) {
      const title = a.title || a.name || "Attraction";

      const img = await getAttractionImage(title);

      final.push({
        id: a.id || a.ufi || Math.random(),
        title,
        rating: a.rating || null,
        price: a.price || null,
        currency: a.currency || "INR",
        image: img,
      });
    }

    return final;
  } catch (err) {
    console.log("buildAttractions ERROR:", err.message);
    return [];
  }
}