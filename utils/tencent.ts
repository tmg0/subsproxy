// @ts-ignore
import STS, { type PolicyDescription } from 'qcloud-cos-sts'

const runtimeConfig = useRuntimeConfig()

export const getPolicy = () => {
  const scope = [{
    action: 'name/cos:PutObject',
    bucket: runtimeConfig.TENCENT_BUCKET,
    region: runtimeConfig.TENCENT_REGION,
    prefix: 'images/*'
  }]

  return STS.getPolicy(scope)
}

export const asyncGetCredential = (policy: PolicyDescription) => {
  return new Promise((resolve) => {
    const options = {
      secretId: runtimeConfig.TENCENT_SECRET_ID,
      secretKey: runtimeConfig.TENCENT_SECRET_KEY,
      policy
    }

    STS.getCredential(options, (_, credential) => {
      resolve(credential)
    })
  })
}
