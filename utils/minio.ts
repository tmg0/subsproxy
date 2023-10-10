import { Agent } from 'node:https'
import { Client } from 'minio'
import { extname } from 'pathe'
import { nanoid } from 'nanoid'

interface MinioUploadOptions {
  bucket: string
  filename: string
}

const runtimeConfig = process.env

const HOST = `https://${runtimeConfig.MINIO_END_POINT}:${runtimeConfig.MINIO_PORT}`

const minioClient = new Client({
  endPoint: runtimeConfig.MINIO_END_POINT,
  port: Number(runtimeConfig.MINIO_PORT),
  useSSL: true,
  accessKey: runtimeConfig.MINIO_ACCESS_KEY,
  secretKey: runtimeConfig.MINIO_SECRET_KEY,
  transportAgent: new Agent({ rejectUnauthorized: false })
})

export const upload = async (file: Buffer, options: MinioUploadOptions) => {
  if (!minioClient) { return }
  if (!options.bucket) { return }
  const isBucketExist = await minioClient.bucketExists(options.bucket)
  if (!isBucketExist) { return }

  const filename = nanoid() + extname(options.filename)

  return new Promise((resolve, reject) => {
    minioClient.putObject(options.bucket, filename, file, (error) => {
      !error ? resolve(`${HOST}/${options.bucket}/${filename}`) : reject(error)
    })
  })
}

export { minioClient }
