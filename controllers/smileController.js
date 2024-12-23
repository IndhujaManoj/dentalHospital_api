// controllers/smileController.js
const { uploadToS3 } = require("../config/multer");  // Import the upload function
const Smile = require("../models/smileModel");  // Model to save image info to DB

// Function to handle image upload
const uploadSmileImage = async (req, res) => {
  const { beforeImage, afterImage, beforeImage2, afterImage2 } = req.files;

  if (!beforeImage || !afterImage) {
    return res.status(400).json({ message: "Both before and after images are required." });
  }

  const category = req.body.category;

  try {
    // Upload before and after images to S3
    const beforeImageUrl = await uploadToS3(beforeImage[0]);
    const afterImageUrl = await uploadToS3(afterImage[0]);
    
    let beforeImage2Url = null;
    let afterImage2Url = null;

    if (beforeImage2 && afterImage2) {
      beforeImage2Url = await uploadToS3(beforeImage2[0]);
      afterImage2Url = await uploadToS3(afterImage2[0]);
    }

    // Save image info to MongoDB
    const newSmileImage = new Smile({
      category,
      beforeImageUrl: beforeImageUrl.Location,
      afterImageUrl: afterImageUrl.Location,
      beforeImage2Url: beforeImage2Url,
      afterImage2Url: afterImage2Url,
    });

    await newSmileImage.save();

    res.status(201).json({ message: "Images uploaded successfully", data: newSmileImage });
  } catch (error) {
    console.error("Error uploading smile images:", error);
    res.status(500).json({ message: "Error uploading images" });
  }
};

// Fetch images by category
const getImagesByCategory = async (req, res) => {
  const { category } = req.params;
  try {
    const images = await Smile.find({ category });
    res.status(200).json({ images });
  } catch (error) {
    console.error("Error fetching images by category:", error);
    res.status(500).json({ message: "Error fetching images" });
  }
};

// Fetch all categories and images
const getAllCategoriesWithImages = async (req, res) => {
  try {
    const categories = await Smile.aggregate([
      { $group: { _id: "$category", images: { $push: "$$ROOT" } } },
    ]);
    res.status(200).json({ categories });
  } catch (error) {
    console.error("Error fetching all categories and images:", error);
    res.status(500).json({ message: "Error fetching categories" });
  }
};

const deleteSmileImage = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedImage = await Smile.findByIdAndDelete(id);

    if (!deletedImage) {
      return res.status(404).json({ message: "Smile image not found" });
    }

    res.status(200).json({ message: "Smile image deleted successfully", data: deletedImage });
  } catch (error) {
    console.error("Error deleting smile image:", error);
    res.status(500).json({ message: "Error deleting smile image" });
  }
};
module.exports = {
  uploadSmileImage,
  getImagesByCategory,
  getAllCategoriesWithImages,
  deleteSmileImage // Include the delete function here

};
