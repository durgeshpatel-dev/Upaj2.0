const router = require('express').Router();
const { protect } = require('../middlewares/auth.middleware');
const { simpleChatAsk } = require('../controllers/simpleChat.controller');

router.post('/ask', protect, simpleChatAsk);

module.exports = router;
