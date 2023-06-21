import prisma from '../../utils/prisma'

export default defineEventHandler(async (event) => {
  const { url }: { url?: string } = await readBody(event)

  if (!url) { throw new Error('Invalidate URL') }

  const { id } = await prisma.subscription.create({
    data: { url }
  })

  return id
})
