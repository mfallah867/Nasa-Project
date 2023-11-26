import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import express from 'express';

import cors from 'cors';
import morgan from 'morgan';

import { v1Router } from './routers/api.mjs';

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(function (req, res, next) {
	const start = Date.now();
	next();
	// console.log(`${req.originalUrl} ${req.method} ${Date.now() - start}ms`);
});

app.use(cors({ origin: 'http://localhost:3000' }));
app.use(
	morgan('combined', {
		// Only error cases are loged in
		skip: function (req, res) {
			return res.statusCode < 400;
		},
	})
);

app.use(express.json());

app.use('/v1', v1Router);

app.get('/index.html', (req, res) => {
	res.redirect('/');
});

app.use(express.static(join(__dirname, '..', 'public')));
app.get('/*', (req, res) => {
	return res.sendFile(join(__dirname, '..', 'public', 'index.html'));
});

export default app;
