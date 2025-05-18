const Router = require("express")

const router = new Router()


const regController = require('../controller/regController')


router.post("/registration", regController.register)
router.post("/login", regController.login)
router.post("/resetpass", regController.resetPasswordRequest)
router.post('/reset-password', regController.resetPassword)
router.post('/logout', regController.logout);



module.exports = router