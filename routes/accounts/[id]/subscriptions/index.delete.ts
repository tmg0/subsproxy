import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const subscriptions = await prisma.accountSubscription.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: subscriptions.map(({ subscriptionId }) => ({ subscriptionId })) } })
  await prisma.accountServer.deleteMany({ where: { OR: servers.map(({ id }) => ({ serverId: id })) } })
  return prisma.accountSubscription.deleteMany({ where: { accountId: id } })
})
