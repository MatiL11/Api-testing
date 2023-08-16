const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const { uid } = req.params;
    const fileType =
      file.fieldname === "profile"
        ? "profiles"
        : file.fieldname === "product"
        ? "products"
        : "documents";
    const folderPath = path.join(__dirname, `../uploads/${fileType}/${uid}`);

    try {
      await fs.mkdir(folderPath, { recursive: true });
      cb(null, folderPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const multerUpload = multer({ storage });

module.exports = multerUpload;
