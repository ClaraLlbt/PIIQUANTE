const express = require('express');
const router = express.Router();

const sauceCtrl = require('../controllers/user');
const auth = require('../middlewares/auth');
const multer =require('../middlewares/multer-config.js');

router.post('/', auth, multer, sauceCtrl.createSauce);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.post('/:id/like', auth, sauceCtrl.likesDislikes);

module.exports = router;
