import axios from "axios";



export const searchPlaces=async(query)=>{
      const res =await axios.get(`/api/places/search?query=${query}`);
      return res.data.results;
};