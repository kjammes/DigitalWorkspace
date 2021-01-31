const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const fetch = require('node-fetch')

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

const returnLocation = async (req,res) => {
  let country = "N/A";
  let city = "N/A";
  let state = "N/A";
  await fetch(
    "https://www.mapquestapi.com/geocoding/v1/reverse?key=ZnbkZcbWDs9sByGfAed75y4H75QLxxQX&location=" +
      req.body.latitude +
      "%2C" +
      req.body.longitude +
      "&outFormat=json&thumbMaps=false"
  )
  .then((response) => response.json())
  .then((responseJson) => {
    country = responseJson.results[0].locations[0].adminArea1;
    city = responseJson.results[0].locations[0].adminArea5;
    state = responseJson.results[0].locations[0].adminArea3;
  })
  .catch((err) => {
    console.log(err);
    return res.json({ error:err });
  });
  res.json({
    country: country,
    state: state,
    city: city,
  })
}

const sendMessage = function ({ body, payload, params }, res) {
  console.log(payload);
  console.log(body);
  console.log(params);
  res.json({
    test: "test",
  });
};

const getUserData = function( req,res ) {
  console.log(req.payload);
  let userObj = {
    about: "",
    skills: [],
  }
  User.findOne( { _id: req.payload._id } , 'about skills' , (err,newUser) => {
    if(err) { return res.json(err); }
    console.log(newUser);
    userObj.about = newUser.about;
    userObj.skills = newUser.skills;
    console.log(userObj);
    return res.json(userObj);
  } )
}

const updateAboutSection = function (req, res) {
  console.log(req.body);
  let section = req.body.section;
  if( !section )
    return res.json( { message: "No body passed to update anything :/" } );
  if( section === 'about' ) {
    User.updateOne(
      { _id: req.payload._id }, 
      { about : req.body.text },
      (err,res) => {
        if(err) { return res.json({err:err}) }
        console.log("Succesfully updated about section",res);
      }
    );
    return res.json({ message: "updated about" });
  } else if( section === 'skills' ) {
    let skillsArr = req.body.text.split(',');
    console.log(skillsArr);
    User.updateOne(
      { _id: req.payload._id },
      { skills: skillsArr },
      (err, res) => {
        if (err) {
          return res.json({ err: err });
        }
        console.log("Succesfully updated skills section", res);
      }
    );
    return res.json({message:'updated skills'});
  }
  res.json({message:'Updated nothing'});
};

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
  getAllUsers,
  returnLocation,
  sendMessage,
  getUserData,
  updateAboutSection
}