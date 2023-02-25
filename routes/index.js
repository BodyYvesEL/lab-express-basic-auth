const router = require("express").Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

/* GET home page */
router.get("/", (req, res, next) => {

  let userIsLoggedIn = false;
  if (req.session && req.session.user) {
    userIsLoggedIn = true;
  }
  res.render("index", { userIsLoggedIn: userIsLoggedIn });
});

// Get / private

router.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private-view");
});
module.exports = router;
