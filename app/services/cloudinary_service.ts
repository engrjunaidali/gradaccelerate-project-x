import cloudinary from '#config/cloudinary'

export default class CloudinaryService {
    constructor(
        private imagePath: string,
        private folderName: string = 'adonis_uploads'
    ) { }

    async upload() {
        try {
            const result = await cloudinary.uploader.upload(this.imagePath, {
                folder: this.folderName,
            })

            return {
                success: true,
                url: result.secure_url,
                publicId: result.public_id
            }
        } catch (error) {
            console.error('Cloudinary Upload Error:', error)
            throw new Error('Failed to upload image to Cloudinary')
        }
    }

    async delete(publicId: string) {
        try {
            const result = await cloudinary.uploader.destroy(publicId)
            return {
                success: true,
                result
            }
        } catch (error) {
            console.error('Cloudinary Delete Error:', error)
            throw new Error('Failed to delete image from Cloudinary')
        }
    }
}