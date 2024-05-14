import { v2 as cloudinary } from "cloudinary";

export default new (class CloudinaryConfig {
  config() {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
      secure: true,
    });
  }

  async destination(image: string): Promise<any> {
    try {
      const cloudResponse = await cloudinary.uploader.upload(process.env.KEY_DEST + image, { folder: "threads-app" });
      return cloudResponse.secure_url;
    } catch (error) {
      throw error;
    }
  }
})();
