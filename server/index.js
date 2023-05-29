const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const authRoute = require("./routes").auth;
const courseRoute = require("./routes").course;

const cors = require("cors");

const passport = require("passport");
// 在此处直接执行passport文件中的passport function，此处将上述引入的passport套件传入给passport文件中，passport function将调用此passport套件执行程序
require("./config/passport")(passport);

mongoose
  .connect("mongodb://localhost:27017/mernDB")
  .then(() => {
    console.log("connected to mongoDB...");
  })
  .catch((e) => {
    console.log(e);
  });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRoute);
// course router 应该被JWT保护，即当request header内部没有JWT， 则request就会被视为unauthorized
app.use(
  "/api/courses",
  passport.authenticate("jwt", { session: false }),
  courseRoute
);

// 只有登陆系统的人，才能够去新增课程/注册课程
// 因此，每次通过JWT验证的人，才有权限注册课程
// 利用passport-jwt来实现

app.listen(8080, () => {
  console.log("The server is run in port 8080");
});
