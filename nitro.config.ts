import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  alias: { '~': __dirname },

  experimental: {
    openAPI: true
  },

  devServer: {
    watch: ['routes/**/*.ts']
  }
})
