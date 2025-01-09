import mongoose from 'mongoose';

export type User = {
  _id: string;
  fullName: string;
  email: string;
  contact: string;
  isAdmin: boolean;
};

const UserSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      // required: true,
      default: null,
    },
    contact: {
      type: String,
      required: true,
      unique: true,
    },
    isAdmin: { type: Boolean, required: true, default: false },
  },
  { timestamps: true },
);

const UserModel = mongoose.models?.User || mongoose.model('User', UserSchema);

export default UserModel;
