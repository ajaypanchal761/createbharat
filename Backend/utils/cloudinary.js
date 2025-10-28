const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string} filePath - Path to the file on local filesystem
 * @param {string} folder - Cloudinary folder name
 * @param {string} public_id - Custom public_id for the image
 * @returns {Promise<Object>} - Upload result
 */
const uploadToCloudinary = async (filePath, folder = 'loan-schemes', public_id = null) => {
  try {
    const uploadOptions = {
      folder: `createbharat/${folder}`,
      resource_type: 'image',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ]
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Delete local file after upload
    const fs = require('fs');
    fs.unlinkSync(filePath);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload image to Cloudinary');
  }
};

/**
 * Delete image from Cloudinary
 * @param {string} public_id - Public ID of the image
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromCloudinary = async (public_id) => {
  try {
    const result = await cloudinary.uploader.destroy(public_id);
    return {
      success: result.result === 'ok',
      message: result.result === 'ok' ? 'Image deleted successfully' : 'Image not found'
    };
  } catch (error) {
    console.error('Cloudinary delete error:', error);
    throw new Error('Failed to delete image from Cloudinary');
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary
};

