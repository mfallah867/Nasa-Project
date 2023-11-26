import process from 'node:process';

import mongoose from 'mongoose';

// const MONGO_URL =
// 	'mongodb+srv://nasa:LhsCSvifBV2620Xo@nasacluster.lqc4gvd.mongodb.net/nasa?retryWrites=true&w=majority';
const MONGO_URL = process.env.MONGO_URL;

mongoose.connection.once('open', () => {
	console.log('Connected to database...');
});

mongoose.connection.on('error', error => {
	console.log(error);
});

mongoose.connection.on('close', () => {
	console.log('Database disconnected!');
});

async function mongoConnect() {
	await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
	await mongoose.connection.close();
}

export { mongoConnect, mongoDisconnect };
