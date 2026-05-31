import Order   from '../models/Order.js';
import Product from '../models/Product.js';
import User    from '../models/User.js';

// GET /api/admin/stats
export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalCustomers,
      pendingOrders,
      revenueAgg,
      recentOrders,
      lowStockProds,
      ordersByStatus,
      ordersByPayment,
      weeklyRevenue,
    ] = await Promise.all([

      Order.countDocuments(),
      Product.countDocuments({ isActive: true }),
      User.countDocuments({ role: 'customer' }),
      Order.countDocuments({ status: 'pending' }),

      // Total revenue (delivered orders only)
      Order.aggregate([
        { $match: { status: { $in: ['delivered', 'processing', 'shipped'] } } },
        { $group: { _id: null, total: { $sum: '$total' } } },
      ]),

      // Last 5 orders
      Order.find().sort({ createdAt: -1 }).limit(5),

      // Products with stock ≤ 5
      Product.find({ stock: { $lte: 5 }, isActive: true })
        .select('name stock images')
        .limit(10),

      // Orders grouped by status
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } },
      ]),

      // Orders grouped by payment method
      Order.aggregate([
        { $group: { _id: '$payment.method', count: { $sum: 1 }, revenue: { $sum: '$total' } } },
      ]),

      // Last 7 days revenue
      Order.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
            status: { $in: ['delivered', 'processing', 'shipped'] },
          },
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: '+06:00' } },
            revenue: { $sum: '$total' },
            orders:  { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]),
    ]);

    res.json({
      stats: {
        totalOrders,
        totalProducts,
        totalCustomers,
        pendingOrders,
        totalRevenue: revenueAgg[0]?.total || 0,
      },
      recentOrders,
      lowStockProducts: lowStockProds,
      ordersByStatus:   ordersByStatus.reduce((acc, s) => ({ ...acc, [s._id]: s.count }), {}),
      ordersByPayment:  ordersByPayment.map(p => ({
        method:  p._id,
        count:   p.count,
        revenue: p.revenue,
      })),
      weeklyRevenue,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/admin/users — list all customers
export const getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const users = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .skip((+page - 1) * +limit)
      .limit(+limit);
    const total = await User.countDocuments({ role: 'customer' });
    res.json({ users, pagination: { total, page: +page, pages: Math.ceil(total / +limit) } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
