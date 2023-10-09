const runtimeConfig = process.env

export default defineAuthenticatedEventHandler(() => {
  return {
    minioAccessKey: runtimeConfig.MINIO_ACCESS_KEY,
    minioSecretKey: runtimeConfig.MINIO_SECRET_KEY
  }
})
