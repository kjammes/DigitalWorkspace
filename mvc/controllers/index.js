const passport = require("passport");
const mongoose = require("mongoose");
const crypto = require('crypto');
const User = mongoose.model("User");

const registerUser = ({body} ,res) => {
  console.log("Inside registerUser")
  if(
    !body.email ||
    !body.username ||
    !body.password ||
    !body.confirmPassword
    ) {
    return res.json( {
      message: "You need to fill in all the fields to register"
    } );
  }

  if ( body.password.length>=8 &&  body.password !== body.confirmPassword) {
    return res.json({
      message: "Password and Confirm Password do not match",
    });
  }
  
  const user = new User();
  user.username = body.username.trim();
  user.email = body.email.trim();
  user.setPassword(body.password);

  user.save((err, newUser) => {
    if (err) {
      console.log(err);
      if (
        err.errmsg &&
        err.errmsg.includes("duplicate key error") &&
        err.errmsg.includes("email")
      ) {
        return res.json({
          message: "The provided email is already registered.",
        });
      }
      return res.json({ message: "Something went wrong." });
    } else {
      const token = newUser.getJwt();
      res.status(201).json({ token });
    }
  });
}

const loginUser = (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: "All fields are required." });
  }

  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return res.status(404).json(err);
    }
    if (user) {
      const token = user.getJwt();
      res.status(201).json({ token });
    } else {
      res.json(info);
    }
  })(req, res);
}


//for testing only
const deleteAllUsers = function (req, res) {
  User.deleteMany({}, (err, info) => {
    if (err) {
      return res.send({ error: err });
    }
    return res.json({ message: "Deleted All Users", info: info });
  });
};

const getAllUsers = function (req, res) {
  User.find((err, users) => {
    if (err) {
      return res.send({ error: err });
    }
    return res.json({ users: users });
  });
};

module.exports = {
  registerUser,
  loginUser,
  deleteAllUsers,
  getAllUsers
}