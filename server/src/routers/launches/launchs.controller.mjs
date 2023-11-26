import {
	getAllLaunchs,
	getOneLaunch,
	removeLaunch,
	scheduleNewLaunch,
} from '../../models/launchs.model.mjs';

import { getPagination } from '../../services/query.mjs';

async function httpGetAllLaunchs(req, res) {
	const query = req.query;
	const { skip, limit } = getPagination(query);
	const launchs = await getAllLaunchs(limit, skip);
	return res.status(200).json(launchs);
}

async function httpGetOneLaunchs(req, res) {
	const launchId = Number(req.params.launchId);
	const launch = await getOneLaunch(launchId);

	if (!launch) {
		return res.status(404).json({ error: 'Luanch not found!' });
	}

	return res.status(200).json(launch);
}

async function httpRemoveLaunch(req, res) {
	const launchId = Number(req.params.launchId);
	const launch = await getOneLaunch(launchId);

	if (!launch) {
		return res.status(404).json({ error: 'launch not found!' });
	}

	const aborted = await removeLaunch(launchId);

	if (!aborted) {
		return res.status(400).json({ error: 'Luanch not aborted!' });
	}

	return res.status(200).json({ ok: true });
}

async function httpAddLaunch(req, res) {
	const newLaunch = req.body;

	if (
		!newLaunch.launchDate ||
		!newLaunch.mission ||
		!newLaunch.rocket ||
		!newLaunch.target
	) {
		return res
			.status(400)
			.json({ error: 'Missing required launch property!' });
	}

	// Convert date string to js date object
	newLaunch.launchDate = new Date(newLaunch.launchDate);

	// Check for valid date string
	if (isNaN(newLaunch.launchDate)) {
		return res.status(400).json({ error: 'Invalid date!' });
	}

	if (newLaunch.launchDate.valueOf() < Date.now() + 15552000000) {
		return res.status(400).json({ error: 'The minimum time is 6 month!' });
	}

	await scheduleNewLaunch(newLaunch);
	return res.status(201).json(newLaunch);
}

export {
	httpGetAllLaunchs,
	httpGetOneLaunchs,
	httpRemoveLaunch,
	httpAddLaunch,
};
