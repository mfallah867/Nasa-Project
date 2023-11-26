import express from 'express';
import planetsRouter from './planets/planets.router.mjs';
import launchsRouter from './launches/launchs.router.mjs';

const v1Router = express.Router();
v1Router.use('/planets', planetsRouter);
v1Router.use('/launchs', launchsRouter);

export { v1Router };
