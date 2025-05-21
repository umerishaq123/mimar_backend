const express = require('express');
const router = express.Router();
const { getAllUsers } = require('../conttrollers/user_controller');
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, getAllUsers);

module.exports = router;
