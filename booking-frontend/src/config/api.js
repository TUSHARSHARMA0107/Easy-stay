//choose backend url accordingly

let API_BASE_URL=import.meta.env.VITE_API_BASE_URL||"http://localHost:5000/api";

if (window.location.hostname=="localhost"){
      const API_BASE_URL=import.meta.env.VITE_API_BASE_URL||"http://localHost:5000/api";
}else if(window.location.hostname.includes("staging"))
      {
      const API_BASE_URL="https://staging.yourapp.com/api";
}else{
      API_BASE_URL="https://ypurapp.vercel.app/api"
}

API_BASE_URL=import.meta.env.VITE_API_BASE_URL||API_BASE_URL;

export default API_BASE_URL;