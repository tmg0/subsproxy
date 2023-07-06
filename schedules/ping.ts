enum PingStatus {
  SUCCESS,
  FAILED
}

interface ServerPingData {
  histories: Record<string, PingStatus>[]
}

export default defineCronHandler('0 * * * * *', async () => {
  const servers = await prisma.server.findMany()

  const pingResponse = await pingServers(servers)

  pingResponse.forEach(async ({ alive }, index) => {
    let data = (await store.getItem(servers[index].id)) as ServerPingData

    if (!data) { data = { histories: [] } }

    data.histories.push({ [(new Date()).toISOString()]: alive ? PingStatus.SUCCESS : PingStatus.FAILED })

    if (data.histories.length > 10) { data.histories.shift() }

    store.setItem(servers[index].id, data)
  })
})
