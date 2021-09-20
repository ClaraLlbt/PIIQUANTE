const mongoose = require('mongoose');

const sauceValidator = require('../middlewares/sauceValidator');

const sauceSchema = mongoose.Schema({
    userId: {type: Object, required: true},
    name: {type: String, required: true, validate: sauceValidator.nameValidator},
    manufacturer: {type: String, required: true, validate: sauceValidator.manufacturerValidator},
    description: {type: String, required: true, validate: sauceValidator.descriptionValidator},
    mainPepper: {type: String, required: true,  validate: sauceValidator.pepperValidator},
    imageUrl: {type: String, required: true},
    heat: {type: Number, required: true},
    likes: {type: Number},
    dislikes: {type: Number},
    usersLiked: {type: [String]},
    usersDisliked: {type: [String]}   
},
);

module.exports = mongoose.model('Sauce', sauceSchema);