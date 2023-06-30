import { CronJob } from 'cron'
import ping from 'ping'
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

const job = new CronJob('* * * * *', async () => {
  const servers = await prisma.server.findMany()

  const pingResponse = await pingServers(servers)

  Promise.all(pingResponse.map(async ({ alive }, index) => {
    let data = (await store.getItem(servers[index].id)) as ServerPingData

    if (!data) { data = { histories: [] } }

    data.histories.push({ [(new Date()).toLocaleString()]: alive ? PingStatus.SUCCESS : PingStatus.FAILED })

    store.setItem(servers[index].id, data)
  }))
})

job.start()
