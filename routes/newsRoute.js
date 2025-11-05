const express = require('express');
const verifyToken = require('../middleware/auth');
const newsController = require('../controllers/newsController');
const router = express.Router();

router.get('/news', verifyToken, async (req, res) => {
  try {
    const news = await newsController.getNewsForUser(req.user.id);
    res.status(200).json({ news });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
