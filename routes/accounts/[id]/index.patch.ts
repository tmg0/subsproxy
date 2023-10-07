import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const Body = z.object({
  avatar: z.string().trim().optional()
})

export type Body = z.infer<typeof Body>

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Body>(event)
  return prisma.account.update({ data: body, where: { id } })
})
