const express = require('express');
const { adminLogin } = require('../../../controllers/admin/auth/auth.js');
const router = express.Router();

router.post('/login', adminLogin);

module.exports = router;
