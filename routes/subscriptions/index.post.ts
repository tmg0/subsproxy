import { subscription } from '../../utils/store'

export default defineEventHandler(async (event) => {
  const { url }: { url?: string } = await readBody(event)

  if (!url) { throw new Error('Invalidate URL') }

  const { id } = await subscription.create({ url })

  return id
})
