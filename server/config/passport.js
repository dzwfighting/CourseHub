// 利用passport-jwt实现用户登录验证

// 直接粘贴即可
let JwtStrategy = require("passport-jwt").Strategy;
let ExtractJwt = require("passport-jwt").ExtractJwt;
// --------------------------------------------------
const User = require("../models").user;

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log(jwt_payload);
      /**
       * 在postman中输入url：http://localhost:8080/api/courses post，点击header，将Key设置为Authorization， value设置为用户登录时，给的token：
       * JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDY5YThmZDRkYWZjNTZlZWE1ZDI4YjMiLCJlbWFpbCI6Inlpd2VuNzk0M0BnbWFpbC5jb20iLCJpYXQiOjE2ODQ4MTcxNzZ9.SC9ZZm24JOjzmryWWbkUi9PmrGrtxS1uZhQTcSd5PNE
       * 点击send
       * 将会输出：
        {
            _id: '6469a8fd4dafc56eea5d28b3',
            email: 'yiwen7943@gmail.com',
            iat: 1684817176
        }
        */
      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();
        if (foundUser) {
          // 将foundUser带入到req.user
          console.log("can find founduser");
          done(null, foundUser);
        } else {
          console.log("cannot find founduser");
          done(null, false);
        }
      } catch (e) {
        console.log("directly wrong");
        return done(e, false);
      }
    })
  );
};
