import ReactPlayer from 'react-player'

export const canPlayUrl = url => {
  return ReactPlayer.canPlay(url)
}

export const parseMediaLink = url => {
  const { mediaUrl, videoId: id, timestamp, playlistId } = parseYoutubeLink(url) || {}
  if (id) {
    return { mediaUrl, id, timestamp, playlistId }
  }
  if (ReactPlayer.canPlay(url)) {
    return { mediaUrl: url }
  }
  return null
}

export const parseYoutubeLink = (url) => {
  if (!url) return null
  const youtubeUrlPattern = /^(https?:\/\/)?(www\.)?(youtube\.com\/(live|watch|playlist)|youtu\.be\/|www\.youtube\.com\/shorts\/)[^\s]+$/

  if (!youtubeUrlPattern.test(url))
    return null

  const urlParts = new URL(url)
  const params = new URLSearchParams(urlParts.search)
  const playlistId = params.get('list') || null

  let videoId = null
  let timestamp = null

  if (urlParts.hostname === 'youtu.be') {
    videoId = urlParts.pathname.substr(1)
    const tParam = urlParts.search.match(/[#&]t=([^&]*)/)?.[1]
    if (tParam) {
      const regex = /(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
      const matches = tParam.match(regex)
      timestamp = (matches[1] ? parseInt(matches[1]) * 3600 : 0)
        + (matches[2] ? parseInt(matches[2]) * 60 : 0)
        + (matches[3] ? parseInt(matches[3]) : 0)
    }
  } else if (urlParts.hostname === 'www.youtube.com') {
    if (urlParts.pathname === '/watch') {
      videoId = params.get('v')
      const tParam = params.get('t') || urlParts.search.match(/[#&]t=([^&]*)/)?.[1]
      if (tParam) {
        const regex = /(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/
        const matches = tParam.match(regex)
        timestamp = (matches[1] ? parseInt(matches[1]) * 3600 : 0)
          + (matches[2] ? parseInt(matches[2]) * 60 : 0)
          + (matches[3] ? parseInt(matches[3]) : 0)
      }
    } else if (
      urlParts.pathname === '/playlist' ||
      urlParts.pathname.startsWith('/shorts/') ||
      urlParts.pathname.startsWith('/live/')
    ) {
      const pathParts = urlParts.pathname.split('/')
      videoId = pathParts[2]
    }
  }

  return {
    videoId,
    timestamp,
    playlistId,
    mediaUrl: `https://www.youtube.com/watch?v=${videoId}`,
  }
}
