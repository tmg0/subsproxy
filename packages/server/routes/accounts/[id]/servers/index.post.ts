import { prisma } from '~/utils/prisma'

interface Options {
  count: number
}

export const createAccountServer = async (id: string, opts: Options = { count: 1 }) => {
  const subscriptionIds = await prisma.accountSubscription.findMany({ where: { accountId: id } })
  const servers = await prisma.server.findMany({ where: { OR: subscriptionIds.map(({ subscriptionId }) => ({ subscriptionId })) } })

  const accounts = await prisma.accountServer.groupBy({
    by: ['serverId'],
    _count: { serverId: true },
    where: {
      OR: servers.map(({ id }) => ({ serverId: id }))
    }
  })

  const used = (() => {
    const res: Record<string, number> = {}
    servers.forEach(({ id }) => { res[id] = 0 })
    return res
  })()

  accounts.forEach(({ serverId, _count }) => {
    used[serverId] = _count.serverId
  })

  if (!servers.length) { throwBadRequestException() }

  return prisma.$transaction(Object.entries(used).sort(([_a, a], [_b, b]) => a - b).slice(0, opts.count).map(([serverId]) => {
    return prisma.accountServer.create({ data: { accountId: id, serverId } })
  }))
}

export default defineAuthenticatedEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const account = await prisma.account.findUnique({ where: { id } })
  if (!account) { throwBadRequestException() }
  return createAccountServer(id)
})
