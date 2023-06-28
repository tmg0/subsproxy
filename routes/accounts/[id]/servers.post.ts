import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const used: Record<string, number> = {}
  const accounts = await prisma.account.findMany()

  accounts.forEach((account) => {
    if (!used[account.serverId]) { used[account.serverId] = 0 }
    used[account.serverId] = used[account.serverId] + 1
  })

  const servers = await prisma.server.findMany()

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
