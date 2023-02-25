
const router = require("express").Router();
const User = require("./../models/User.model");
const bcrypt = require("bcryptjs");


// const wowowowow = require("wowowowow");

const isLoggedIn = require("./../middleware/isLoggedIn");



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


// The GET / login

router.get("/login", (req, res) => {
  res.render("auth/login-form");
});

// The POST / login

// POST /login
router.post("/login", (req, res) => {
    // Get the username and password from the req.body
    const { username, password } = req.body;
  
    // Check if the username and the password are provided
    const usernameNotProvided = !username || username === "";
    const passwordNotProvided = !password || password === "";
  
    if (usernameNotProvided || passwordNotProvided) {
        const errorMessage = usernameNotProvided
        ? "Please, provide username."
        : "Please, provide password.";
      
        res.render("auth/login-form", {
        errorMessage: "Provide username and password.",
      });
  
      return;
    }
  
    let user;
    // Check if the user exists
    User.findOne({ username: username })
      .then((foundUser) => {
        user = foundUser;
  
        if (!foundUser) {
          throw new Error("Wrong credentials");
        }
  
        // Compare the passwords
        return bcrypt.compare(password, foundUser.password);
      })
      .then((isCorrectPassword) => {
        if (!isCorrectPassword) {
          throw new Error("Wrong credentials");
        } else if (isCorrectPassword) {
          
          req.session.user = user;
          res.redirect("/");
        }
      })
      .catch((err) => {
        res.render("auth/login-form", {
          errorMessage: err.message || "Provide username and password.",
        });
      });
  });

  // The GET / logout

 
  router.get("/logout", isLoggedIn, (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.render("error");
        }
        res.redirect("/");
  });
});

// The GET / main (protected route)

router.get("/main", isLoggedIn, (req, res) => {
    res.render("main", { user: req.session.user });
  });
  
  // The GET / private (protected route)
  router.get("/private", isLoggedIn, (req, res) => {
    res.render("private", { user: req.session.user });
  });

module.exports = router;