import express from 'express';

import {
	httpGetAllLaunchs,
	httpGetOneLaunchs,
	httpRemoveLaunch,
	httpAddLaunch,
} from './launchs.controller.mjs';

const launchsRouter = express.Router();

launchsRouter.get('/', httpGetAllLaunchs);
launchsRouter.get('/:launchId', httpGetOneLaunchs);
launchsRouter.delete('/:launchId', httpRemoveLaunch);
launchsRouter.post('/', httpAddLaunch);

export default launchsRouter;
