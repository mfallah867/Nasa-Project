import mongoose from 'mongoose';

const launchesSchema = mongoose.Schema({
	spacexFlightNumber: {
		type: Number,
	},

	flightNumber: {
		type: Number,
		require: true,
	},
	mission: {
		type: String,
		require: true,
	},
	launchDate: {
		type: Date,
		require: true,
	},
	target: {
		type: String,
	},
	// target: {
	// 	type: mongoose.ObjectId,
	//  ref: 'Planet',
	// 	require: true,
	// },
	rocket: {
		type: String,
		require: true,
	},
	customers: {
		type: [String],
		default: ['ZTM', 'NASA'],
	},
	success: {
		type: Boolean,
		require: true,
		default: true,
	},
	upcoming: {
		type: Boolean,
		require: true,
		default: true,
	},

	latestSpaceX: {
		type: Boolean,
	},
});

// Connects luanchesSchema with the "launches" collection
const launchesModel = mongoose.model('Launch', launchesSchema);

export default launchesModel;
