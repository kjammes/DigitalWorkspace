const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    default: "India",
    required: true
  },
  state: {
    type: String,
    default: "Maharashtra",
    required: true
  },
  city: {
    type: String,
    default: "Mumbai",
    required: true
  },
});

const messageSchema = new mongoose.Schema({
  from_id: {
    type: String,
    required: true,
  },
  content: [
    {
      messenger: String,
      message: String,
    },
  ],
});

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
    default: false,
  },
  messages: [messageSchema],
  loaction: locationSchema,
  about: {
    type:String,
    default: "Give something about you!"
  },
  skills: [String]
});

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(64).toString("hex");
  this.password = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
};

userSchema.methods.validatePassword = function (password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
    .toString("hex");
  return hash === this.password;
};

userSchema.methods.getJwt = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      provider: this.provider
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", userSchema);
mongoose.model("Location", locationSchema);
mongoose.model("Message", messageSchema);
// mongoose.model("Post", postSchema);