// authorizeMiddleware.js

const authorize = (allowedRoles) => {
  return (req, res, next) => {
    // Check if the user is authenticated and has a role
    if (!req.user || !req.user.role) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authenticated" });
    }

    // Check if the user's role is allowed
    if (!allowedRoles.includes(req.user.role)) {
      console.log("not permitted");

      return res.status(403).json({
        message:
          "Forbidden: You do not have permission to access this resource",
      });
    }

    // If the user has the required role, proceed to the next middleware/route handler
    next();
  };
};

module.exports = authorize;
