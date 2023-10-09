import { Client } from 'minio'

interface MinioUploadOptions {
  bucket: string
  filename: string
}

const runtimeConfig = useRuntimeConfig()

const minioClient = new Client({
  endPoint: runtimeConfig.MINIO_END_POINT,
  port: Number(runtimeConfig.MINIO_PORT),
  useSSL: false,
  accessKey: runtimeConfig.MINIO_ACCESS_KEY,
  secretKey: runtimeConfig.MINIO_SECRET_KEY
})

export const upload = async (file: Buffer, options: MinioUploadOptions) => {
  if (!minioClient) { return }
  if (!options.bucket) { return }
  const isBucketExist = await minioClient.bucketExists(options.bucket)
  if (!isBucketExist) { return }

  return new Promise((resolve, reject) => {
    minioClient.putObject(options.bucket, options.filename, file, (error, etag) => {
      error ? reject(error) : resolve(etag)
    })
  })
}

export { minioClient }
