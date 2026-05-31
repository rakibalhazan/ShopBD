import Category from '../models/Category.js';

// GET /api/categories — public
export const getCategories = async (req, res) => {
  try {
    const filter = req.query.all === 'true' ? {} : { isActive: true };
    const cats   = await Category.find(filter).sort({ sortOrder: 1, createdAt: 1 });
    res.json({ categories: cats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/categories/:id — public
export const getCategoryById = async (req, res) => {
  try {
    const cat = await Category.findById(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json({ category: cat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/categories — admin only
export const createCategory = async (req, res) => {
  try {
    const { name, icon, description, sortOrder } = req.body;
    if (!name?.en) return res.status(400).json({ error: 'English name is required' });

    const cat = await Category.create({ name, icon, description, sortOrder });
    res.status(201).json({ category: cat, message: 'Category created' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// PUT /api/categories/:id — admin only
export const updateCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true, runValidators: true,
    });
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json({ category: cat, message: 'Category updated' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE /api/categories/:id — admin only
export const deleteCategory = async (req, res) => {
  try {
    const cat = await Category.findByIdAndDelete(req.params.id);
    if (!cat) return res.status(404).json({ error: 'Category not found' });
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
