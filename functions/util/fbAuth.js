const { admin, db } = require("./admin");

const FBAuth = (req, res, next) => {
  let idToken;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    idToken = req.headers.authorization.split("Bearer ")[1];
    admin
      .auth()
      .verifyIdToken(idToken)
      .then(decodedToken => {
        req.user = decodedToken;
        return db
          .collection("users")
          .doc(req.user.uid)
          .get();
      })
      .then(doc => {
        req.user.nutrition = {
          maxCalories: doc.data().maxCalories,
          minCalories: doc.data().minCalories,
          maxProtein: doc.data().maxProtein,
          minProtein: doc.data().minProtein,
          maxCarbs: doc.data().maxCarbs,
          minCarbs: doc.data().minCarbs,
          maxFat: doc.data().maxFat,
          minFat: doc.data().minFat
        };
        return next();
      })
      .catch(err => {
        console.error("Error while verifying token ", err);
        return res.status(403).json(err);
      });
  } else {
    console.error("No token found");
    return res.status(403).json({ error: "Unauthorized" });
  }
};

module.exports = { FBAuth };
