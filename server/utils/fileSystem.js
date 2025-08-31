const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const mkdir = promisify(fs.mkdir);
const access = promisify(fs.access);

/**
 * Checks if a directory exists
 * @param {string} dirPath - Path to the directory
 * @returns {Promise<boolean>} - True if directory exists, false otherwise
 */
const directoryExists = async (dirPath) => {
  try {
    await access(dirPath, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};

/**
 * Creates a directory if it doesn't exist
 * @param {string} dirPath - Path to the directory to create
 * @returns {Promise<void>}
 */
const createDirectoryIfNotExists = async (dirPath) => {
  try {
    const exists = await directoryExists(dirPath);
    if (!exists) {
      await mkdir(dirPath, { recursive: true });
    }
  } catch (err) {
    throw new Error(`Error creating directory: ${err.message}`);
  }
};

/**
 * Deletes a file
 * @param {string} filePath - Path to the file to delete
 * @returns {Promise<void>}
 */
const deleteFile = async (filePath) => {
  try {
    await fs.promises.unlink(filePath);
  } catch (err) {
    if (err.code !== 'ENOENT') {
      // Ignore file not found error
      throw err;
    }
  }
};

/**
 * Gets file extension from filename
 * @param {string} filename - The filename
 * @returns {string} - The file extension (without dot)
 */
const getFileExtension = (filename) => {
  return path.extname(filename).slice(1).toLowerCase();
};

/**
 * Generates a unique filename with timestamp and random string
 * @param {string} originalname - Original filename
 * @returns {string} - Generated unique filename
 */
const generateUniqueFilename = (originalname) => {
  const ext = path.extname(originalname).toLowerCase();
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${timestamp}-${randomString}${ext}`;
};

/**
 * Validates file type based on extension
 * @param {string} filename - The filename to validate
 * @param {string[]} allowedExtensions - Array of allowed extensions (without dot)
 * @returns {boolean} - True if file type is allowed
 */
const validateFileType = (filename, allowedExtensions) => {
  const ext = getFileExtension(filename);
  return allowedExtensions.includes(ext);
};

/**
 * Gets file size in MB
 * @param {string} filePath - Path to the file
 * @returns {Promise<number>} - File size in MB
 */
const getFileSizeInMB = async (filePath) => {
  try {
    const stats = await fs.promises.stat(filePath);
    return stats.size / (1024 * 1024); // Convert bytes to MB
  } catch (err) {
    throw new Error(`Error getting file size: ${err.message}`);
  }
};

/**
 * Gets MIME type of a file
 * @param {string} filePath - Path to the file
 * @returns {Promise<string>} - MIME type of the file
 */
const getFileMimeType = async (filePath) => {
  const mime = await import('mime-types');
  return mime.lookup(filePath) || 'application/octet-stream';
};

module.exports = {
  directoryExists,
  createDirectoryIfNotExists,
  deleteFile,
  getFileExtension,
  generateUniqueFilename,
  validateFileType,
  getFileSizeInMB,
  getFileMimeType,
};
