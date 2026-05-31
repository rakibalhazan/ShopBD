import Order   from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderNotification } from '../services/emailService.js';

// POST /api/orders — public (place order)
export const placeOrder = async (req, res) => {
  try {
    const { customer, items, payment, deliveryFee = 0, discount = 0 } = req.body;

    // Validate required fields
    if (!customer?.name || !customer?.phone || !customer?.address?.street)
      return res.status(400).json({ error: 'Customer name, phone and address are required' });
    if (!items?.length)
      return res.status(400).json({ error: 'Order must have at least one item' });
    if (!payment?.method)
      return res.status(400).json({ error: 'Payment method is required' });
    if (['bKash', 'Nagad'].includes(payment.method) && !payment.txnId)
      return res.status(400).json({ error: `Transaction ID required for ${payment.method}` });

    // Calculate totals + reduce stock
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const prod = await Product.findById(item.product);
      if (!prod) return res.status(404).json({ error: `Product not found: ${item.product}` });
      if (prod.stock < item.qty)
        return res.status(400).json({ error: `Not enough stock for: ${prod.name.en}` });

      subtotal += prod.price * item.qty;
      orderItems.push({
        product: prod._id,
        name:    prod.name.en,
        price:   prod.price,
        qty:     item.qty,
        image:   prod.images?.[0] || '',
      });

      // Reduce stock and increment sold
      await Product.findByIdAndUpdate(prod._id, {
        $inc: { stock: -item.qty, sold: item.qty },
      });
    }

    const total = subtotal + deliveryFee - discount;

    const order = await Order.create({
      customer, items: orderItems, payment,
      subtotal, deliveryFee, discount, total,
    });

    // Send email notification (non-blocking)
    sendOrderNotification(order);

    res.status(201).json({
      order: {
        _id:         order._id,
        orderNumber: order.orderNumber,
        total:       order.total,
        status:      order.status,
        payment:     { method: order.payment.method, status: order.payment.status },
      },
      message: 'Order placed successfully!',
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders — admin: all orders with filters
export const getOrders = async (req, res) => {
  try {
    const { status, payMethod, page = 1, limit = 20, search } = req.query;
    const filter = {};

    if (status)    filter.status           = status;
    if (payMethod) filter['payment.method'] = payMethod;
    if (search) {
      filter.$or = [
        { orderNumber:      { $regex: search, $options: 'i' } },
        { 'customer.name':  { $regex: search, $options: 'i' } },
        { 'customer.phone': { $regex: search, $options: 'i' } },
      ];
    }

    const total  = await Order.countDocuments(filter);
    const orders = await Order.find(filter)
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);

    res.json({
      orders,
      pagination: { total, page: +page, limit: +limit, pages: Math.ceil(total / +limit) },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/orders/:id — admin: single order detail
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'name images price');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:id/status — admin: update delivery status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status))
      return res.status(400).json({ error: 'Invalid status value' });

    const order = await Order.findByIdAndUpdate(
      req.params.id, { status }, { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order, message: `Order status updated to ${status}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/orders/:id/payment — admin: verify or reject payment
export const updatePaymentStatus = async (req, res) => {
  try {
    const { paymentStatus } = req.body;
    if (!['pending', 'verified', 'failed'].includes(paymentStatus))
      return res.status(400).json({ error: 'Invalid payment status' });

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { 'payment.status': paymentStatus },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ order, message: `Payment status updated to ${paymentStatus}` });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
