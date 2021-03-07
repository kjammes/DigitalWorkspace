const mongoose = require("mongoose");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const locationSchema = new mongoose.Schema({
  country: {
    type: String,
    default: "India",
    required: true,
  },
  state: {
    type: String,
    default: "Maharashtra",
    required: true,
  },
  city: {
    type: String,
    default: "Mumbai",
    required: true,
  },
});

const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  post_by: {
    type: String,
  },
  posted_by_name: String,
});

const linkSchema = new mongoose.Schema({
  socialMediaName: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
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
  loaction: locationSchema,
  about: {
    type: String,
    default: "Give something about you!",
  },
  skills: [String],
  posts: [postSchema],
  links: [linkSchema],
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
      provider: this.provider,
    },
    process.env.JWT_SECRET
  );
};

mongoose.model("User", userSchema);
mongoose.model("Location", locationSchema);
mongoose.model("Post", postSchema);
