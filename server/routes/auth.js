const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;

router.use((req, res, next) => {
  console.log("is receiving a require which related to auth");
  next();
});

router.get("/testAPI", (req, res) => {
  return res.send("Success connected auth route...");
});

router.post("/register", async (req, res) => {
  console.log("register");
  //   console.log(req.body);
  //   console.log(registerValidation(req.body));
  let { error } = registerValidation(req.body);
  //   console.log(error);
  // register check if valid
  if (error) return res.status(400).send(error.details[0].message);
  // check email if laready registed
  const emailExit = await User.findOne({ email: req.body.email });
  if (emailExit) return res.status(400).send("This email already registered");

  // make new user
  let { email, username, password, role } = req.body;
  let newUser = new User({ email, username, password, role });
  try {
    let savedUser = await newUser.save();
    return res.send({
      msg: "Success Register and Save",
      savedUser,
    });
  } catch (e) {
    return res.statusCode(500).send("Cannot save this user");
  }
});

module.exports = router;
