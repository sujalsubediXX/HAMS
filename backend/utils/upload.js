// upload.js or in your controller file
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../frontend/public"); // resolves absolute path
  },
  filename: (req, file, cb) => {
    const newName = Date.now() + "-" + file.originalname;
    cb(null, newName);
  },
});


export const Upload = multer({ storage });
