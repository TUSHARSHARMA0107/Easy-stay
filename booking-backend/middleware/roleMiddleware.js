/**
 * Restrict route access based on user roles.
 * Usage: app.get("/api/owner", protect, allowRoles("OWNER"), handler)
 */
export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole)
      return res.status(401).json({ message: "User not authenticated" });

    if (!allowedRoles.includes(userRole))
      return res
        .status(403)
        .json({ message: "You do not have permission to access this route" });

    next();
  };
};