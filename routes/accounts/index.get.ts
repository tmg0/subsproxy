import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const AccountsQuery = z.object({
  username: z.string()
})

export default defineEventHandler((event) => {
  const query: z.infer<typeof AccountsQuery> = getQuery(event)
  AccountsQuery.parse(query)
  return prisma.account.findMany({ where: { username: query.username } })
})
