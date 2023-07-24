import { z } from 'zod'
import { hashSync } from 'bcrypt'
import { prisma } from '~/utils/prisma'

const Body = z.object({
  username: z.string().trim().optional(),
  remark: z.string().optional(),
  password: z.string().optional()
})

export type Body = z.infer<typeof Body>

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const body = await readBody<Body>(event)
  if (body.password) { body.password = hashSync(body.password, 10) }
  return prisma.account.update({ data: body, where: { id } })
})
