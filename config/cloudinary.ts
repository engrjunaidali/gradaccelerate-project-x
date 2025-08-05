// import Env from '@ioc:Adonis/Core/Env'
import { v2 as Cloudinary } from 'cloudinary'
import env from '#start/env'


Cloudinary.config({
    cloud_name: env.get('CLOUDINARY_CLOUD_NAME'),
    api_key: env.get('CLOUDINARY_API_KEY'),
    api_secret: env.get('CLOUDINARY_API_SECRET'),
    secure: true,
})

export default Cloudinary