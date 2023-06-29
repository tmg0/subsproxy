import { z } from 'zod'
import { prisma } from '~/utils/prisma'

const Query = z.object({
  encode: z.boolean()
})

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const query: z.infer<typeof Query> = getQuery(event)
  const serverIds = await prisma.accountServer.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: serverIds.map(({ serverId }) => ({ id: serverId })) } })
  return query.encode ? btoa(servers.map(({ address }) => address).join('\n')) : servers
})
