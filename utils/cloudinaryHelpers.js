const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const cloudinaryUploadBuffer = (buffer, folderName = "") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: folderName,
      },
      (error, result) => {
        if (error) {
          return reject(error);
        }
        resolve(result);
      }
    );
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
