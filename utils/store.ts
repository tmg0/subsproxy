import { createStorage } from 'unstorage'
import { loadConfig } from 'c12'
import { nanoid } from 'nanoid'
import { StorageKey } from './enums'

const storage = createStorage(/* opts */)

const loadConf = async (): Promise<SubConf> => {
  const conf = await storage.getItem(StorageKey.CONFIG)
  if (conf) { return conf as SubConf }
  const { config: json } = await loadConfig<SubConf>({ name: 'sub' })
  await storage.setItem(StorageKey.CONFIG, json)
  return json
}

export const account = {
  findMany: async () => (await loadConf()).accounts
}

export const subscription = {
  findMany: async () => (await loadConf()).subscriptions,
  create: async ({ url }: { url: string }) => {
    const id = nanoid()
    const conf = await loadConf()
    const item = { id, url }
    conf.subscriptions.push()
    return item
  }
}
