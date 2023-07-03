import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const Account = z.object({
  username: z.string().trim()
})

export type Account = Required<z.infer<typeof Account>>

export default defineAuthenticatedEventHandler(async (event) => {
  const body = await readBody<Account>(event)
  Account.parse(body)
  return prisma.account.create({ data: { username: body.username } })
})
