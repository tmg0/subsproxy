export default defineAuthenticatedEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return prisma.device.findMany({ where: { accountId: id } })
})
