const mongoose = require("mongoose");
const { Schema } = mongoose;
const bcrypt = require("bcrypt");

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },

  email: {
    type: String,
    required: true,
    minLength: 6,
    maxLength: 50,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["student", "instructor"],
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

userSchema.methods.isStudent = function () {
  return this.role == "student";
};
userSchema.methods.isInstructor = function () {
  return this.role == "instructor";
};

//
userSchema.methods.comparePassword = async function (password, cd) {
  let result;
  try {
    result = await bcrypt.compare(password, this.password);
    return cd(null, result);
  } catch (e) {
    return cd(e, result);
  }
};

// mongoose middleware, 若user为新用户，或正在更改密码，则将密码进行杂凑处理
userSchema.pre("save", async function (next) {
  // 不可以使用arrow function，因为会找不到this是谁
  // this代表mongoDB中的document
  if (this.isNew || this.isModified("password")) {
    // 将密码进行杂凑处理
    const hasValue = await bcrypt.hash(this.password, 10);
    this.password = hasValue;
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
