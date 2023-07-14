import { prisma } from '~/utils/prisma'

export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return prisma.$transaction([
    prisma.device.deleteMany({ where: { accountId: id } }),
    prisma.accountServer.deleteMany({ where: { accountId: id } }),
    prisma.accountSubscription.deleteMany({ where: { accountId: id } }),
    prisma.account.delete({ where: { id } })
  ])
})
