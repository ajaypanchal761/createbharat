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
 * Upload resume/document to Cloudinary
 * @param {string} filePath - Path to the file on local filesystem
 * @param {string} folder - Cloudinary folder name
 * @param {string} public_id - Custom public_id for the document
 * @returns {Promise<Object>} - Upload result
 */
const uploadResumeToCloudinary = async (filePath, folder = 'resumes', public_id = null) => {
  try {
    console.log('=== CLOUDINARY RESUM UPLOAD ===');
    console.log('File path:', filePath);
    console.log('Folder:', folder);
    console.log('Public ID:', public_id);

    const uploadOptions = {
      folder: `createbharat/${folder}`,
      resource_type: 'raw', // Use 'raw' for PDF/DOC files
      use_filename: true,
      unique_filename: false,
      access_mode: 'public', // Ensure public access for viewing/downloading
      type: 'upload' // Explicit upload type for public access
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    console.log('Upload options:', {
      folder: uploadOptions.folder,
      resource_type: uploadOptions.resource_type,
      access_mode: uploadOptions.access_mode,
      type: uploadOptions.type,
      hasPublicId: !!uploadOptions.public_id
    });
    console.log('⚠️ IMPORTANT: access_mode is set to "public" - file will be downloadable');

    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    console.log('Cloudinary upload result:', {
      url: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type,
      format: result.format,
      bytes: result.bytes,
      access_mode: result.access_mode || 'public' // Check if returned in result
    });
    console.log('✅ Resume uploaded successfully with PUBLIC access mode');
    console.log('=== CLOUDINARY RESUM UPLOAD SUCCESS ===');

    // Delete local file after upload
    const fs = require('fs');
    fs.unlinkSync(filePath);

    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      bytes: result.bytes,
      resource_type: result.resource_type
    };
  } catch (error) {
    console.error('=== CLOUDINARY RESUM UPLOAD ERROR ===');
    console.error('Cloudinary resume upload error:', error);
    console.error('Error message:', error.message);
    console.error('Error details:', error);
    if (error.http_code) {
      console.error('HTTP code:', error.http_code);
    }
    console.error('⚠️ Failed to upload resume - access_mode may not be set correctly');
    throw new Error('Failed to upload resume to Cloudinary');
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
  uploadResumeToCloudinary,
  deleteFromCloudinary
};

