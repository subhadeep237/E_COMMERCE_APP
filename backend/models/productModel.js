import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true, // 🚀 Index for search
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    index: true, // 🚀 Index for price filtering/sorting
  },
  image: {
    type: Array,
    required: true
  },
  category: {
    type: String,
    required: true,
    index: true, // 🚀 Index for category filter
  },
  subCategory: {
    type: String,
    required: true,
    index: true, // 🚀 Index for subCategory filter
  },
  sizes: {
    type: Array,
    required: true
  },
  bestseller: {
    type: Boolean,
    index: true, // 🚀 Index for bestseller filter
  },
  date: {
    type: Number,
    required: true,
    index: true, // 🚀 Index for sorting by date
  }
});

// 🚀 Compound index for common queries
productSchema.index({ category: 1, subCategory: 1 });
productSchema.index({ name: "text", description: "text" }); // Full-text search

const productModel = mongoose.models.product || mongoose.model("product", productSchema);

export default productModel;