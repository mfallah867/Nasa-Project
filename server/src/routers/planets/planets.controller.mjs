import { getAllPlanets, getOnePlanet } from '../../models/planets.model.mjs';

async function httpGetAllPlanets(req, res) {
	res.status(200).json(await getAllPlanets());
}

async function httpGetOnePlanet(req, res) {
	const id = Number(req.params.planetId);
	const planet = await getOnePlanet();
	if (!planet) {
		return res.status(404).json({ error: 'planet not found!' });
	}

	return res.status(200).json(planet);
}

export { httpGetAllPlanets, httpGetOnePlanet };
