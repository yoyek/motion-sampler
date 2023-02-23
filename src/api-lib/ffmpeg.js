import ffmpegStatic from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import { getSourceMedia } from '@/api-lib/media'

export function processToStream(mediaUrl, format, { range, mediaInfo }) {
  return new Promise(async (resolve, reject) => {
    ffmpeg.setFfmpegPath(ffmpegStatic)
    const { fetchPath } = await getSourceMedia(mediaUrl, { mediaInfo })

    const media = ffmpeg(fetchPath, {
      logger: {
        debug: (msg) => {}, // console.log('[FFMPEG DEBUG]', msg),
        info: (msg) => console.log('[FFMPEG INFO]', msg),
        warn: (msg) => console.log('[FFMPEG WARN]', msg),
        error: (msg) => console.log('[FFMPEG ERROR]', msg),
      }
    })

    // Needed for streaming
    media.outputOptions(['-movflags frag_keyframe+empty_moov+faststart'])

    if (format.type === 'audio')
      media.noVideo()

    // Cut part of media
    if (range && range.from && range.to)
      media.seekInput(range.from).duration(range.to - range.from)

    // Set output format
    format.format && media.format(format.format)

    // Set custom format's ffmpeg settings
    format.ffmpeg && format.ffmpeg(media)

    return resolve(media)
  })
}

export function extractAudioPathFfmpeg(output) {
  const lines = output.split('\n')
  const extractAudioLine = lines.find(line => line.startsWith('[ExtractAudio] Destination:'))
  if (extractAudioLine) {
    return extractAudioLine.split(': ')[1]
  }
  return null
}
