const { expressjwt: jwt } = require('express-jwt');
require('dotenv').config();

const authorize = jwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "payload",
});

module.exports = {
  authorize
}