export default defineAuthenticatedEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const devices = await prisma.accountDevice.findMany({ where: { accountId: id } })

  return prisma.$transaction([
    prisma.accountDevice.deleteMany({ where: { accountId: id } }),
    prisma.device.deleteMany({ where: { OR: devices.map(({ deviceId }) => ({ id: deviceId })) } })
  ])
})
