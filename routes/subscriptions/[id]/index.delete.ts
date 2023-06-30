import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const servers = prisma.server.findMany({ where: { subscriptionId: id } })

  await prisma.$transaction([
    servers.map(({ id: serverId }) => [
      prisma.server.deleteMany({ where: { subscriptionId: id } }),
      prisma.accountServer.deleteMany({ where: { serverId } })
    ]),

    prisma.accountSubscription.deleteMany({ where: { subscriptionId: id } })
  ].flat())

  return prisma.subsctiption.delete({ where: { id } })
})
