const firebase = require("firebase");

const { db } = require("../util/admin");

const {
  validateSignup1,
  validateSignup2,
  validateLogin
} = require("../util/validators");

const signup1 = (req, res) => {
  const userData = {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      confirmPassword: req.body.confirmPassword,
      birthday: req.body.birthday,
      createdAt: new Date().toISOString()
    },
    { errors, valid } = validateSignup1(userData);

  let token, uid;

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .createUserWithEmailAndPassword(userData.email, userData.password)
    .then(data => {
      uid = data.user.uid;
      return data.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      return db
        .collection("users")
        .doc(uid)
        .create({
          name: userData.name,
          email: userData.email,
          birthday: userData.birthday
        });
    })
    .then(() => {
      return res.status(201).json({ token });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

const signup2 = (req, res) => {
  const userData = {
      weight: req.body.weight,
      height: req.body.height,
      gender: req.body.gender,
      fitnessLevel: req.body.fitnessLevel
    },
    { errors, valid } = validateSignup2(userData);

  if (!valid) {
    return res.status(400).json(errors);
  }

  db.collection("users")
    .doc(req.user.uid)
    .update(userData);
};

const login = (req, res) => {
  const userData = {
      email: req.body.email,
      password: req.body.password
    },
    { errors, valid } = validateLogin(userData);

  if (!valid) {
    return res.status(400).json(errors);
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(userData.email, userData.password)
    .then(data => {
      data.user
        .getIdToken()
        .then(token => {
          return res.json({ token });
        })
        .catch(err => {
          console.error(err);
          return res.status(400).json({ error: err.code });
        });
    });
};

module.exports = { signup1, signup2, login };
