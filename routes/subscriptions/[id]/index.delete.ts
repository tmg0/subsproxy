import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const servers = await prisma.server.findMany({ where: { subscriptionId: id } })

  await Promise.all(servers.map(({ id: serverId }) => [
    prisma.server.deleteMany({ where: { subscriptionId: id } }),
    prisma.accountServer.deleteMany({ where: { serverId } })
  ]))

  await prisma.accountSubscription.deleteMany({ where: { subscriptionId: id } })

  return prisma.subscription.delete({ where: { id } })
})
