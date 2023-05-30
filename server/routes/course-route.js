const router = require("express").Router();
const Course = require("../models").course;
const courseValidation = require("../validation").courseValidation;

router.use((req, res, next) => {
  console.log("course route is accepting a request");
  next();
});

// 获得系统中所有的课程
router.get("/", async (req, res) => {
  // populate("instructor");表示用instructor找到和instructor的资料
  // ["username", "email", "password"] :拿到instructor中的这些属性
  try {
    let courseFound = await Course.find({})
      .populate("instructor", ["username", "email"])
      .exec();
    console.log(courseFound);
    if (courseFound.length == 0) {
      return res
        .status(403)
        .send(
          "You haven's upload any course, please add, then serach in there"
        );
    }
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 用instructor ID 寻找其课程
router.get("/instructor/:_instructor_id", async (req, res) => {
  let { _instructor_id } = req.params;
  let coursesFound = await Course.find({ instructor: _instructor_id })
    .populate("instructor", ["username", "email"])
    .exec();

  console.log(coursesFound);

  return res.send(coursesFound);
});

// 用student id寻找注册过的课程
router.get("/student/:_student_id", async (req, res) => {
  let { _student_id } = req.params;
  let coursesFound = await Course.find({ students: _student_id })
    .populate("instructor", ["username", "email"])
    .exec();
  return res.send(coursesFound);
});

// 用课程id寻找课程
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  // console.log({ _id });
  try {
    let courseFound = await Course.findOne({ _id })
      .populate("instructor", ["email"])
      .exec();
    console.log(courseFound);
    if (!courseFound) {
      return res.status(403).send("Cannot find this Course, please try again");
    }
    return res.send(courseFound);
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 新增课程

router.post("/", async (req, res) => {
  // 注册课程之前，需要检查课程是否符合规范
  let { error } = courseValidation(req.body);
  console.log("error");
  if (error) return res.status(400).send(error.details[0].message);
  console.log("check if is student");
  if (req.user.isStudent()) {
    return res
      .status(400)
      .send(
        "Only instructor can upload new course, if you are instructor, please login with instructor email ans upload"
      );
  }

  let { title, description, price } = req.body;
  console.log(title, description, price);
  try {
    let newCourse = new Course({
      title,
      description,
      price,
      instructor: req.user._id,
    });
    // 上述的req.user_is即为我们刚刚在passport验证过的id

    let savedCourse = await newCourse.save();
    return res.send({
      msg: "New course saved",
      savedCourse,
    });
  } catch (e) {
    return res.status(500).send("Cannot upload a new course");
  }
});

// 更新课程
router.patch("/:_id", async (req, res) => {
  // 验证数据是否符合规范
  let { error } = courseValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  // 确认课程是否存在
  let { _id } = req.params;
  // console.log({ _id });
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("Cannot find this course, please try again");
    }
    // 更新课程，
    if (courseFound.instructor.equals(req.user._id)) {
      // 使用者必须是此课程讲师才可以更新
      let updatedCourse = await Course.findOneAndUpdate({ _id }, req.body, {
        new: true,
        runValidators: true,
      });
      return res.send({
        msg: "Update success",
        updatedCourse,
      });
    } else {
      return res
        .status(403)
        .send(
          "Only the instructor who upload can change the content of this course"
        );
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});

// 删除课程
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  try {
    let courseFound = await Course.findOne({ _id });
    if (!courseFound) {
      return res.status(400).send("Cannot find this course, please try again");
    }
    // 更新课程，
    if (courseFound.instructor.equals(req.user._id)) {
      // 使用者必须是此课程讲师才可以删除
      await Course.deleteOne({ _id }).exec();
      return res.send("Success delete");
    } else {
      return res
        .status(403)
        .send("Only the instructor who upload can delete this course");
    }
  } catch (e) {
    return res.status(500).send(e);
  }
});
module.exports = router;
