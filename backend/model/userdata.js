
import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: String, // String is shorthand for {type: String}
  password: String
});