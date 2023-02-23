import { sendError } from '@/api-lib/server'
import { formatDownloadFilename } from '@/api-lib/format'
import { outputFormats } from '@/api-lib/outputFormats'
import { getMediaInfo, getSourceMedia } from '@/api-lib/media'
import { processToStream } from '@/api-lib/ffmpeg'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { videoUrl, from, to, name, output = 'flac' } = req.query
    const format = outputFormats.find(f => f.name === output)
    let range
    let mediaInfo

    if (!videoUrl || !format)
      return sendError(res, "Not found", 404)

    if (parseFloat(from) && parseFloat(to)) {
      range = {
        from: parseFloat(from),
        to: parseFloat(to),
        name
      }
    }

    try {
      mediaInfo = await getMediaInfo(videoUrl)
    } catch (err) {
      return sendError(res, err.message, 404)
    }

    let outFilename
    let ffmpegStream
    try {
      await getSourceMedia(videoUrl, { mediaInfo })
      outFilename = formatDownloadFilename(mediaInfo, format, range)
      ffmpegStream = await processToStream(videoUrl, format, { range, mediaInfo })
    } catch (err) {
      console.error(err)
      return sendError(res, err.message, 404)
    }

    res.setHeader('Content-Type', format.mime)
    res.setHeader('Content-Disposition', `inline; filename="${outFilename}"`)
    return ffmpegStream
      .on('error', err => {
        console.log(`FFMPEG ERROR ${err.message}`)
      })
      .pipe(res, { end: true })
  }
}
