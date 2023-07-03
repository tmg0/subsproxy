import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler(() => {
  return prisma.subscription.findMany()
})
