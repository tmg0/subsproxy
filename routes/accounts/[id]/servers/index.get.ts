import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const serverIds = await prisma.accountServer.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: serverIds.map(({ serverId }) => ({ id: serverId })) } })
  return btoa(servers.map(({ address }) => address).join('\n'))
})
