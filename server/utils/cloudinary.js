const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload a file to Cloudinary
 * @param {string} filePath - Path to the file to upload
 * @param {string} folder - Folder in Cloudinary to store the file
 * @param {Object} options - Additional options for the upload
 * @returns {Promise<Object>} - The upload result from Cloudinary
 */
const uploadToCloudinary = async (filePath, folder, options = {}) => {
  try {
    // Default options
    const uploadOptions = {
      folder: `ice-super-blog/${folder}`,
      resource_type: 'auto',
      ...options,
    };

    // Upload the file
    const result = await cloudinary.uploader.upload(filePath, uploadOptions);

    // Remove the temporary file
    await unlinkAsync(filePath);

    return result;
  } catch (error) {
    // Clean up the temporary file if it exists
    if (fs.existsSync(filePath)) {
      await unlinkAsync(filePath);
    }
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @param {Object} options - Additional options for the deletion
 * @returns {Promise<Object>} - The deletion result from Cloudinary
 */
const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    // Default options
    const deleteOptions = {
      resource_type: 'image',
      invalidate: true,
      ...options,
    };

    // Delete the file
    return await cloudinary.uploader.destroy(publicId, deleteOptions);
  } catch (error) {
    console.error('Error deleting from Cloudinary:', error);
    throw error;
  }
};

/**
 * Delete multiple files from Cloudinary
 * @param {string[]} publicIds - Array of public IDs to delete
 * @param {Object} options - Additional options for the deletion
 * @returns {Promise<Object>} - The deletion result from Cloudinary
 */
const deleteMultipleFromCloudinary = async (publicIds, options = {}) => {
  try {
    // Default options
    const deleteOptions = {
      resource_type: 'image',
      invalidate: true,
      ...options,
    };

    // Delete the files
    return await cloudinary.api.delete_resources(publicIds, deleteOptions);
  } catch (error) {
    console.error('Error deleting multiple from Cloudinary:', error);
    throw error;
  }
};

/**
 * Upload a base64 encoded image to Cloudinary
 * @param {string} base64Image - Base64 encoded image string
 * @param {string} folder - Folder in Cloudinary to store the image
 * @param {Object} options - Additional options for the upload
 * @returns {Promise<Object>} - The upload result from Cloudinary
 */
const uploadBase64Image = async (base64Image, folder, options = {}) => {
  try {
    // Default options
    const uploadOptions = {
      folder: `ice-super-blog/${folder}`,
      resource_type: 'image',
      ...options,
    };

    // Upload the base64 image
    return await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, uploadOptions);
  } catch (error) {
    console.error('Error uploading base64 image to Cloudinary:', error);
    throw error;
  }
};

/**
 * Generate a Cloudinary URL with transformations
 * @param {string} publicId - The public ID of the file
 * @param {Object} options - Transformation options
 * @returns {string} - The generated URL
 */
const generateCloudinaryUrl = (publicId, options = {}) => {
  try {
    // Default options
    const defaultOptions = {
      width: 800,
      height: 600,
      crop: 'fill',
      quality: 'auto',
      fetch_format: 'auto',
      ...options,
    };

    return cloudinary.url(publicId, defaultOptions);
  } catch (error) {
    console.error('Error generating Cloudinary URL:', error);
    throw error;
  }
};

module.exports = {
  cloudinary,
  uploadToCloudinary,
  deleteFromCloudinary,
  deleteMultipleFromCloudinary,
  uploadBase64Image,
  generateCloudinaryUrl,
};
