import Pusher from 'pusher-js'

// Create a singleton Pusher instance
let pusherInstance: Pusher | null = null

export const getPusherInstance = () => {
  if (!pusherInstance) {
    // You'll need to set these environment variables on your frontend
    const pusherKey = import.meta.env.VITE_PUSHER_APP_KEY || 'your-default-key'
    const pusherCluster = import.meta.env.VITE_PUSHER_CLUSTER || 'mt1'

    pusherInstance = new Pusher(pusherKey, {
      cluster: pusherCluster,
      forceTLS: true,
    })
  }
  return pusherInstance
}

export const disconnectPusher = () => {
  if (pusherInstance) {
    pusherInstance.disconnect()
    pusherInstance = null
  }
}

export default getPusherInstance
