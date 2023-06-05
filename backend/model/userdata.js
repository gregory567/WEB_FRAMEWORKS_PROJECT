
import mongoose from 'mongoose';
const { Schema } = mongoose;

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  postalCode: {
    type: String,
    required: true
  }
});

const User = mongoose.model("User", userSchema);

export { userSchema, User };
