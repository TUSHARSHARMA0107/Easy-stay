import React from "react";
import { Routes, Route } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import HomePage from "./pages/HomePage";



export function App() {
       return ( 
       <Routes>
             <Route path="/" element={<RegisterPage />} />
              <Route path="/home" element={<HomePage />} />
               </Routes>
                ); 
            }

