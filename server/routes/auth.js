const router = require("express").Router();
const registerValidation = require("../validation").registerValidation;
const loginValidation = require("../validation").loginValidation;
const User = require("../models").user;
const jwt = require("jsonwebtoken");

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

router.post("/login", async (req, res) => {
  let { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // check email if register
  const emailExit = await User.findOne({ email: req.body.email });
  if (!emailExit)
    return res
      .status(400)
      .send("This email haven't register, please register, then login");
  emailExit.comparePassword(req.body.password, (err, isMatch) => {
    if (err) return res.status(500).send("err");
    if (isMatch) {
      // 制作json web token
      const tokenObject = { _id: emailExit._id, email: emailExit.email };
      const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
      return res.send({
        msg: "Success login",
        // 以后进行用户登录验证时，会利用到此jwt，输入此token可以获得用户信息
        token: "JWT " + token,
        user: emailExit,
      });
    } else {
      return res.status(401).send("Error password");
    }
  });
});

module.exports = router;
