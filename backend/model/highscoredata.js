
import mongoose from 'mongoose';
const { Schema } = mongoose;

const highScoreSchema = new Schema({
  user: {
    type: String,
    required: true
  },
  score: {
    type: Number,
    required: true
  }
});

const HighScore = mongoose.model('HighScore', highScoreSchema);

export { highScoreSchema, HighScore };