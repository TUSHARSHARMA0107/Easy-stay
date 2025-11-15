import { createContext, useContext, useState } from "react";

export const FavoritesContext = createContext();

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    return JSON.parse(localStorage.getItem("favorites")) || [];
  });

  const toggleFavorite = (item) => {
    let updated = [...favorites];

    const exists = favorites.find((f) => f.id === item.id);

    if (exists) {
      updated = favorites.filter((f) => f.id !== item.id);
    } else {
      updated.push(item);
    }

    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => useContext(FavoritesContext);