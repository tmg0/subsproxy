interface Account {
  id: string
  name: string
}

interface Subscription {
  id: string
  url: string
}

interface SubConf {
  accounts: Account[]
  subscriptions: Subscription[]
}