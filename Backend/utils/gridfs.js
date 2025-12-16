const mongoose = require('mongoose');
const { GridFSBucket } = require('mongodb');
const fs = require('fs');

/**
 * Get GridFS bucket
 * @param {string} bucketName - Name of the bucket (default: 'resumes')
 * @returns {GridFSBucket} - GridFS bucket
 */
const getGridFSBucket = (bucketName = 'resumes') => {
  const db = mongoose.connection.db;
  return new GridFSBucket(db, { bucketName });
};

/**
 * Upload file to GridFS
 * @param {string} filePath - Path to the file on local filesystem
 * @param {string} filename - Name of the file
 * @param {string} bucketName - Name of the bucket (default: 'resumes')
 * @param {string} contentType - Content type of the file (default: 'application/pdf')
 * @returns {Promise<Object>} - Upload result
 */
const uploadToGridFS = async (filePath, filename, bucketName = 'resumes', contentType = 'application/pdf') => {
  try {
    const bucket = getGridFSBucket(bucketName);

    // Create write stream
    const uploadStream = bucket.openUploadStream(filename, {
      contentType
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
 * @param {string} bucketName - Name of the bucket (default: 'resumes')
 * @returns {Promise<Buffer>} - File data
 */
const getFromGridFS = async (fileId, bucketName = 'resumes') => {
  try {
    const bucket = getGridFSBucket(bucketName);
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
 * @param {string} bucketName - Name of the bucket (default: 'resumes')
 * @returns {Promise<Object>} - Deletion result
 */
const deleteFromGridFS = async (fileId, bucketName = 'resumes') => {
  try {
    const bucket = getGridFSBucket(bucketName);
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

/**
 * Get file metadata from GridFS
 * @param {string} fileId - ID of the file in GridFS
 * @param {string} bucketName - Name of the bucket (default: 'resumes')
 * @returns {Promise<Object>} - File metadata
 */
const getFileMetadata = async (fileId, bucketName = 'resumes') => {
  try {
    const bucket = getGridFSBucket(bucketName);
    const objectId = new mongoose.Types.ObjectId(fileId);
    const files = await bucket.find({ _id: objectId }).toArray();

    if (files.length === 0) {
      throw new Error('File not found');
    }

    return files[0];
  } catch (error) {
    console.error('GridFS metadata error:', error);
    throw new Error('Failed to get file metadata from GridFS');
  }
};

module.exports = {
  uploadToGridFS,
  getFromGridFS,
  deleteFromGridFS,
  getFileMetadata
};

