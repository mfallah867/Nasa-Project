import axios from 'axios';

import launchesDatabase from './launchs.mongo.mjs';
import planetsDatabase from './planets.mongo.mjs';

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';
const DEFAULT_FLIGHT_NUMBER = 100;

// const launch = {
// 	flightNumber: 100, // flight_number
// 	mission: 'ZTM EXP2', // name
// 	launchDate: new Date('May 13, 2027'), // date_local
// 	target: 'Kepler-442 b', //
// 	rocket: 'SN-90', // rocket.name
// 	customers: ['ZTM', 'NASA'], // payloads
// 	success: true, // success
// 	upcoming: true, // upcoming
// };

// saveLaunch(launch);

///////////////////////////////////////////
// Return all launches
async function getAllLaunchs(limit, skip) {
	return await launchesDatabase
		.find({}, { _id: 0, __v: 0 })
		.limit(limit)
		.skip(skip)
		.sort({ flightNumber: 1 });
}

//////////////////////////////////////
// Generic find function
async function findLaunch(filter) {
	return await launchesDatabase.findOne(filter, { _id: 0, __v: 0 });
}

//////////////////////////////////////
// Return one launch by flightNumber as id
async function getOneLaunch(launchId) {
	return await findLaunch({ flightNumber: launchId });
}

////////////////////////////////////////
// Retrun last flightNumber
async function getLatestFlightNumber() {
	const latestLuanch = await launchesDatabase
		.findOne({})
		.sort('-flightNumber');

	if (!latestLuanch) {
		return DEFAULT_FLIGHT_NUMBER;
	}

	return latestLuanch.flightNumber;
}

/////////////////////////////////////////////////
// Abort launch
async function removeLaunch(launchId) {
	const aborted = await launchesDatabase.updateOne(
		{ flightNumber: launchId },
		{ upcoming: false, success: false }
	);

	return aborted.modifiedCount === 1;
}

/////////////////////////////////////////////
// Save a launch if target a habitabel planet
async function saveLaunch(launch) {
	await launchesDatabase.findOneAndUpdate(
		{ flightNumber: launch.flightNumber },
		launch,
		{ upsert: true }
	);
}

///////////////////////////////////////
// Add new launch
async function scheduleNewLaunch(launch) {
	const planet = await planetsDatabase.findOne({
		keplerName: launch.target,
	});

	if (!planet) {
		throw new Error('No maching planet found!');
	}

	const newFlightNumber = (await getLatestFlightNumber()) + 1;
	Object.assign(launch, {
		flightNumber: newFlightNumber,
		customers: ['SpaceX', 'Skybot'],
		success: true,
		upcoming: true,
	});

	await saveLaunch(launch);
}

//////////////////////////////////////////////
// Populate launches collection
async function populateLuanches() {
	const response = await axios.post(SPACEX_API_URL, {
		query: {},
		options: {
			pagination: false,
			sort: 'flightNumber',
			populate: [
				{
					path: 'rocket',
					select: 'name',
				},
				{
					path: 'payloads',
					select: 'customers',
				},
			],
		},
	});

	if (response.status !== 200) {
		throw Error('Launch data download failed!');
	}

	const spacexLaunches = response.data.docs;
	const latestFlightNumber = await getLatestFlightNumber();

	spacexLaunches.forEach((launch, index, arr) => {
		const customers = launch.payloads.flatMap(payload => payload.customers);
		let currentFlightNumber = latestFlightNumber + index;
		const newLaunch = {
			spacexFlightNumber: launch.flight_number,
			flightNumber: currentFlightNumber,
			mission: launch.name,
			launchDate: launch.date_local,
			rocket: launch.rocket.name,
			customers: customers,
			success: launch.success,
			upcoming: launch.upcoming,
		};

		if (index === arr.length - 1) {
			newLaunch.latestSpaceX = true;
		}

		saveLaunch(newLaunch);
	});
}

///////////////////////////////////////////////
// Load SpaceX launches if they don't exist
async function loadLaunches() {
	const firstLaunch = await findLaunch({
		mission: 'FalconSat',
		rocket: 'Falcon 1',
		spacexFlightNumber: 1,
	});

	if (firstLaunch) {
		console.log('SpaceX launch data already loaded');
	} else {
		console.log('Populating launches collection with spacex data');
		await populateLuanches();
	}
}

export {
	getAllLaunchs,
	getOneLaunch,
	removeLaunch,
	scheduleNewLaunch,
	loadLaunches,
};
