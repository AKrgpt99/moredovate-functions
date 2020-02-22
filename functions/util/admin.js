const admin = require("firebase-admin");

const config = {
  credential: admin.credential.cert(
    require("./moredovate-firebase-adminsdk-86lf7-3326dcb4da")
  ),
  databaseURL: "https://moredovate.firebaseio.com"
};
admin.initializeApp(config);

const db = admin.firestore();

module.exports = { admin, db };
