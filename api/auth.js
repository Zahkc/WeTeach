const jwt = require("jsonwebtoken");

const yenv = require('yenv');
const config = yenv(__dirname+'/config.yaml');

const verifyToken = (req, res, next) => {
  const token = req.body.token || req.query.token || req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send("Authentication required");
  }
  try {
    const decoded = jwt.verify(token, config.PRESENTER_KEY);
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }
  return next();
};

module.exports = verifyToken;