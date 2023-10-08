import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  alias: { '~': __dirname },

  runtimeConfig: {
    TENCENT_SECRET_ID: process.env.TENCENT_SECRET_ID,
    TENCENT_SECRET_KEY: process.env.TENCENT_SECRET_KEY,
    TENCENT_BUCKET: process.env.TENCENT_BUCKET,
    TENCENT_REGION: process.env.TENCENT_REGION
  },

  devServer: {
    watch: ['routes/**/*.ts']
  }
})
