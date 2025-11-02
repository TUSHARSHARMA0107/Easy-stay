import multer from "multer";

const storage = multer.memoryStorage(); // store in memory before upload
const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // limit to 2MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Only JPEG and PNG are allowed"));
    }
    cb(null, true);
  },
});

export default upload;