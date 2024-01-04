const jwt = require("jsonwebtoken");

exports.generateAccessToken = (userId) => {
  return jwt.sign({ userId }, process.env.AUTH_SECRET, {
    expiresIn: "15m",
  });
};

exports.generateRefreshToken = (userId) => {
  return jwt.sign({ userId }, process.env.REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

exports.verifyRefreshToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_SECRET);
    return decoded;
  } catch (error) {
    return null;
  }
};

exports.auth = (req, res, next) => {
  let token = req.header("Authorization");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized: Token not provided" });
  }

  try {
    token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.AUTH_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: "Unauthorized: Invalid token" });
  }
};
