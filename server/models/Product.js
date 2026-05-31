import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    en: { type: String, required: true, trim: true },
    bn: { type: String, trim: true, default: '' },
  },
  slug: { type: String, unique: true, sparse: true },

  description: {
    en: { type: String, trim: true, default: '' },
    bn: { type: String, trim: true, default: '' },
  },

  price:         { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },

  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },

  // Multiple image URLs (Google Drive, Imgur, etc.)
  images: [{ type: String, trim: true }],

  // Video URL — YouTube, Google Drive, etc.
  video: { type: String, trim: true, default: '' },

  // Key features listed as bullet points
  features: [{ type: String, trim: true }],

  // Hidden tags for search/SEO — customers don't see these
  tags: [{ type: String, lowercase: true, trim: true }],

  // Display badge — "New", "Hot", "Best Seller", "Top Rated", etc.
  badge: { type: String, trim: true, default: '' },

  stock:       { type: Number, default: 0, min: 0 },
  sold:        { type: Number, default: 0 },
  rating:      { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0 },

  isActive:   { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
}, { timestamps: true });

// Auto-generate slug from English name
productSchema.pre('save', function (next) {
  if (this.isModified('name.en') || !this.slug) {
    this.slug =
      this.name.en.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') +
      '-' + Date.now();
  }
  next();
});

// Full-text search index (name, description, tags)
productSchema.index({
  'name.en':        'text',
  'name.bn':        'text',
  'description.en': 'text',
  tags:             'text',
});

export default mongoose.model('Product', productSchema);
