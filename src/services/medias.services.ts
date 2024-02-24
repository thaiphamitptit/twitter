import { Request } from 'express'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs'
import { config } from 'dotenv'
import { Media } from '~/models/Other'
import { handleUploadImage, handleUploadVideo } from '~/utils/file'
import { UPLOADS_IMAGE_DIR } from '~/constants/dir'
import { isProduction } from '~/constants/config'
import { MediaType } from '~/constants/enums'
config()

class MediasService {
  async uploadImage(req: Request) {
    const files = await handleUploadImage(req)
    const result: Media[] = await Promise.all(
      files.map(async (file) => {
        await sharp(file.filepath).jpeg().toFile(path.resolve(UPLOADS_IMAGE_DIR, file.newFilename))
        return {
          url: isProduction
            ? `${process.env.HOST}/static/image/${file.newFilename}`
            : `http://localhost:${process.env.PORT}/static/image/${file.newFilename}`,
          type: MediaType.Image
        }
      })
    )
    return result
  }

  async uploadVideo(req: Request) {
    const files = await handleUploadVideo(req)
    const result: Media[] = files.map((file) => {
      return {
        url: isProduction
          ? `${process.env.HOST}/static/video/${file.newFilename}`
          : `http://localhost:${process.env.PORT}/static/video/${file.newFilename}`,
        type: MediaType.Video
      }
    })
    return result
  }
}

const mediasService = new MediasService()
export default mediasService
