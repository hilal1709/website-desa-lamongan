import "server-only"

import Pusher from "pusher"

export type CmsUpdateTopic = "pages" | "news" | "umkm" | "disaster" | "population"

const appId = process.env.PUSHER_APP_ID
const key = process.env.NEXT_PUBLIC_PUSHER_KEY
const secret = process.env.PUSHER_SECRET
const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER

const pusher = appId && key && secret && cluster
  ? new Pusher({ appId, key, secret, cluster, useTLS: true })
  : null

export async function publishCmsUpdate(topic: CmsUpdateTopic) {
  if (!pusher) return

  try {
    await pusher.trigger("cms-public", "content-updated", { topic })
  } catch (error) {
    // A publication failure must not roll back content successfully saved to the CMS.
    console.error("Unable to publish CMS update", error)
  }
}
