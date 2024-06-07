const express = require("express");
// const {
//   getUserValidator,
//   createUserValidator,
//   updateUserValidator,
//   deleteUserValidator,
//   changeUserPasswordValidator,
//   updateLoggedUserValidator,
// } = require("../utils/validators/userValidator");

const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changeUserPassword,
  getLoggedUserData,
  updateLoggedUserPassword,
  updateLoggedUserData,
  deleteLoggedUserData,
} = require("../services/userService");

const authService = require("../services/authService");

const router = express.Router();

router.use(authService.protect);

router.get("/getMe", getLoggedUserData, getUser);
router.put("/changeMyPassword", updateLoggedUserPassword);
router.put("/updateMe", updateLoggedUserData);
router.delete("/deleteMe", deleteLoggedUserData);

// Admin
router.use(authService.allowedTo("admin"));
// router.put(
//   "/changePassword/:id",
//   changeUserPasswordValidator,
//   changeUserPassword
// );

router.route("/").get(getUsers).post(createUser);
router.route("/:id").get(getUser).put(updateUser).delete(deleteUser);

module.exports = router;
