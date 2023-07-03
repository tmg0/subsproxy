import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler((event) => {
  const { id } = getRouterParams(event)
  return prisma.accountSubscription.deleteMany({ where: { accountId: id } })
})
