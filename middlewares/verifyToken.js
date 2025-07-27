const jwt = require("jsonwebtoken");

// Verify Token
function verifyToken(req, res, next) {
  const authToken = req.headers.authorization;
  if (authToken) {
    const token = authToken.split(" ")[1];
    try {
      const decodedPayload = jwt.verify(token, process.env.JWT_SECRET_KEY);
      req.user = decodedPayload;
      next();
    } catch (error) {
      return res.status(401).json({ message: "invalid token, access denied" });
    }
  } else {
    return res
      .status(401)
      .json({ message: "no token provided, access denied" });
  }
}
function verifyTokenAndUser(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id == req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "not allowed, only user" });
    }
  });
}
function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    //req.user.id == req.params.id &&
    console.log(req.user.isAdmin);
    if (req.user.isAdmin) {
      next();
    } else {
      return res.status(403).json({ message: "not allowed, only admin" });
    }
  });
}
module.exports = {
  verifyToken,
  verifyTokenAndUser,
  verifyTokenAndAdmin,
};
