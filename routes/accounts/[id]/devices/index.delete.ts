export default defineAuthenticatedEventHandler((event) => {
  const id = getRouterParam(event, 'id')
  return prisma.device.deleteMany({ where: { accountId: id } })
})
