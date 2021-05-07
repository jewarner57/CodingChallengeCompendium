const mongoose = require('mongoose');

const { Schema } = mongoose;

const SolutionSchema = new Schema({
  testsolutions: { type: Array, required: true },
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Solution', SolutionSchema);
