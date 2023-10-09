import { upload } from '~/utils/minio'

export default defineAuthenticatedEventHandler(async (event) => {
  const bucket = getRouterParam(event, 'name')
  const [{ data, filename }] = await readMultipartFormData(event)
  const url = await upload(data, { bucket, filename })
  return { url }
})
