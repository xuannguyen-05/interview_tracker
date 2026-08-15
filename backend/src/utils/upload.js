import cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
            console.error("Cloudinary error:", error);
            return reject(error);
        }

        resolve(result);
      }
    ).end(file.buffer);
  });
};

export default uploadToCloudinary;