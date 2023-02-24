
const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");

// const wowowowow = require("wowowowow");


const saltRounds = 10;

// The GET / signup

router.get("/signup", (req, res) => {
  res.render("auth/signup-form");
});

// The POST / signup

router.post("/signup", (req, res) => {
    const { username, password } = req.body;
  
    const usernameIsNotProvided = !username || username === "";
    const passwordIsNotProvided = !password || password === "";
  
    if (usernameIsNotProvided || passwordIsNotProvided) {
      res.render("auth/signup-form", {
        errorMessage: "Please, provide username and password.",
      });
      return;
    }
  
    // Checking if the username has been taken
    User.findOne({ username: username })
      .then((userFound) => {
        if (userFound) {
          throw new Error("The username already taken");
        }
  
        // Salt generating
        return bcrypt.genSalt(saltRounds);
      })
      .then((salt) => {
        return bcrypt.hash(password, salt);
      })
      .then((hashedPassword) => {
        return User.create({ username: username, password: hashedPassword });
      })
      .then((createdUser) => {
        req.session.user = createdUser;
        res.redirect("/");
      })
      .catch((err) => {
        res.render("auth/signup-form", {
          errorMessage: err.message || "Error while signing up",
        });
      });
  });
  


module.exports = router;