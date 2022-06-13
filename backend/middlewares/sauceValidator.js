const sauceValidate = require('mongoose-validator');

exports.nameValidator = [
    sauceValidate({
        validator: 'isLength',
        arguments: [3, 25],
        message: 'Le nom de la sauce doit contenir entre 3 et 25 caractères'
    }),
    sauceValidate({
        validator: 'matches',
        arguments: /^[a-z\d\-_\s]+$/i,
        message: 'Ne peut contenir que des chiffres et des lettres',
    }),
];

exports.manufacturerValidator = [
    sauceValidate({
        validator: 'isLength',
        arguments: [3, 20],
        message: 'Le nom de marque de la sauce doit contenir entre 3 et 20 caractères',
      }),
      sauceValidate({
        validator: 'matches',
        arguments: /^[a-z\d\-_\s]+$/i,
        message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description de la sauce",
      }),
];

exports.descriptionValidator = [
    sauceValidate({
      validator: 'isLength',
      arguments: [10, 150],
      message: 'La description de la sauce doit contenir entre 10 et 150 caractères',
    }),
    sauceValidate({
      validator: 'matches',
      arguments: /^[A-ZÜ-ü\d\-_'\s]+$/i,
      message: "Vous ne pouvez utiliser que des chiffres et des lettres pour la description de la sauce",
    }),
  ];
  
  exports.pepperValidator = [
    sauceValidate({
      validator: 'isLength',
      arguments: [3, 20],
      message: 'Le principal ingrédient doit contenir entre 3 et 20 caractères',
    }),
    sauceValidate({
      validator: 'isAlphanumeric',
      message: "Ne peut contenir que des caractères alphanumériques entre 3 et 20 caractères",
    }),
  ];
  