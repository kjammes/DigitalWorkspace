const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: String,
  salt: String,
  provider: {
    type: Boolean,
    default: false
  }
});  

userSchema.methods.validatePassword = (password) => {
  try {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, "sha512").toString("hex");
    return hash === this.password;
  } catch(err) {
    console.log("=========SOME ERROR========="); 
    console.log("=========SOME ERROR========="); 
    console.log(err); 
    console.log("=========SOME ERROR========="); 
    console.log("=========SOME ERROR========="); 
  }
}

userSchema.methods.getJwt = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.JWT_SECRET
  );
};

mongoose.model('User',userSchema);