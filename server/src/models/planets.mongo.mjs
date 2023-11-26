import mongoose from 'mongoose';

const planetsSchema = mongoose.Schema({
	keplerName: { type: String, require: true },
});

export default mongoose.model('Planet', planetsSchema);
