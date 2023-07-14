import { prisma } from '~/utils/prisma'

export default defineAuthenticatedEventHandler((event) => {
  const { id } = getRouterParams(event)
  return prisma.device.create({ data: { accountId: id } })
})
