const Sauce = require('../models/Sauce');
const auth = require('../middlewares/auth')

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
  .catch(error => res.status(400).json({error: error}));
  
}

exports.modifySauce = (req, res, next) => {
  let sauceObject = {};
  req.file ? (
    Sauce.findOne({
      _id: req.params.id
    }).then((sauce) => {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      if(sauce.userId !== userId){
        res.status(403).json({message: "Action non autorisée"})
      } 
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
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
      const userId = decodedToken.userId;
      if(sauce.userId !== userId){
        res.status(403).json({message: "Action non autorisée"})
      }
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
  if (req.body.like === 1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { likes: req.body.like++ },
        $push: { usersLiked: req.body.userId },
      }
    )
      .then((sauce) => res.status(200).json({ message: "Un like de plus !" }))
      .catch((error) => res.status(400).json({ error }));
  } else if (req.body.like === -1) {
    Sauce.updateOne(
      { _id: req.params.id },
      {
        $inc: { dislikes: req.body.like++ * -1 },
        $push: { usersDisliked: req.body.userId },
      }
    )
      .then((sauce) =>
        res.status(200).json({ message: "Un dislike de plus !" })
      )
      .catch((error) => res.status(400).json({ error }));
  }  else {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce.usersLiked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            { $pull: { usersLiked: req.body.userId }, $inc: { likes: -1 } }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Un like de moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        } else if (sauce.usersDisliked.includes(req.body.userId)) {
          Sauce.updateOne(
            { _id: req.params.id },
            {
              $pull: { usersDisliked: req.body.userId },
              $inc: { dislikes: -1 },
            }
          )
            .then((sauce) => {
              res.status(200).json({ message: "Un dislike de moins !" });
            })
            .catch((error) => res.status(400).json({ error }));
        }
      })
      .catch((error) => res.status(400).json({ error }));
  }
}