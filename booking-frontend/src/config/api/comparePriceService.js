import http from "./http";
export const comparePrices=async (params)=>{
      const res =await http.get("/api/compare-prices",{params});
      return res.data;
}