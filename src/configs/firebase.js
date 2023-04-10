import admin from 'firebase-admin'

const serviceAccount = require('./food-app-24bf2-043fc26edecc.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://food-app-24bf2-default-rtdb.firebaseio.com',
    storageBucket: 'food-app-24bf2.appspot.com'
})

const storage = admin.storage().bucket()

export {
    storage
}