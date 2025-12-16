const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload image to Cloudinary
 * @param {string|Buffer} filePathOrDataUri - Path to the file on local filesystem or data URI/buffer
 * @param {Object} options - Upload options (folder, resource_type, public_id)
 * @returns {Promise<Object>} - Upload result
 */
const uploadToCloudinary = async (filePathOrDataUri, options = {}) => {
  try {
    // Handle options as either folder string or object
    let folder = 'loan-schemes';
    let resource_type = 'auto';
    let public_id = null;

    if (typeof options === 'string') {
      // Legacy: options is just folder string
      folder = options;
    } else if (typeof options === 'object') {
      folder = options.folder || folder;
      resource_type = options.resource_type || resource_type;
      public_id = options.public_id || null;
    }

    const uploadOptions = {
      folder: `createbharat/${folder}`,
      resource_type: resource_type,
      transformation: resource_type === 'image' ? [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' }
      ] : undefined
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    // Check if it's a data URI or file path
    const isDataUri = typeof filePathOrDataUri === 'string' && filePathOrDataUri.startsWith('data:');
    
    let result;
    if (isDataUri) {
      // Upload data URI directly
      result = await cloudinary.uploader.upload(filePathOrDataUri, uploadOptions);
    } else {
      // Upload file path
      result = await cloudinary.uploader.upload(filePathOrDataUri, uploadOptions);
      
      // Delete local file after upload (only if it's a file path)
      const fs = require('fs');
      if (fs.existsSync(filePathOrDataUri)) {
        fs.unlinkSync(filePathOrDataUri);
      }
    }

    return {
      success: true,
      secure_url: result.secure_url,
      url: result.secure_url,
      public_id: result.public_id,
      format: result.format,
      width: result.width,
      height: result.height,
      bytes: result.bytes
    };
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw new Error('Failed to upload file to Cloudinary');
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
      access_mode: 'public' // Ensure public access for viewing/downloading
    };

    if (public_id) {
      uploadOptions.public_id = public_id;
    }

    console.log('Upload options:', {
      folder: uploadOptions.folder,
      resource_type: uploadOptions.resource_type,
      access_mode: uploadOptions.access_mode,
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
      access_mode: result.access_mode || 'NOT RETURNED'
    });
    
    // Verify upload succeeded
    if (!result.secure_url) {
      throw new Error('Cloudinary upload failed: no secure_url returned');
    }
    
    console.log('✅ Resume uploaded successfully');
    console.log('📋 Uploaded with access_mode:', result.access_mode || 'default (may be public)');
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
  deleteFromCloudinary,
  cloudinary // Export configured cloudinary instance
};

