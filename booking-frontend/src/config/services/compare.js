import api from "../axios";
export const comparePrices= async (params)=>{
  try{
    const res=await  api.get("/api/compare/prices",{params});
    return res.data.results || [];

  }catch(err)
{
  console.error("Compare price error:",err);
  return[];

}
};