import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const subscriptionIds = await prisma.accountSubscription.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: subscriptionIds.map(({ subscriptionId }) => ({ subscriptionId })) } })

  const accounts = await prisma.accountServer.groupBy({
    by: ['serverId'],
    _count: { serverId: true },
    orderBy: {
      _count: {
        serverId: 'desc'
      }
    },
    where: {
      OR: servers.map(({ id }) => ({ serverId: id }))
    }
  })

  const used: Record<string, number> = {}
  accounts.forEach(({ serverId, _count }) => {
    used[serverId] = _count.serverId
  })

  const accessServers = servers.filter(({ id }) => !Object.keys(used).includes(id))

  if (!accessServers.length) { throw new Error('Do not have access server.') }

  return prisma.accountServer.create({
    data: {
      accountId: id,
      serverId: (() => {
        if (!Object.keys(used).length) { return accessServers[0].id }

        for (const server of accessServers) {
          if (!used[server.id]) { return server.id }
        }

        const [id] = Object.entries(accessServers).reduce((min, curr) => {
          if (curr[1] < min[1]) { return curr }
          return min
        })

        return id
      })()
    }
  })
})
