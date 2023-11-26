import { createReadStream } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join, dirname } from 'node:path';

import { parse } from 'csv-parse';

import planetDatabase from './planets.mongo.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function isHabitable(planet) {
	return (
		planet['koi_disposition'] === 'CONFIRMED' &&
		planet['koi_prad'] < 1.6 &&
		planet['koi_insol'] > 0.36 &&
		planet['koi_insol'] < 1.1
	);
}

function loadPlanets() {
	return new Promise((resolve, reject) => {
		createReadStream(join(__dirname, '..', '..', 'data', 'kepler_data.csv'))
			.pipe(parse({ columns: true, comment: '#' }))
			.on('data', async planet => {
				if (isHabitable(planet)) {
					savePlanet(planet);
				}
			})
			.on('error', err => {
				console.log(err);
				reject(err);
			})
			.on('end', async () => {
				const countPlanetsFound = (await getAllPlanets()).length;
				console.log(`${countPlanetsFound} planets found`);
				resolve();
			});
	});
}

async function getAllPlanets() {
	return await planetDatabase.find({}, { _id: 0, __v: 0 });
}

async function getOnePlanet(id) {
	return await planetDatabase.findOne({ kepid: planet.kepid });
}

async function savePlanet(planet) {
	//update + insert = upsert
	return await planetDatabase.updateOne(
		{ keplerName: planet.kepler_name },
		{ keplerName: planet.kepler_name },
		{ upsert: true }
	);
}

export { getAllPlanets, getOnePlanet, loadPlanets };
