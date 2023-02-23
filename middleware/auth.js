const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.header("Authorization").replace("Bearer ", "");
  if (!token) {
    res.status(200).send({
      success: false,
      msg: "A token is required for authentication",
    });
  }
  try {
    const decode = jwt.verify(token, config.secret_key);
    req.user = decode;
  } catch (error) {
    res.status(400).send("invalid Token");
  }
  return next();
};

module.exports = verifyToken;
