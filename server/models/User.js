import mongoose from 'mongoose';
import bcrypt   from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone:    { type: String, trim: true },
  role:     { type: String, enum: ['customer', 'admin'], default: 'customer' },
  address: {
    division: String,
    district: String,
    upazila:  String,
    street:   String,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare plain vs hashed
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

export default mongoose.model('User', userSchema);
