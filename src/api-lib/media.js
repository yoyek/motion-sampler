import fs from 'fs-extra'
import youtubedl from 'youtube-dl-exec'
import ffmpegStatic from 'ffmpeg-static'
import config from '@/config/backend'
import { cache } from '@/api-lib/cache'
import { extractAudioPathFfmpeg } from '@/api-lib/ffmpeg'
const { audioOnly, srcMediaDir, mediaFetchLimit, defaultFps } = config

export function getSourceFilepath(mediaInfo) {
  const { extractor, id, ext } = mediaInfo
  const audioPart = audioOnly ? '_audio' : ''
  return `${srcMediaDir}/${extractor}-${id}${audioPart}.${ext}`
}

export const getMediaInfo = cache(function getMediaInfo(mediaUrl) {
  return youtubedl(mediaUrl, {
    dumpSingleJson: true,
    preferFreeFormats: false,
    noCheckCertificates: true,
    ...(audioOnly && {extractAudio: true}),
    noWarnings: true,
  })
  .then(mediaInfo => {
    if (mediaInfo.extractor === 'soundcloud') {
      mediaInfo._type = 'audio' // Fix soundcloud type
    }
    const gbApprox = mediaInfo.filesize_approx / 1024 / 1024 / 1024
    mediaInfo.too_big = gbApprox > mediaFetchLimit
    return mediaInfo
  })
})

export function getMiniInfo(info) {
  return new Promise(async (resolve) => {
    if (!info) return resolve(null)
    const isVideo = info._type === 'video'

    return resolve({
      mediaId: info.id,
      mediaUrl: info.webpage_url,
      type: info._type,
      title: info.title,
      fps: info.fps || (isVideo ? defaultFps : undefined),
      width: info.width,
      height: info.height,
      channel: info.channel || info.uploader,
      channelUrl: info.channel_url,
      isLive: info.is_live,
      viewCount: info.view_count,
      availability: info.availability,
      thumbnail: info.thumbnail,
      uploadDate: info.upload_date, // 20230121
      extractor: info.extractor, // youtube
      extractorKey: info.extractor_key, // YouTube
      duration: info.duration,
      aspectRatio: info.aspect_ratio,
      playableInEmbed: info.playable_in_embed,
      filesizeApprox: info.filesize_approx,
      formatNote: info.format_note,
      format: info.format,
      formatId: info.format_id,
      resolution: isVideo ? info.resolution : undefined, // 1280x720
      ext: info.ext,
      asr: info.asr, // audio sample rage (48000)
      abr: info.abr, // audio bit rate (147.76)
      vbr: info.vbr, // video bit rate (102.973)
      tbr: info.tbr, // target bit rate (250.733)
      videoCodec: isVideo && info.vcodec ? info.vcodec.split('.')[0] : undefined,
      audioCodec: (info.acodec && info.acodec.split('.')[0]) || (isVideo ? undefined : info.ext),
      chapters: info.chapters || [],
      tooBig: !!info.too_big,
      _extended: true,
    })
  })
}

export function getMediaFetchInfo(mediaUrl, { mediaInfo } = {}) {
  return new Promise(async (resolve, reject) => {
    mediaInfo = mediaInfo || await getMediaInfo(mediaUrl)
    if (!mediaInfo.id) return resolve(null)

    const fetchPath = getSourceFilepath(mediaInfo)
    const isFetched = await fs.pathExists(fetchPath)
    let isFetchable = true
    let isFetching = false
    let filesize
    let fetchReason

    if (mediaInfo.too_big) {
      isFetchable = false
      fetchReason = `Source too big (max ${mediaFetchLimit} GB)`
    }

    if (mediaInfo.is_live) {
      isFetchable = false
      fetchReason = 'Source is live'
    }

    if (!isFetched && isFetchable) {
      isFetching = await fs.pathExists(fetchPath + '.lock')
    }

    if (isFetched) {
      const { size } = await fs.statSync(fetchPath)
      filesize = size
    }

    resolve({
      isFetched,
      isFetching,
      isFetchable,
      fetchReason,
      filesize,
      fetchPath
    })
  })
}

export function getSourceMedia(mediaUrl, { mediaInfo } = {}) {
  return new Promise(async (resolve, reject) => {
    mediaInfo = mediaInfo || await getMediaInfo(mediaUrl)
    const {
      isFetched, isFetching, isFetchable, fetchReason, fetchPath
    } = await getMediaFetchInfo(mediaUrl, { mediaInfo })

    if (isFetched)
      return resolve({ fetchPath, mediaInfo })

    if (!isFetchable)
      return reject(new Error(`Cannot fetch media: ${fetchReason || '?'}`))

    if (isFetching)
      return reject(new Error(`Already fetching this media`))

    const lockPath = fetchPath + '.lock'
    await fs.createFile(lockPath)

    console.log('youtubedl() started downloading', mediaUrl)
    const downloader = youtubedl(mediaUrl, {
      output: fetchPath,
      noMtime: true,
      noWarnings: true,
      embedMetadata: true,
      preferFreeFormats: false,
      noCheckCertificates: true,
      throttledRate: '500K',
      ffmpegLocation: ffmpegStatic,
      ...(audioOnly && {extractAudio: true}),
    })
    .then(async output => {
      const outPath = audioOnly ? extractAudioPathFfmpeg(output) : fetchPath
      if (outPath !== fetchPath) {
        await fs.rename(outPath, fetchPath)
      }
      resolve({ fetchPath, mediaInfo })
      console.log('youtubedl() finished downloading', mediaUrl)
      return output
    })
    .catch(err => {
      console.error(err)
      reject(err)
    })
    .finally(() => fs.remove(lockPath))
  })
}
