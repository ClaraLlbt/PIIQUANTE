const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const helmet = require('helmet');
const session = require('cookie-session');
const nocache = require('nocache');
const userRoutes = require('./routes/user');
const saucesRoutes = require('./routes/sauce');

mongoose.connect('mongodb+srv://Clara:Kobe1310@piiquante.onzv9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
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
    domain: 'http://localhost:3000',
    expires: expiryDate
  }
}));

app.use(bodyParser.json());

app.use(helmet());
app.use(nocache());

app.use('/api/sauces', saucesRoutes);
app.use('/api/auth/', userRoutes);
app.use('/images', express.static(path.join(__dirname, 'images')));

module.exports = app;