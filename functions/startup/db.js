
const admin = require('firebase-admin');

var serviceAccount = require("../acumenstudents-permission.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://acumenstudents.firebaseio.com"
});

module.exports = admin.firestore();


