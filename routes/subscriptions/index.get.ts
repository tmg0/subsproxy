import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const Query = z.object({
  address: z.string()
})

export default defineEventHandler((event) => {
  const query: z.infer<typeof Query> = getQuery(event)
  Query.parse(query)
  return prisma.subscription.findMany({ where: { address: query.address } })
})
