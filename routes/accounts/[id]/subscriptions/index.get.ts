import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return prisma.subscription.findMany({
    include: { accountSubscription: { where: { accountId: id } } }
  })
})
