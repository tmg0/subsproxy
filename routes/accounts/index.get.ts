import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const Query = z.object({
  username: z.string()
})

export default defineEventHandler((event) => {
  const query: z.infer<typeof Query> = getQuery(event)
  Query.parse(query)
  return prisma.account.findMany({ where: { username: query.username } })
})
