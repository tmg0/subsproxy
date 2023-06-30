import { ofetch } from 'ofetch'
import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const subsctiption = await prisma.subsctiption.findUnique({ where: { id } })
  const servers = atob(await ofetch(subsctiption.address)).split(/[\n\r]/).filter(Boolean).flat()

  const oldServers = await prisma.server.findMany({ where: { subscriptionId: id } })
  const accountServers = await prisma.accountServer.groupBy({
    by: ['accountId'],
    _count: { serverId: true },
    where: {
      OR: oldServers.map(({ id }) => ({ serverId: id }))
    }
  })

  console.log(accountServers)

  const createServers = servers.map(address => prisma.server.create({ data: { address, subscriptionId: subsctiption.id } }))

  await prisma.$transaction([
    prisma.server.deleteMany({ where: { subscriptionId: subsctiption.id } }),
    ...createServers
  ])

  return subsctiption
})
