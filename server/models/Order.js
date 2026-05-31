import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:    String,
  price:   Number,
  qty:     { type: Number, min: 1 },
  image:   String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  orderNumber: { type: String, unique: true },

  customer: {
    name:  { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    address: {
      division: String,
      district: { type: String, required: true },
      upazila:  String,
      street:   { type: String, required: true },
    },
    note: String,
  },

  items: { type: [itemSchema], required: true },

  subtotal:    { type: Number, required: true },
  deliveryFee: { type: Number, default: 0 },
  discount:    { type: Number, default: 0 },
  total:       { type: Number, required: true },

  payment: {
    method: {
      type:     String,
      enum:     ['COD', 'bKash', 'Nagad'],
      required: true,
    },
    // pending → verified (admin confirms) / failed (admin rejects)
    status: {
      type:    String,
      enum:    ['pending', 'verified', 'failed'],
      default: 'pending',
    },
    txnId:  { type: String, trim: true },  // bKash / Nagad transaction ID
    number: { type: String, trim: true },  // Customer's bKash / Nagad number
  },

  status: {
    type:    String,
    enum:    ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending',
  },
}, { timestamps: true });

// Auto-generate order number: BD-01001, BD-01002, …
orderSchema.pre('save', async function (next) {
  if (!this.orderNumber) {
    const count = await mongoose.model('Order').countDocuments();
    this.orderNumber = 'BD-' + String(1000 + count + 1).padStart(5, '0');
  }
  next();
});

export default mongoose.model('Order', orderSchema);
