import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, trim: true },
    bn: { type: String, trim: true, default: '' },
  },
  slug:        { type: String, unique: true, lowercase: true },
  icon:        { type: String, default: '📦' },   // emoji or image URL
  description: { type: String, trim: true },
  isActive:    { type: Boolean, default: true },
  sortOrder:   { type: Number,  default: 0 },
}, { timestamps: true });

// Auto-generate slug from English name
categorySchema.pre('save', function (next) {
  if (this.isModified('name.en') || !this.slug) {
    this.slug = this.name.en
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
  }
  next();
});

export default mongoose.model('Category', categorySchema);
