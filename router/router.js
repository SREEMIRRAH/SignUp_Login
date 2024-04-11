const express = require('express');
const userController = require('../controller/userController');
const authenticateUser = require('../middleware/authenticate')
const router = express.Router();

router.post('/signup',userController.signup);
router.post('/login',userController.login);
router.use(authenticateUser.authenticateUser);
router.put('/changePassword',userController.changePassword);
router.get('/allUsers',userController.getUsers);

module.exports = router;