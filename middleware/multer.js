const multer = require("multer");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
require("dotenv").config();

// S3 Client setup
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Set up multer for memory storage (no file saved on disk)
const upload = multer({ storage: multer.memoryStorage() });

// Upload files to S3
const uploadToS3 = async (file) => {
  const uploadParams = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `smiles/${Date.now()}_${file.originalname}`,  // Use a unique name for each file
    Body: file.buffer,  // Use the buffer in memory storage
  };

  try {
    const uploadResult = await s3Client.send(new PutObjectCommand(uploadParams));

    // Return the full URL of the uploaded image
    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${uploadParams.Key}`;
    return { Location: fileUrl };  // Return object with the file URL
  } catch (err) {
    console.error("Error uploading to S3", err);
    throw new Error("Error uploading to S3");
  }
};

module.exports = { upload, uploadToS3 };
