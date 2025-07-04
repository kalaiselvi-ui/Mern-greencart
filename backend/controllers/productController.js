import { v2 as cloudinary } from "cloudinary";
import Product from "../models/Product.js";
import streamifier from "streamifier";

//add product : /api/product/add
export const AddProduct = async (req, res) => {
  try {
    const { name, description, category, price, offerPrice } = req.body;

    const images = req.files;

    const uploadToCloudinary = (fileBuffer) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "greencart", resource_type: "image" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result.secure_url);
          }
        );

        streamifier.createReadStream(fileBuffer).pipe(stream);
      });
    };

    // let imagesUrl = await Promise.all(
    //   images.map(async (item) => {
    //     let result = await cloudinary.uploader.upload(item.path, {
    //       folder: "greencart",
    //       resource_type: "image",
    //     });
    //     return result.secure_url;
    //   })
    // );
    const imageUrls = await Promise.all(
      req.files.map((file) => uploadToCloudinary(file.buffer))
    );

    console.log("Description from req.body:", req.body.description);

    await Product.create({
      name,
      description,
      category,
      price,
      offerPrice,
      image: imageUrls,
    });
    res.json({ success: true, message: "Product Added" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//get all products :/api/product/list
export const productList = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json({ success: true, products });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
//get single products :/api/product/id
export const productById = async (req, res) => {
  try {
    const { id } = req.body;
    const product = await Product.findById({ id });
    res.json({ success: true, product });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

//change product instock : /api/product/stock
export const changeStock = async (req, res) => {
  try {
    const { id, inStock } = req.body;
    await Product.findByIdAndUpdate(id, { inStock });
    res.json({ success: true, message: "stock updated" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export const getProductId = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.json({ product });
  } catch (err) {
    res.status(500).json({ message: "Product not found" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const updated = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, message: "Product updated", product: updated });
  } catch (err) {
    res.status(500).json({ message: "Failed to update" });
  }
};
