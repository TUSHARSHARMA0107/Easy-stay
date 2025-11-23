import dotenv from "dotenv";
dotenv.config();



import app from "./app.js";





const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));




process.on("unhandledRejection",(err)=>{
      console.error("UNHANDLED REJECTIONS:",err.stack || err);
      });

      process.on("uncaughtExceptions",(err)=>{
      console.error("UNCAUGHT EXCEPTIONS:",err.stack || err);
      });