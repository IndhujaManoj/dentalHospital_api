// const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');
// require('dotenv').config();

// const s3Client = new S3Client({
//   region: process.env.AWS_REGION,
//   credentials: {
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   },
// });

// // Function to delete an image from S3
// const deleteFromS3 = async (fileUrl) => {
//   const fileKey = fileUrl.split('/').pop();  // Extract file name from URL

//   const deleteParams = {
//     Bucket: process.env.AWS_BUCKET_NAME,
//     Key: `smiles/${fileKey}`, // The S3 path where the file is stored
//   };

//   try {
//     const deleteResult = await s3Client.send(new DeleteObjectCommand(deleteParams));
//     console.log(`Successfully deleted: ${fileKey}`);
//     return deleteResult;
//   } catch (err) {
//     console.error("Error deleting from S3:", err);
//     throw new Error("Error deleting image from S3");
//   }
// };

// module.exports = { deleteFromS3 };





const { S3Client, DeleteObjectCommand } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const deleteFromS3 = async (imageUrl) => {
  try {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: imageUrl.split(".amazonaws.com/")[1], // Extract the image key from the URL
    };

    const command = new DeleteObjectCommand(params);
    await s3Client.send(command);
    console.log(`Successfully deleted: ${imageUrl}`);
  } catch (err) {
    console.error("Error deleting from S3", err);
    throw new Error("Error deleting from S3");
  }
};

module.exports = { deleteFromS3 };
