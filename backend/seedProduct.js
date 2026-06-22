import dotenv from "dotenv";
import connectDB from "./config/mongodb.js";
import productModel from "./models/productModel.js";

dotenv.config();

const seedProduct = async () => {
  try {
    await connectDB();

    const product = await productModel.create({
      name: "Test Shirt",
      description: "Simple test shirt created by seed script",
      price: 999,
      image: [
        "https://via.placeholder.com/400x400.png?text=Test+Shirt"
      ],
      category: "Men",
      subCategory: "Shirts",
      sizes: ["S", "M", "L"],
      bestseller: false,
      date: Date.now()
    });

    console.log("Product created:", product._id);
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error.message);
    process.exit(1);
  }
};

seedProduct();