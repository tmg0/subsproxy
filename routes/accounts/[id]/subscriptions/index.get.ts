import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return prisma.accountSubscription.findMany({
    where: { accountId: id },
    include: {
      subscription: {
        include: {
          server: true,
          accountSubscription: {
            include: { account: { select: { username: true } } }
          }
        }
      }
    }
  })
})
