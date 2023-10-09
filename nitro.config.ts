import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  alias: { '~': __dirname },

  runtimeConfig: {
    TENCENT_SECRET_ID: process.env.TENCENT_SECRET_ID,
    TENCENT_SECRET_KEY: process.env.TENCENT_SECRET_KEY,
    TENCENT_BUCKET: process.env.TENCENT_BUCKET,
    TENCENT_REGION: process.env.TENCENT_REGION,

    MINIO_ACCESS_KEY: process.env.MINIO_ACCESS_KEY,
    MINIO_SECRET_KEY: process.env.MINIO_SECRET_KEY,
    MINIO_END_POINT: process.env.MINIO_END_POINT,
    MINIO_PORT: process.env.MINIO_PORT
  },

  devServer: {
    watch: ['routes/**/*.ts']
  }
})
