import { defineNitroConfig } from 'nitropack/config'

export default defineNitroConfig({
  alias: { '~': __dirname },

  devServer: {
    watch: ['routes/**/*.ts']
  }
})
