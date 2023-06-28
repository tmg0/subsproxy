import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)

  const servers = await prisma.server.findMany()

  const accounts = await prisma.account.groupBy({
    by: ['serverId'],
    _count: { serverId: true },
    orderBy: {
      _count: {
        serverId: 'desc'
      }
    }
  })

  const used: Record<string, number> = {}
  accounts.forEach(({ serverId, _count }) => {
    used[serverId] = _count.serverId
  })

  if (!servers.length) { throw new Error('Do not have access server.') }

  return prisma.account.update({
    where: { id },
    data: {
      serverId: (() => {
        if (!Object.keys(used).length) { return servers[0].id }

        for (const server of servers) {
          if (!used[server.id]) { return server.id }
        }

        const [id] = Object.entries(servers).reduce((min, curr) => {
          if (curr[1] < min[1]) { return curr }
          return min
        })

        return id
      })()
    }
  })
})
