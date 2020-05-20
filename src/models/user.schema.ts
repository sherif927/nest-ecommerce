import * as bcrypt from 'bcrypt';
import * as mongoose from 'mongoose';

export const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true
  },
  password: {
    type: String,
    select: false,
  },
  seller: {
    type: Boolean,
    default: false,
  },
  address: {
    addr1: String,
    addr2: String,
    city: String,
    state: String,
    country: String,
    zip: Number,
  },
  created: { type: Date, default: Date.now },
});

UserSchema.pre('save', async function (next: mongoose.HookNextFunction) {
  if (!this.isModified('password')) return next();
  this['password'] = await bcrypt.hash(this['password'], 10).catch(err => next(err));
  return next();
});