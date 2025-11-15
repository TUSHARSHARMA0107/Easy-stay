import ThemeProvider from "./ThemeContext";
import AuthProvider from "./AuthContext";
import FavoritesProvider from "./FavoritesContext";
import SearchContext from "./Searchcontext";
import UIProvider from "./UIContext";

export default function AppProvider({ children }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <FavoritesProvider>
          <SearchProvider>
            <UIProvider>{children}</UIProvider>
          </SearchProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}