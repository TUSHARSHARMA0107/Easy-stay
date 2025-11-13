import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const RAPID_API_KEY = process.env.RAPID_API_KEY;

// ✅ 1️⃣ Search Places
export const searchPlaces = async (req, res) => {
  try {
    const { query, lat, lng, type, minRating, radius } = req.query;
    const finalQuery = query || type || "popular places";
    const centerLat = lat ? parseFloat(lat) : 28.6139;
    const centerLng = lng ? parseFloat(lng) : 77.2090;
    const searchRadius = radius ? parseInt(radius) : 10000;

    const body = {
      textQuery: finalQuery,
      languageCode: "en",
      maxResultCount: 10,
      minRating: minRating ? parseFloat(minRating) : 0,
      includedType: type || "",
      strictTypeFiltering: !!type,
      locationBias: {
        circle: {
          center: { latitude: centerLat, longitude: centerLng },
          radius: searchRadius,
        },
      },
    };

    const response = await axios.post(
      "https://google-map-places-new-v2.p.rapidapi.com/v1/places:searchText",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Goog-FieldMask": "*",
          "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
          "x-rapidapi-key": RAPID_API_KEY,
        },
      }
    );

    const places = response.data.places?.map((place) => ({
      id: place.id,
      name: place.displayName?.text,
      address: place.formattedAddress,
      rating: place.rating,
      type: place.primaryTypeDisplayName?.text,
      photo: place.photos?.[0]?.name
        ? `https://google-map-places-new-v2.p.rapidapi.com/v1/${place.photos[0].name}/media?maxWidthPx=800&maxHeightPx=600&skipHttpRedirect=true`
        : null,
      link: place.googleMapsUri,
    }));

    return res.json({ results: places || [] });
  } catch (err) {
    console.error("Error searching places:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to fetch places" });
  }
};

// ✅ 2️⃣ Get Place Details by Place ID
export const getPlaceDetailsController = async (req, res) => {
  try {
    const { placeId } = req.params;
    const response = await axios.get(
      `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${placeId}`,
      {
        headers: {
          "X-Goog-FieldMask": "*",
          "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
          "x-rapidapi-key": RAPID_API_KEY,
        },
      }
    );
    res.json({ details: response.data });
  } catch (err) {
    console.error("Error fetching place details:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch place details" });
  }
};

// ✅ 3️⃣ Get Photo by Media ID
export const getPlacePhotoController = async (req, res) => {
  try {
    const { photoId } = req.params;
    const url = `https://google-map-places-new-v2.p.rapidapi.com/v1/places/${photoId}/media?maxWidthPx=800&maxHeightPx=600&skipHttpRedirect=true`;

    const response = await axios.get(url, {
      headers: {
        "x-rapidapi-host": "google-map-places-new-v2.p.rapidapi.com",
        "x-rapidapi-key": RAPID_API_KEY,
      },
    });

    res.json({ photoUrl: response.data?.url || url });
  } catch (err) {
    console.error("Error fetching photo:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to fetch photo" });
  }
};