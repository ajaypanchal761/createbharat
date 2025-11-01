const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');

/**
 * Get GridFS bucket for resumes
 * @returns {GridFSBucket} - GridFS bucket
 */
const getGridFSBucket = () => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName: 'resumes' });
};

/**
 * Upload file to GridFS
 * @param {string} filePath - Path to the file on local filesystem
 * @param {string} filename - Name of the file
 * @returns {Promise<Object>} - Upload result
 */
const uploadToGridFS = async (filePath, filename) => {
  try {
    const bucket = getGridFSBucket();
    
    // Create write stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType: 'application/pdf'
    });

    return new Promise((resolve, reject) => {
      const readStream = fs.createReadStream(filePath);
      
      readStream.pipe(uploadStream);

      uploadStream.on('finish', async () => {
        console.log(`File ${filename} uploaded to GridFS with id: ${uploadStream.id}`);
        
        // Delete local file after upload
        fs.unlinkSync(filePath);
        
        resolve({
          success: true,
          fileId: uploadStream.id.toString(),
          filename: filename
        });
      });

      uploadStream.on('error', (err) => {
        console.error('GridFS upload error:', err);
        reject(new Error('Failed to upload file to GridFS'));
      });

      readStream.on('error', (err) => {
        console.error('File read error:', err);
        reject(new Error('Failed to read local file'));
      });
    });
  } catch (error) {
    console.error('GridFS upload error:', error);
    throw new Error('Failed to upload file to GridFS');
  }
};

/**
 * Get file from GridFS
 * @param {string} fileId - ID of the file in GridFS
 * @returns {Promise<Buffer>} - File data
 */
const getFromGridFS = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);
    
    return new Promise((resolve, reject) => {
      const chunks = [];
      const downloadStream = bucket.openDownloadStream(objectId);
      
      downloadStream.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      downloadStream.on('end', () => {
        console.log(`File ${fileId} downloaded from GridFS`);
        resolve(Buffer.concat(chunks));
      });
      
      downloadStream.on('error', (err) => {
        console.error('GridFS read error:', err);
        reject(new Error('Failed to read file from GridFS'));
      });
    });
  } catch (error) {
    console.error('GridFS read error:', error);
    throw new Error('Failed to read file from GridFS');
  }
};

/**
 * Delete file from GridFS
 * @param {string} fileId - ID of the file in GridFS
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromGridFS = async (fileId) => {
  try {
    const bucket = getGridFSBucket();
    const objectId = new mongoose.Types.ObjectId(fileId);
    
    await bucket.delete(objectId);
    console.log(`File ${fileId} deleted from GridFS`);
    
    return {
      success: true,
      message: 'File deleted successfully'
    };
  } catch (error) {
    console.error('GridFS delete error:', error);
    throw new Error('Failed to delete file from GridFS');
  }
};

module.exports = {
  uploadToGridFS,
  getFromGridFS,
  deleteFromGridFS
};

