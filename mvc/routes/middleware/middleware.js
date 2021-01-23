const jwt = require("express-jwt");
require('dotenv').config();

const authorize = jwt({
  secret: "svdsjvbdlsvbsdvksjdbvlsadkvjbasdksaldjvb",
  algorithms: ["HS256"],
  userProperty: "payload",
});

module.exports = {
  authorize
}