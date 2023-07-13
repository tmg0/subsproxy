export default defineAuthenticatedEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return prisma.accountDevice.findMany({ where: { accountId: id }, include: { device: true } })
})
