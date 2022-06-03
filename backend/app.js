const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const helmet = require('helmet');
const session = require('cookie-session');
const nocache = require('nocache');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

require('dotenv').config();

mongoose.connect(process.env.DB_URI, 
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));

const app = express();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

const expiryDate = new Date(Date.now() + 300000);
app.use(session({
  name: 'session',
  secret: process.env,
  cookie: {
    secure: true,
    httpOnly: true,
    domain: 'http://localhost:8080',
    expires: expiryDate
  }
}));

//Transforme le corps de la requête en objet JS
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(nocache());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth/', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;