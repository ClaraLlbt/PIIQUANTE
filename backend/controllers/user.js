// Importation des packages 'bcrypt' et 'jsonwebtoken'
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importation de la variable environnement
require('dotenv').config();

// Importation du modele User
const User = require('../models/User');

// Importation de l'outil Password 
const { isPasswordValid, validationMessages } = require('../utils/Password');
const { encrypt, decrypt } = require ('../utils/Email');

exports.signup = (req, res, next) => {
  // Vérification de la validité du mot de passe
  if (!isPasswordValid(req.body.password)) {
    return res.status(400).json({
      message: validationMessages(req.body.password)
    });
  }

  // Utilise la méthode hash de bcrypt pour hasher et saler le mot de passe
  // sel = 10  nombre de fois que sera executé l'algorythme de hashage
  // Enfin un nouvel utilisateur est créé et stocké sur la BD
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      const user = new User({
        email: encrypt(req.body.email),
        password: hash
      })
      user.save()
        .then(() => res.status(201).json({ message: 'Utilisateur créé !' + user}))
        .catch(error => res.status(400).json({ error }));
        console.log(user);
    })
    .catch(error => res.status(500).json({ error: error }));
};

  exports.login = (req, res, next) => {
    User.findOne({ email: encrypt(req.body.email)})
      .then(user => {
        // Si l'adresse email ne correspond à aucun utilisateur de la BD, une erreur est renvoyée
        if (!user) {
          return res.status(404).json({ error: 'Utilisateur non trouvé !' });
        }
        // Sinon Bcrypt compare le mot de passe entré par l'utilisateur avec le mot de passe haché de la BD
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            // S'ils ne correspondent pas, une erreur est renvoyée
            if (!valid) {
              return res.status(401).json({ error: 'Mot de passe incorrect !' });
            }
            // Sinon l'utilisateur est authentifié et un token lui est adressé pour accéder au service
            res.status(200).json({
              userId: user._id,
              token : jwt.sign(
                { userId: user._id },
                process.env.SECRET_KEY,
                { expiresIn : '24h'}
              )
            });
            console.log(user);
          })
          .catch(error => res.status(500).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };