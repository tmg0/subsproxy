import { CronJob } from 'cron'
import { pingServers } from '~/utils/common'
import { prisma } from '~/utils/prisma'
import { store } from '~/utils/store'

enum PingStatus {
  SUCCESS,
  FAILED
}

interface ServerPingData {
  histories: Record<string, PingStatus>[]
}

const job = new CronJob('0 0 * * * *', async () => {
  const servers = await prisma.server.findMany()

  const pingResponse = await pingServers(servers)

  pingResponse.forEach(async ({ alive }, index) => {
    let data = (await store.getItem(servers[index].id)) as ServerPingData

    if (!data) { data = { histories: [] } }

    data.histories.push({ [(new Date()).toLocaleString()]: alive ? PingStatus.SUCCESS : PingStatus.FAILED })

    if (data.histories.length > 10) { data.histories.shift() }

    store.setItem(servers[index].id, data)
  })
})

job.start()
