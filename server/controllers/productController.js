import Product from '../models/Product.js';

// GET /api/products — public, with search / filter / sort / pagination
export const getProducts = async (req, res) => {
  try {
    const {
      search, category, minPrice, maxPrice,
      minRating, sort = 'createdAt',
      page = 1, limit = 12,
      featured, active,
    } = req.query;

    const filter = {};

    // Only show active products to public; admin sees all
    if (req.user?.role !== 'admin') filter.isActive = true;
    else if (active !== undefined)   filter.isActive = active === 'true';

    if (category)  filter.category = category;
    if (featured)  filter.isFeatured = featured === 'true';
    if (minRating) filter.rating = { $gte: +minRating };

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = +minPrice;
      if (maxPrice) filter.price.$lte = +maxPrice;
    }

    // Full-text search across name, description, tags
    if (search) {
      filter.$text = { $search: search };
    }

    const sortMap = {
      newest:      { createdAt: -1 },
      oldest:      { createdAt:  1 },
      'price-low': { price:  1 },
      'price-high':{ price: -1 },
      popular:     { sold:  -1 },
      rating:      { rating:-1 },
      createdAt:   { createdAt:-1 },
    };
    const sortObj = sortMap[sort] || sortMap.newest;

    const skip  = (parseInt(page) - 1) * parseInt(limit);
    const total = await Product.countDocuments(filter);
    const prods = await Product.find(filter)
      .populate('category', 'name icon slug')
      .sort(sortObj)
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      products: prods,
      pagination: {
        total, page: +page, limit: +limit,
        pages: Math.ceil(total / +limit),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/products/:id — public
export const getProductById = async (req, res) => {
  try {
    const prod = await Product.findById(req.params.id)
      .populate('category', 'name icon slug');
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: prod });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/products — admin only
export const createProduct = async (req, res) => {
  try {
    const {
      name, description, price, originalPrice,
      category, images, video, features, tags,
      badge, stock, isActive, isFeatured,
    } = req.body;

    if (!name?.en)  return res.status(400).json({ error: 'Product English name is required' });
    if (!price)     return res.status(400).json({ error: 'Price is required' });

    const prod = await Product.create({
      name, description, price, originalPrice,
      category, images, video, features, tags,
      badge, stock, isActive, isFeatured,
    });

    await prod.populate('category', 'name icon slug');
    res.status(201).json({ product: prod, message: 'Product created successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/products/:id — admin only
export const updateProduct = async (req, res) => {
  try {
    const prod = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    }).populate('category', 'name icon slug');
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: prod, message: 'Product updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/products/:id — admin only
export const deleteProduct = async (req, res) => {
  try {
    const prod = await Product.findByIdAndDelete(req.params.id);
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/products/:id/stock — admin only (quick stock update)
export const updateStock = async (req, res) => {
  try {
    const { stock } = req.body;
    if (stock === undefined) return res.status(400).json({ error: 'Stock value required' });
    const prod = await Product.findByIdAndUpdate(
      req.params.id, { stock }, { new: true }
    );
    if (!prod) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: prod, message: 'Stock updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
