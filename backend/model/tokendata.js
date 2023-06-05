
import mongoose from 'mongoose';
const { Schema } = mongoose;

const tokenSchema = new Schema({
  token: {
    type: String,
    required: true
  },
  user: {
    type: String,
    required: true
  }
});

const Token = mongoose.model('Token', tokenSchema);

export { tokenSchema, Token };
