import { Request, Response } from 'express'
import path from 'path'
import mediasService from '~/services/medias.services'
import { UPLOADS_IMAGE_DIR, UPLOADS_VIDEO_DIR } from '~/constants/dir'
import { USERS_MESSAGES } from '~/constants/messages'
import HTTP_STATUS from '~/constants/httpStatus'
import fs from 'fs'

export const uploadImageController = async (req: Request, res: Response) => {
  const result = await mediasService.uploadImage(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result
  })
}

export const uploadVideoController = async (req: Request, res: Response) => {
  const result = await mediasService.uploadVideo(req)
  return res.json({
    message: USERS_MESSAGES.UPLOAD_SUCCESS,
    result
  })
}

export const serveImageController = async (req: Request, res: Response) => {
  const { name } = req.params
  return res.sendFile(path.resolve(UPLOADS_IMAGE_DIR, name), (err) => {
    if (err) {
      console.log(err)
      res.status((err as any).status).send('Not found')
    }
  })
}

export const serveVideoStreamController = async (req: Request, res: Response) => {
  const mime = (await import('mime')).default
  const range = req.headers.range
  if (!range) {
    return res.status(HTTP_STATUS.BAD_REQUEST).send('Requires range header')
  }
  const { name } = req.params
  const videoPath = path.resolve(UPLOADS_VIDEO_DIR, name)
  const videoSize = fs.statSync(videoPath).size
  const chunkSize = 10 ** 6
  const start = Number(range.replace(/\D/g, ''))
  const end = Math.min(start + chunkSize, videoSize - 1)
  const contentLength = end - start + 1
  const contentType = mime.getType(videoPath) || 'video/*'
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': contentType
  }
  res.writeHead(HTTP_STATUS.PARTIAL_CONTENT, headers)
  const videoStreams = fs.createReadStream(videoPath, { start, end })
  videoStreams.pipe(res)
}
