const jwt = require("jsonwebtoken");
const config = require("../config/config");

const verifyToken = async (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];
  if (req.headers.authorization) {
    token = req.headers.authorization.replace("Bearer ", "");
  }
  if (!token) {
    res.status(200).send({
      success: false,
      message: "A token is required for authentication",
    });
    return false;
  }
  try {
    const decode = jwt.verify(token, config.secret_key);
    req.user = decode;
  } catch (error) {
    res.status(400).send("invalid Token");
    return false;
  }
  return next();
};

module.exports = verifyToken;
