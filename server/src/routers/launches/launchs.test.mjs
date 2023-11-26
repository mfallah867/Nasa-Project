import request from 'supertest';

import app from '../../app.mjs';
import { mongoConnect, mongoDisconnect } from '../../services/mongo.mjs';

import sum from './sum.mjs';

test('It should return sum of 6 , 8, 19 equal 33', () => {
	expect(sum(6, 8, 19)).toBe(33);
});

describe('Test Luanches API', () => {
	beforeAll(async () => {
		await mongoConnect();
	});

	afterAll(async () => {
		await mongoDisconnect();
	});

	describe('Test GET /launchs', () => {
		// GET all launches
		test('It should return 200 success', async () => {
			const response = await request(app).get('/launchs');
			expect(response.statusCode).toBe(200);
		});

		// GET one launch
		test('It should return 200 success and a launch with id equals 100', async () => {
			const response = await request(app)
				.get('/launchs/100')
				.expect('Content-Type', /json/)
				.expect(200);

			expect(response.body.flightNumber).toBe(100);
		});

		// Error cases
		test('It should return 404 not found for non existent launch with id 99!', async () => {
			const response = await request(app)
				.get('/launchs/99')
				.expect('Content-Type', /json/)
				.expect(404);

			expect(response.body).toEqual({ error: 'Luanch not found!' });
		});
	});

	describe('Test POST /launchs', () => {
		const launchWithoutDate = {
			mission: 'Future life',
			rocket: 'DEJ 20',
			target: 'Kepler-1649 b',
		};

		const launchWithDate = {
			launchDate: 'may 12, 2028',
			...launchWithoutDate,
		};

		const launchWithInvalidDate = {
			launchDate: 'Ordibehesht',
			...launchWithoutDate,
		};

		// Add launch
		test('It should return 201 created and created launch', async () => {
			const response = await request(app)
				.post('/launchs')
				.send(launchWithDate)
				.expect('Content-Type', /json/)
				.expect(201);

			launchWithDate.launchDate = new Date(launchWithDate.launchDate);
			response.body.launchDate = new Date(response.body.launchDate);

			expect(response.body).toMatchObject(launchWithDate);
		});

		// Error cases
		// -Missing required property
		test('Post a new launch without a required property, It should return 400 bad request', async () => {
			const response = await request(app)
				.post('/launchs')
				.send(launchWithoutDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toEqual({
				error: 'Missing required launch property!',
			});
		});

		// Invalid Date
		test('Post a launch with an invalid time string, It should return 400 bad request', async () => {
			const response = await request(app)
				.post('/launchs')
				.send(launchWithInvalidDate)
				.expect('Content-Type', /json/)
				.expect(400);

			expect(response.body).toEqual({ error: 'Invalid date!' });
		});
	});
});

// const can1 = {
// 	flavor: 'grapefruit',
// 	ounces: 12,
// };
// const can2 = {
// 	flavor: 'grapefruit',
// 	ounces: 12,
// };

// describe('the La Croix cans on my desk', () => {
// 	test('have all the same properties', () => {
// 		expect(can1).toEqual(can2);
// 	});
// 	test('are not the exact same can', () => {
// 		expect(can1).toMatchObject(can2);
// 		expect(can1).not.toBe(can2);
// 	});
// });
