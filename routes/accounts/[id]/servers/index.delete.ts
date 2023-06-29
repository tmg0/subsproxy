import { prisma } from '~/utils/prisma'

export default defineEventHandler((event) => {
  const { id } = getRouterParams(event)
  return prisma.accountServer.deleteMany({ where: { accountId: id } })
})
