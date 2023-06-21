import { subscription } from '../../utils/store'

export default defineEventHandler(() => {
  return subscription.findMany()
})
