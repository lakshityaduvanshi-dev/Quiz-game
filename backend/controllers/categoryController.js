const Category = require("../models/Category");
const Question = require("../models/Question");

// @route GET /api/categories?search=&sort=
exports.getCategories = async (req, res) => {
  try {
    const { search = "", sort = "name" } = req.query;
    const filter = search
      ? { $or: [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }] }
      : {};

    const categories = await Category.find(filter).sort(sort === "newest" ? "-createdAt" : "name").lean();

    const counts = await Question.aggregate([{ $group: { _id: "$category", count: { $sum: 1 } } }]);
    const countMap = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));

    const withCounts = categories.map((c) => ({ ...c, questionCount: countMap[String(c._id)] || 0 }));
    res.json(withCounts);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch categories", error: err.message });
  }
};

exports.getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch category", error: err.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    if (!name) return res.status(400).json({ message: "Category name is required" });

    const exists = await Category.findOne({ name });
    if (exists) return res.status(409).json({ message: "A category with this name already exists" });

    const category = await Category.create({ name, description, icon, createdBy: req.user._id });
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to create category", error: err.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description, icon } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { name, description, icon },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: "Failed to update category", error: err.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await Question.deleteMany({ category: req.params.id });
    res.json({ message: "Category and its questions deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete category", error: err.message });
  }
};
