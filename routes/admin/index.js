const express = require('express');
const router = express.Router();

// Basic admin route for testing
router.get('/test', (req, res) => {
  res.json({
    message: 'Admin routes are working!',
    timestamp: new Date().toISOString()
  });
});

// Add your actual admin routes here when you have them
// Example:
// const authRouter = require('./auth/auth');
// const categoryRouter = require('./categories/category');
// router.use('/', authRouter);
// router.use('/', categoryRouter);

module.exports = router;