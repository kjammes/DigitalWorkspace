const passport = require("passport");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const fetch = require("node-fetch");
const Post = mongoose.model("Post")

//Login Register
const registerUser = ({ body }, res) => {
  console.log("Inside registerUser");
  if (
    !body.email ||
    !body.username ||
    !body.password ||
    !body.confirmPassword
  ) {
    return res.json({
      message: "You need to fill in all the fields to register",
    });
  }

  if (body.password.length >= 8 && body.password !== body.confirmPassword) {
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
};

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
};

//location services
const returnLocation = async (req, res) => {
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
      return res.json({ error: err });
    });
  res.json({
    country: country,
    state: state,
    city: city,
  });
};

//handling about and skills
const getUserData = function (req, res) {
  let user_id = req.body.user_id;
  if ( user_id ) {
    console.log("If userid");
    User.findOne({ _id: user_id }, "-password -salt", (err, newUser) => {
      if (err) {
        return res.json(err);
      }
      let newUserObj = newUser.toObject();
      newUserObj.forDisplay = true;
      return res.json(newUserObj);
    });
  } else {
    console.log("If not userid");
    User.findOne(
      { _id: req.payload._id },
      "-password -salt",
      (err, newUser) => {
        if (err) {
          return res.json(err);
        }
        return res.json(newUser);
      }
    );
  }
};

const updateAboutSection = function (req, res) {
  let section = req.body.section;
  if (!section)
    return res.json({ message: "No body passed to update anything :/" });
  if (section === "about") {
    User.updateOne(
      { _id: req.payload._id },
      { about: req.body.text },
      (err, res) => {
        if (err) {
          return res.json({ err: err });
        }
        console.log("Succesfully updated about section", res);
      }
    );
    return res.json({ message: "updated about" });
  } else if (section === "skills") {
    let skillsArr = req.body.text.split(",").slice(0, 6);
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
    return res.json({ message: "updated skills" });
  }
  res.json({ message: "Updated nothing" });
};

//handling provider switch
const switchToProvider = function (req, res) {
  User.updateOne({ _id: req.payload._id }, { provider: true , posts: [] }, (err, res) => {
    if (err) {
      return res.json({ err: err });
    }
    console.log("Succesfully switched to provider", res);
  });
  res.json({ message: "Succesfully switched to provider" });
};

//handling getting provider or consumer
const getProvidersList = function (req, res) {
  User.find({ provider: true }, "about username skills", (err, userList) => {
    if (err) console.log(err);
    return res.send(userList);
  });
};

const getConsumersList = function (req, res) {
  User.find({ provider: false }, " about username ", (err, userList) => {
    if (err) return res.json({ error: err });
    return res.send(userList);
  });
};

//helper controllers
const getUserNameById = function (req, res) {
  // console.log("Inside getUserNameById", req.body.person_id);
  let username = "";
  let gettingUser = new Promise(function (resolve, reject) {
    User.findOne({ _id: req.body.person_id }, "username", (err, newUser) => {
      if (err) {
        return res.json(err);
      }
      // console.log(newUser);
      resolve(newUser);
    });
  });

  gettingUser
    .then((recUN) => {
      // console.log(recUN);
      username = recUN;
      res.json({ user: username });
    })
    .catch((err) => {
      console.log("error", err);
    });
};

//Handling posts
const createPost = function ({ body, payload }, res) {
  if (!body.content) {
    return res.status(400).json({
      message: "Insufficient data sent with the request.",
    });
  }

  let userId = payload._id;

  const post = new Post();

  post.content = body.content;
  post.post_by = payload._id;
  post.posted_by_name = payload.username;

  User.findById(userId, (err, user) => {
    if (err) {
      return res.json({ err: err });
    }

    let newPost = post.toObject();
    newPost.name = payload.name;
    newPost.ownerid = payload._id;
    user.posts.push(post);
    user.save((err) => {
      if (err) {
        return res.json({ err: err });
      }
      return res.status(201).json({ message: "Created post", newPost: newPost });
    });
  });
};

const getPosts = function( req, res ) {
  User.find({}, "posts", function (err, users) {
    var postsList = [];

    users.forEach(function (user) {
      for( let post of user.posts ) {
        postsList.push(post);
      }
    });

    res.send(postsList);
  });
};

//getting search results
const getSearchResults = function ({ query, payload }, res) {
  if (!query.query) {
    return res.json({ err: "Missing a query." });
  }
  if( payload.provider ) {
    User.find({}, "posts", function (err, users) {
      var postsList = [];

      let re = new RegExp(query.query);
      users.forEach(function (user) {
        for (let post of user.posts) {
          let OK = re.exec(post.content);
          if( OK )
            postsList.push(post);
        }
      });

      res.send(postsList);
    });
  } else {
    User.find(
      { username: { $regex: query.query, $options: "i" },provider:true },
      (err, results) => {
        if (err) {
          return res.json({ err: err });
        }
  
        return res
          .status(200)
          .send(results);
      }
    );
  }
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
  getUserData,
  updateAboutSection,
  switchToProvider,
  getConsumersList,
  getProvidersList,
  getUserNameById,
  createPost,
  getPosts,
  getSearchResults
};
