const express = require("express");
const userController = require("../controllers/userController");
const User = require("../models/User");
const { body } = require("express-validator");
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router();

router.route("/register").post(
  [
    body("name").not().isEmpty().withMessage("Please enter your name!"),
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please enter your username!")
      .custom((userName) => {
        return User.findOne({ username: userName }).then((user) => {
          if (user) {
            return Promise.reject("username already exists!!");
          }
        });
      }),
    body("password").not().isEmpty().withMessage("Please enter a password"),
  ],
  userController.createUser
);

router.route("/login").post(
  [
    body("username")
      .not()
      .isEmpty()
      .withMessage("Please enter username")
      .custom((userName) => {
        return User.findOne({ username: userName }).then((user) => {
          if (!user) {
            return Promise.reject("username is not correct");
          }
        });
      }),
    body("password").not().isEmpty().withMessage("Please enter your password"),
  ],
  userController.loginUser
);


router.route("/:slug").get(authMiddleware,userController.privateChat)
router.route("/message").post(authMiddleware,userController.createMessage)
router.route("/add/:slug").put(authMiddleware,userController.addFriend)
router.route("/accept/:slug").put(authMiddleware,userController.acceptReq)
router.route("/del/:slug").delete(authMiddleware,userController.deleteFriend)


module.exports = router;
