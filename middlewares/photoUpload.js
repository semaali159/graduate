const multer = require("multer");

const storage = multer.memoryStorage();

const photoUpload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
      console.log("sooc");
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  },
  limits: { fileSize: 1024 * 1024 },
});

module.exports = photoUpload;
