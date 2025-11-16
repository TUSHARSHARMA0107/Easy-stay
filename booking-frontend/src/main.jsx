import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { ThemeProvider } from "./context/ThemeContext.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { FavoritesProvider } from "./context/FavoritesContext.jsx";
import { ChatProvider } from "./context/ChatContext.jsx";
import { SearchProvider } from "./context/SearchContext.jsx";
import { BrowserRouter } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <SearchProvider>
            <ChatProvider>
              <App />
            </ChatProvider>
          </SearchProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
  </BrowserRouter>
);