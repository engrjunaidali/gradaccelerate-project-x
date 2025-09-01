import env from '#start/env'

const pusherConfig = {
  appId: env.get('PUSHER_APP_ID'),
  key: env.get('PUSHER_APP_KEY'),
  secret: env.get('PUSHER_APP_SECRET'),
  cluster: env.get('PUSHER_CLUSTER'),
  useTLS: true,
}

export default pusherConfig
