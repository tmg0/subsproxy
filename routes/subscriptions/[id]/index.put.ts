import { ofetch } from 'ofetch'
import { createAccountServer } from '~/routes/accounts/[id]/servers/index.post'
import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const subsctiption = await prisma.subsctiption.findUnique({ where: { id } })
  const servers = atob(await ofetch(subsctiption.address)).split(/[\n\r]/).filter(Boolean).flat()

  const oldServers = await prisma.server.findMany({ where: { subscriptionId: id } })
  const accounts = await prisma.accountServer.groupBy({
    by: ['accountId'],
    _count: { serverId: true },
    where: {
      OR: oldServers.map(({ id }) => ({ serverId: id }))
    }
  })

  await prisma.$transaction([
    prisma.accountServer.deleteMany({ where: { OR: oldServers.map(({ id }) => ({ serverId: id })) } }),
    prisma.server.deleteMany({ where: { subscriptionId: subsctiption.id } }),
    ...servers.map(address => prisma.server.create({ data: { address, subscriptionId: subsctiption.id } }))
  ])

  accounts.forEach(({ accountId, _count }) => {
    createAccountServer(accountId, { count: _count.serverId })
  })

  return subsctiption
})
