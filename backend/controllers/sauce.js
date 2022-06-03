const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
  const sauceObject = req.file ?
    {
     ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    likes : 0,
    dislikes: 0,
    usersLiked: [],
    usersDisliked: [],
    } : { ...req.body.sauce };
  
    console.log(sauceObject);

    delete sauceObject._id;

  const sauce = new Sauce(sauceObject,{
    ...sauceObject
  },
  );
  sauce.save()
  .then(() => res.status(201).json({message: 'sauce ajoutée'}))
  .catch(error => res.status(400).json({error: 'impossible de charger la sauce'}));
  
}

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
    // Si la modification ne contient pas de nouvelle image
    sauceObject = {
      ...req.body
    }
  )
  Sauce.updateOne(
      {
        _id: req.params.id
      }, {
        ...sauceObject,
        _id: req.params.id
      }
    )
    .then(() => res.status(200).json({
      message: 'Sauce modifiée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }));
}

exports.deleteSauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const filename = sauce.imageUrl.split('/images/')[1]
      fs.unlinkSync(`images/${filename}`)
    }),
    sauceObject = {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${
        req.file.filename
      }`,
    }
  ) : ( // Opérateur ternaire équivalent à if() {} else {} => condition ? Instruction si vrai : Instruction si faux
    // Si la modification ne contient pas de nouvelle image
    sauceObject = {
      ...req.body
    }
  )
  Sauce.deleteOne(
      {
        _id: req.params.id
      }, {
        ...sauceObject,
        _id: req.params.id
      }
    )
    .then(() => res.status(200).json({
      message: 'Sauce supprimée !'
    }))
    .catch((error) => res.status(400).json({
      error
    }));
}

exports.getOneSauce = (req,res,next) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      res.status(200).json(sauce)
      console.log(sauce);
    })
    .catch(error => res.status(404).json({ error }));
}

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then(sauces => {
    res.status(200).json(sauces)
    console.log(sauces);
})
  .catch(error => res.status(200).json({error}));  
}

exports.likesDislikes = (req,res,next) => {
let like = req.body.like
let userId = req.body.userId
let sauceId = req.params.id

if (like === 1) {
  Sauce.updateOne({
    _id: sauceId
  },{
    $push: {
      usersLiked: userId
    }, $inc: {
    likes: +1
  },
})
.then(() => res.status(200).json({message: 'Vous avez aimé la sauce !'}))
.catch((error) => res.status(400).json({error}))
}
if ( like === -1) {
  Sauce.updateOne({
    _id: sauceId
  }, {
    $push: {
      usersDisliked: userId
    }, $inc: {
      dislikes: +1
    }
  })
  .then(() => res.status(200).json({message: "vous n'aimez pas la sauce !"}))
  .catch((error) => res.status(400).json({error}))
}
if ( like === 0) {
  Sauce.findOne({
    _id: sauceId
  })
  .then((sauce) => {
    if(sauce.usersLiked.includes(userId)) {
      Sauce.updateOne({
        _id: sauceId
      }, {
        $pull: {
          usersLiked: userId
        }, $inc: {
          likes: -1
        },
      })
      .then(() => res.status(200).json({message: "Vous avez retiré votre mention Like! "}))
      .catch((error) => res.status(400).json({error}))
    }
    if(sauce.usersDisliked.includes(userId)) {
      Sauce.updateOne({
        _id: userId
      }, {
        $pull: {
          usersDisliked: userId
        }, $inc: {
          dislikes: -1
        },
      })
      .then(() => res.status(200).json({message: "Vous avez retiré votre mention dislike!"}))
      .catch((error) => res.status(400).json({error}))
    }
  })
}
}
