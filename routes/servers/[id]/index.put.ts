import { ofetch } from 'ofetch'
import { createAccountServer } from '~/routes/accounts/[id]/servers/index.post'
import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const { subscriptionId } = await prisma.server.findUnique({ where: { id } })
  const subscription = await prisma.subscription.findUnique({ where: { id: subscriptionId } })
  if (!subscription) { throwBadRequestException() }
  const servers = atob(await ofetch(subscription.address)).split(/[\n\r]/).filter(Boolean).flat()

  const oldServers = await prisma.server.findMany({ where: { subscriptionId } })
  const accounts = await prisma.accountServer.groupBy({
    by: ['accountId'],
    _count: { serverId: true },
    where: {
      OR: oldServers.map(({ id }) => ({ serverId: id }))
    }
  })

  await prisma.$transaction([
    prisma.accountServer.deleteMany({ where: { OR: oldServers.map(({ id }) => ({ serverId: id })) } }),
    prisma.server.deleteMany({ where: { subscriptionId: subscription.id } }),
    ...servers.map(address => prisma.server.create({ data: { address, subscriptionId: subscription.id } }))
  ])

  accounts.forEach(({ accountId, _count }) => {
    createAccountServer(accountId, { count: _count.serverId })
  })

  return subscription
})
