const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext).replace(/\s+/g, '-');
    cb(null, `${nameWithoutExt}-${uniqueSuffix}${ext}`);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Accept only images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

// Middleware to parse FormData fields after multer
const parseFormDataFields = (req, res, next) => {
  // After multer processes the file, we need to manually parse the other fields
  // This is needed because multer only handles files by default
  if (req.body && Object.keys(req.body).length === 0) {
    // req.body is empty, we need to get the text fields from the request
    // Multer should populate req.body with text fields from FormData
    console.log('Multer parsed body:', req.body);
  }
  next();
};

// Export both upload middleware and parser
module.exports = upload;
module.exports.parseFormData = parseFormDataFields;

