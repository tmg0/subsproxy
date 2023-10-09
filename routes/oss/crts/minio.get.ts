const runtimeConfig = process.env

export default defineAuthenticatedEventHandler(() => {
  return {
    accessKey: runtimeConfig.MINIO_ACCESS_KEY,
    secretKey: runtimeConfig.MINIO_SECRET_KEY
  }
})
