let blacklistedTokens = new Set(); // simple in-memory blacklist

// 🧩 Logout endpoint
export const logoutUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(400).json({ message: "No token provided" });

    blacklistedTokens.add(token);
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// helper to check if token is blacklisted
export const isTokenBlacklisted = (token) => blacklistedTokens.has(token);