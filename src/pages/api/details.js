import { sendError } from '@/api-lib/server'
import config from '@/config/backend'
import {
  getSourceMedia,
  getMediaInfo,
  getMiniInfo,
  getMediaFetchInfo,
  fetchMedia,
} from '@/api-lib/media'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { mediaUrl, onlyStatus, fullinfo } = req.query

    if (!mediaUrl)
      return sendError(res, "Not found", 404)

    let mediaInfo, fetchInfo

    try {
      mediaInfo = await getMediaInfo(mediaUrl)
      fetchInfo = await getMediaFetchInfo(mediaUrl, { mediaInfo })
      delete fetchInfo.fetchPath
    } catch (err) {
      console.error(err)
      return sendError(res, err.message, 404)
    }

    if (onlyStatus) {
      return res.json(fetchInfo)
    }

    if (!fetchInfo.isFetched && fetchInfo.isFetchable) {
      getSourceMedia(mediaUrl, { mediaInfo })
        .then(({ fetchPath }) => {
          console.log('FETCHED', mediaUrl, 'to', fetchPath)
        })
        .catch(err => {
          console.error(err)
        })
    }

    const miniInfo = await getMiniInfo(mediaInfo)

    // return res.json({ ...miniInfo, ...fetchInfo })
    return res.json(fullinfo ? mediaInfo : { ...miniInfo, ...fetchInfo })
  }
}
