import { createServer } from 'node:http';
import process from 'node:process';
import cluster from 'node:cluster';
import os from 'node:os';

import 'dotenv/config';

import app from './app.mjs';
import { mongoConnect } from './services/mongo.mjs';
import { loadPlanets } from './models/planets.model.mjs';
import { loadLaunches } from './models/launchs.model.mjs';

const PORT = process.env.PORT || 4000;

const server = createServer();

server.on('request', app);

// if (cluster.isPrimary) {
// 	console.log(`Primary process has been started with pid=${process.pid}`);
// 	for (const cpu of os.cpus()) {
// 		cluster.fork();
// 	}
// } else {
// 	console.log(`Worker process started with pid=${process.pid}`);
// 	async function startServer() {
// 		await loadPlanets();
// 		server.listen(PORT, () => {
// 			console.log(`Server is listening on port ${PORT}...`);
// 		});
// 	}

// 	startServer();
// }

async function startServer() {
	try {
		await mongoConnect();
	} catch (err) {
		console.error(`Can not connect to database: ${err}`);
	}

	try {
		await loadLaunches();
	} catch (err) {
		console.error(`Can not load spaceX launches ${err}`);
	}

	try {
		await loadPlanets();
		server.listen(PORT, () => {
			console.log(`Server is listening on port ${PORT}...`);
		});
	} catch (err) {
		console.error(`Can not load planets: ${err}`);
	}
}

startServer();
