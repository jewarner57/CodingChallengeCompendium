const mongoose = require('mongoose');

const { Schema } = mongoose;

const ChallengeSchema = new Schema({
  name: { type: String, required: true },
  difficulty: { type: Number, required: true },
  description: { type: String, required: true },
  hint: { type: String, required: false },
  testcases: { type: Array, required: true },
  testsolutionsID: { type: Schema.Types.ObjectId, ref: 'Solution', required: true },
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  // comapanies
  // datastructures / algorithms used
}, { timestamps: { createdAt: 'created_at' } });

module.exports = mongoose.model('Challenge', ChallengeSchema);
