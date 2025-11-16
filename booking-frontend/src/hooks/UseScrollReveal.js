import { distance } from "framer-motion";
import { useEffect } from "react";
import ScrollReveal from "scrollreveal";

export default function useScrollReveal(selector,options ={}){
      useEffect(()=>{
            ScrollReveal().reveal(selector,{
                  distance:"40px",
                  duration:800,
                  easing :"ease-in-out",
                  origin:"bottom",
                  interval :100,
                  ...options,
            });
      },[selector,options]);
}