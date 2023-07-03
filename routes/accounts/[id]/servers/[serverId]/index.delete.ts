import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler((event) => {
  const { id, serverId } = getRouterParams(event)
  return prisma.accountServer.deleteMany({ where: { accountId: id, serverId } })
})
