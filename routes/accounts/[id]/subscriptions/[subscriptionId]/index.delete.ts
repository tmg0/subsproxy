import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler(async (event) => {
  const { id, subscriptionId } = getRouterParams(event)

  const servers = await prisma.server.findMany({ where: { subscriptionId } })

  return prisma.$transaction([
    prisma.accountSubscription.deleteMany({ where: { accountId: id, subscriptionId } }),
    prisma.accountServer.deleteMany({ where: { accountId: id, OR: servers.map(({ id }) => ({ serverId: id })) } })
  ])
})
