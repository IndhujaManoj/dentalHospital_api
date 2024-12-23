const express = require("express");
const router = express.Router();
const { uploadToS3 } = require("../middleware/multer");
const { Image } = require("../models/imageModel");
const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const { deleteFromS3 } = require('../config/s3Helper'); // The delete helper we just created

// Multer Setup for handling multiple files
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "beforeImage", maxCount: 1 },
  { name: "afterImage", maxCount: 1 },
  { name: "beforeImage2", maxCount: 1 },
  { name: "afterImage2", maxCount: 1 },
]);

// S3 Client setup
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Image upload route
router.post("/upload/smile", upload, async (req, res) => {
  try {
    const { category } = req.body;
    const { beforeImage, afterImage, beforeImage2, afterImage2 } = req.files;

    if (!beforeImage || !afterImage) {
      return res.status(400).json({ message: "Both before and after images are required." });
    }

    // Check if images already exist in the category
    const existingImages = await Image.findOne({ category });

    if (existingImages) {
      // If images already exist, delete them from S3
      if (existingImages.beforeImageUrl) {
        await deleteFromS3(existingImages.beforeImageUrl);
      }
      if (existingImages.afterImageUrl) {
        await deleteFromS3(existingImages.afterImageUrl);
      }
      if (existingImages.beforeImage2Url) {
        await deleteFromS3(existingImages.beforeImage2Url);
      }
      if (existingImages.afterImage2Url) {
        await deleteFromS3(existingImages.afterImage2Url);
      }

      // Remove existing image from DB
      await Image.deleteOne({ category });
    }

    // Upload new images to S3
    const uploadedBeforeImage = await uploadToS3(beforeImage[0]);
    const uploadedAfterImage = await uploadToS3(afterImage[0]);

    let uploadedBeforeImage2, uploadedAfterImage2;
    if (beforeImage2 && afterImage2) {
      uploadedBeforeImage2 = await uploadToS3(beforeImage2[0]);
      uploadedAfterImage2 = await uploadToS3(afterImage2[0]);
    }

    // Save image data to MongoDB
    const newSmile = new Image({
      category,
      beforeImageUrl: uploadedBeforeImage.Location,
      afterImageUrl: uploadedAfterImage.Location,
      beforeImage2Url: uploadedBeforeImage2 ? uploadedBeforeImage2.Location : null,
      afterImage2Url: uploadedAfterImage2 ? uploadedAfterImage2.Location : null,
    });

    await newSmile.save();

    return res.status(200).json({ success: true, message: "Images uploaded and old images deleted successfully." });
  } catch (err) {
    console.error("Error in upload:", err);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
});

// Route to fetch images by category
router.get("/smiles/:category", async (req, res) => {
  try {
    const { category } = req.params;

    // Fetch images from MongoDB for the given category
    const images = await Image.find({ category });

    if (images.length === 0) {
      return res.status(404).json({ success: false, message: "No images found for this category" });
    }

    res.status(200).json({ success: true, category: images });
  } catch (error) {
    console.error("Error fetching images", error);
    res.status(500).json({ success: false, message: "Error fetching images", error });
  }
});

// Route to fetch all categories and images
router.get("/smiles", async (req, res) => {
  try {
    const allImages = await Image.find();

    if (allImages.length === 0) {
      return res.status(404).json({ success: false, message: "No images uploaded yet." });
    }

    res.status(200).json({ success: true, categories: allImages });
  } catch (error) {
    console.error("Error fetching all images", error);
    res.status(500).json({ success: false, message: "Error fetching images", error });
  }
});

// DELETE Route to delete image
router.delete("/smiles/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id, "Image ID received for deletion");

    // Fetch image from DB
    const image = await Image.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    // Delete from S3
    if (image.beforeImageUrl) {
      await deleteFromS3(image.beforeImageUrl);
    }
    if (image.afterImageUrl) {
      await deleteFromS3(image.afterImageUrl);
    }
    if (image.beforeImage2Url) {
      await deleteFromS3(image.beforeImage2Url);
    }
    if (image.afterImage2Url) {
      await deleteFromS3(image.afterImage2Url);
    }

    // Remove from DB using deleteOne()
    await Image.deleteOne({ _id: id });

    return res.status(200).json({
      success: true,
      message: "Image deleted successfully.",
      deletedImage: image,
    });
  } catch (err) {
    console.error("Error deleting image:", err);
    return res.status(500).json({ success: false, message: "Error deleting image." });
  }
});

module.exports = router;
