const API_URL = 'http://localhost:4000/v1';

// Load planets and return as JSON.
async function httpGetPlanets() {
	const response = await fetch(`${API_URL}/planets`);
	return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
	const response = await fetch(`${API_URL}/launchs`);
	const launchs = await response.json();
	return launchs.sort((a, b) => a.flightNumber - b.flightNumber);
}

// Submit given launch data to launch system.
async function httpSubmitLaunch(launch) {
	try {
		return await fetch(`${API_URL}/launchs`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(launch),
		});
	} catch (error) {
		return { ok: false };
	}
}

// Delete launch with given ID.
async function httpAbortLaunch(id) {
	try {
		return await fetch(`${API_URL}/launchs/${id}`, { method: 'DELETE' });
	} catch (error) {
		return { ok: false };
	}
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
