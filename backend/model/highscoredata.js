

import mongoose from 'mongoose';
const { Schema } = mongoose;

const highscoreSchema = new Schema({
  user: String, // String is shorthand for {type: String}
  score: Number
});