const express = require('express')
const pageController = require('../controllers/pageController')
const userController = require('../controllers/userController')
const authMiddleware = require('../middlewares/authMiddleware')
const redirectMiddleware = require('../middlewares/redirectMiddleware')

const router = express.Router()

router.route("/").get(redirectMiddleware,pageController.getRegister)
router.route("/private").get(authMiddleware,userController.privateChat)
router.route("/logout").get(pageController.logout)


module.exports = router