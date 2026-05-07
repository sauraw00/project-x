export const requireAuth = (_req, res, _next) => {
  res.status(501).json({ message: "Auth middleware pending implementation" });
};
