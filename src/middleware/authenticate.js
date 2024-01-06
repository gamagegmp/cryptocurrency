const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res
      .status(401)
      .json({ errorMessage: "Token is missing" });
  }

  const [authType, authToken] = authHeader.split(" ");

  if (!authType || !authToken || authType.toLowerCase() !== "bearer") {
    return res.status(401).json({ errorMessage: "Invalid token format" });
  }

  try {
    const decodedInfo = jwt.verify(authToken, process.env.SECRET);

    req.user = decodedInfo;
    next();
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ errorMessage: "Invalid token provided" });
  }
};

module.exports = authenticate;
