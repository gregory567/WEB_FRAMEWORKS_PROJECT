

import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: String, // String is shorthand for {type: String}
  user: String
});