import axios from "axios";

const google = axios.create({
  baseURL: "https://google-search-master-mega.p.rapidapi.com",
  headers: {
    "x-rapidapi-host": "google-search-master-mega.p.rapidapi.com",
    "x-rapidapi-key": process.env.RAPID_KEY,
  },
});

export async function getImages(query, count = 5) {
  try {
    const r = await google.get("/images", {
      params: {
        q: query,
        gl: "us",
        hl: "en",
        num: count,
        page: 1,
        autocorrect: true,
      },
    });

    return r.data?.data?.map((i) => i.url) || [];
  } catch (err) {
    console.log("Image service ERROR:", err.message);
    return [];
  }
}