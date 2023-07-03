import { z } from 'zod'
import { compareSync } from 'bcrypt'
import { prisma } from '~/utils/prisma'
import { generateAccessToken } from '~/utils/common'

const Body = z.object({
  username: z.string().trim(),
  password: z.string().trim()
})

export type Body = Required<z.infer<typeof Body>>

export default defineEventHandler(async (event) => {
  const body = await readBody<Body>(event)
  Body.parse(body)
  const account = await prisma.account.findUnique({ where: { username: body.username } })
  if (!account || !account.password) { throwBadRequestException() }
  if (!compareSync(body.password, account.password)) { throwBadRequestException() }
  return { accessToken: generateAccessToken({ id: account.id }) }
})
