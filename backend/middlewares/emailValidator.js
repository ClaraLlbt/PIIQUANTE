const emailValidate = require('mongoose-validator');

exports.emailValidator = [
    emailValidate({
        validator: 'matches',
        arguments: /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/i,
        message: "Veuillez entrer une adresse email correcte"
    })
]