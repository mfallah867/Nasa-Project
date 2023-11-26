import express from 'express';

import { httpGetAllPlanets, httpGetOnePlanet } from './planets.controller.mjs';

const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);
planetsRouter.get('/:planetId', httpGetOnePlanet);

export default planetsRouter;
