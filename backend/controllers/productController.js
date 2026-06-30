import { v2 as cloudinary } from "cloudinary";
import productModel from "../models/productModel.js";
import cache from "../config/cache.js";
import logger from "../config/logger.js";

// ============ ADD PRODUCT (ADMIN) ============
const addProduct = async (req, res) => {
  try {
    const { name, description, price, category, subCategory, sizes, bestseller } = req.body;

    const image1 = req.files.image1 && req.files.image1[0];
    const image2 = req.files.image2 && req.files.image2[0];
    const image3 = req.files.image3 && req.files.image3[0];
    const image4 = req.files.image4 && req.files.image4[0];

    const images = [image1, image2, image3, image4].filter((item) => item !== undefined);

    const imagesUrl = await Promise.all(
      images.map(async (item) => {
        const result = await cloudinary.uploader.upload(item.path, {
          resource_type: "image"
        });
        return result.secure_url;
      })
    );

    const productData = {
      name,
      description,
      price: Number(price),
      category,
      subCategory,
      bestseller: bestseller === "true" ? true : false,
      sizes: JSON.parse(sizes),
      image: imagesUrl,
      date: Date.now()
    };

    const product = new productModel(productData);
    await product.save();

    // Clear cache when new product is added
    cache.flushAll();
    logger.info(`New product added: ${name}`);

    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    logger.error(`Add product error: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// ============ LIST PRODUCTS WITH PAGINATION + CACHING ============
const listProducts = async (req, res) => {
  try {
    // Get query parameters
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const category = req.query.category;
    const subCategory = req.query.subCategory;
    const search = req.query.search;
    const sortBy = req.query.sortBy || "date"; // date, price-asc, price-desc
    const all = req.query.all === "true"; // Get all (for backward compatibility)

    // Cache key based on query
    const cacheKey = `products_${page}_${limit}_${category || "all"}_${subCategory || "all"}_${search || "none"}_${sortBy}_${all}`;

    // Check cache first
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache HIT: ${cacheKey}`);
      return res.json(cachedData);
    }

    // Build query
    const query = {};
    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (search) {
      query.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }

    // Sort
    let sort = { date: -1 }; // Default: newest first
    if (sortBy === "price-asc") sort = { price: 1 };
    if (sortBy === "price-desc") sort = { price: -1 };

    // If "all=true" (for backward compatibility), return all products
    if (all) {
      const products = await productModel.find(query).sort(sort);
      const response = { success: true, products };

      // Cache for 5 minutes
      cache.set(cacheKey, response, 300);
      return res.json(response);
    }

    // Pagination
    const skip = (page - 1) * limit;
    const totalProducts = await productModel.countDocuments(query);
    const products = await productModel
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalProducts / limit);

    const response = {
      success: true,
      products,
      pagination: {
        currentPage: page,
        totalPages,
        totalProducts,
        productsPerPage: limit,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    // Cache for 5 minutes
    cache.set(cacheKey, response, 300);
    logger.info(`Cache SET: ${cacheKey}`);

    res.json(response);
  } catch (error) {
    logger.error(`List products error: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// ============ REMOVE PRODUCT (ADMIN) ============
const removeProduct = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.body.id);

    // Clear cache when product is removed
    cache.flushAll();
    logger.info(`Product removed: ${req.body.id}`);

    res.json({ success: true, message: "Product Removed" });
  } catch (error) {
    logger.error(`Remove product error: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

// ============ SINGLE PRODUCT ============
const singleProduct = async (req, res) => {
  try {
    const { productId } = req.body;

    // Check cache
    const cacheKey = `product_${productId}`;
    const cached = cache.get(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const product = await productModel.findById(productId);
    const response = { success: true, product };

    cache.set(cacheKey, response, 600); // 10 minutes
    res.json(response);
  } catch (error) {
    logger.error(`Single product error: ${error.message}`);
    res.json({ success: false, message: error.message });
  }
};

export { addProduct, listProducts, removeProduct, singleProduct };