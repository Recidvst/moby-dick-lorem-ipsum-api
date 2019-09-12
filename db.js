const mongoose = require('mongoose');
mongoose.Promise = global.Promise; // allow Promise use
// config/env
require('dotenv').config();

// define db endpoints
let mongoMobyURL = process.env.MONGO_URL_MOBY;
if ( process.env.NODE_ENV === 'production' ) {
  mongoMobyURL = process.env.MONGO_LIVE_MOBY;
}
let mongoAliceURL = process.env.MONGO_URL_ALICE;
if ( process.env.NODE_ENV === 'production' ) {
  mongoAliceURL = process.env.MONGO_LIVE_ALICE;
}

// create two db connections
var mobyMongooseConnection = mongoose.createConnection(mongoMobyURL, { useNewUrlParser: true });
var aliceMongooseConnection = mongoose.createConnection(mongoAliceURL, { useNewUrlParser: true });

// test connections
mobyMongooseConnection.on('connected', () => {
  console.log('Mongoose connected to Moby db at ' + mongoMobyURL);
});
aliceMongooseConnection.on('connected', () => {
  console.log('Mongoose connected to Alice db at ' + mongoAliceURL);
});

// error handling
mobyMongooseConnection.on('error', console.error.bind(console, 'MongoDB (moby) connection error:'));
aliceMongooseConnection.on('error', console.error.bind(console, 'MongoDB (alice) connection error:'));

// export the connections
module.exports = {
  mobyMongooseConnection: mobyMongooseConnection,
  aliceMongooseConnection: aliceMongooseConnection
};
