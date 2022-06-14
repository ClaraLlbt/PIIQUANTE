const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
require('mongoose-type-email');
const sanitizerPlugin = require('mongoose-sanitizer');

const userSchema = mongoose.Schema({
  email: { type: String, required: [true, "Veuillez entrer votre adresse email"], unique: true},
  password: { type: String, required: true}
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(sanitizerPlugin);

module.exports = mongoose.model('User', userSchema);