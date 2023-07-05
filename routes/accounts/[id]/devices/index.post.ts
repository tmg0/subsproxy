import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler((event) => {
  const { id } = getRouterParams(event)
  return prisma.accountDevice.create({ data: { accountId: id } })
})
