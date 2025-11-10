import axios from "axios";
export const comparePrice=async (name,location,type)=>{
      const res =await axios.get(`/api/compre/compare`,{
            params:{name,location,type}
      });
      return res.data;

}