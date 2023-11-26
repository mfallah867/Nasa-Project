import request from 'supertest';
import jest from 'jest';

import app from '../../app.mjs';
import { mongoConnect, mongoDisconnect } from '../../services/mongo.mjs';

describe('Test Planets API', () => {
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test GET /planets', () => {
		// Test for get all planets
		test('GET all planets, It should return 200 success and an array of launch', async () => {
			const response = await request(app)
				.get('/planets')
				.expect('Content-Type', /json/)
				.expect(200);

			expect(Array.isArray(response.body)).toBe(true);
		});
	});
});
