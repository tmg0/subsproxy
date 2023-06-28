import { prisma } from '~/utils/prisma'

export default defineEventHandler(async (event) => {
  const { id } = getRouterParams(event)
  const { serverId } = await prisma.account.findUnique({ where: { id } })
  const { address } = await prisma.server.findUnique({ where: { id: serverId } })
  return btoa(address)
})
