import { model, Schema } from 'mongoose';
import { emailRegexp } from '../../constants/users.js';

const usersSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, match: emailRegexp, required: true, unique: true },
    password: { type: String, required: true },
  },
  { timestamps: true, versionKey: false },
);

usersSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UsersCollection = model('users', usersSchema);

export default UsersCollection;
