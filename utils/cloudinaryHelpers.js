const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const cloudinaryUploadBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream((error, result) => {
      console.log("Reached callback"); // هل تُطبع؟
      if (error) {
        console.error("Upload error:", error);
        return reject(error);
      }
      console.log("Upload result:", result);
      resolve(result);
    });
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

const cloudinaryRemoveImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (err) {
    console.error(err);
    throw new Error("Error deleting image from Cloudinary");
  }
};

module.exports = {
  cloudinaryUploadBuffer,
  cloudinaryRemoveImage,
};
