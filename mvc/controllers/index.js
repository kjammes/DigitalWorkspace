const jwt = require('jsonwebtoken');
require('dotenv').config();
const crypto = require('crypto');

function createJSONWebToken(email, password) {
  return jwt.sign(
    {
      email: email,
      password: password,
    },
    process.env.JWT_SECRET
  );
}

const registerUser = ({body} ,res) => {
  console.log("Inside registerUser")
  if(
    !body.username ||
    !body.email ||
    !body.password ||
    !body.confirmPassword
    ) {
    return res.json( {
      message: "You need to fill in all the fields to register"
    } );
  }
  

  if ( body.password !== body.confirmPassword){
    return res.json({
      message: "Password and Confirm Password do not match"
    })
  }

  let salt = "a25209d32b86d390a49595f45b68c6fc893442125b32ca9c7d6d028bbdb83abbab59420a392c847290d273a2835e0f98d84344c36db1bb8b9201f88468769cba";
  let password = body.password;
  try{
    salt = crypto.randomBytes(64).toString("hex");
    password = crypto.pbkdf2Sync(body.password, salt, 1000, 64, "sha512").toString("hex");
  } catch(err) {
    console.log(err);
  }
}

const loginUser = ({body}, res) => {

  const jToken = createJSONWebToken(body.email, body.password);
  res.json({ jToken });
}

module.exports = {
  createJSONWebToken,
  registerUser,
  loginUser
}