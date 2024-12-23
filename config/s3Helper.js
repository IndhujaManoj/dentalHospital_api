


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
