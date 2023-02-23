const playerConfig = {
  youtube: {
    playerVars: {
      rel: 0,
      showinfo: 0,
      preload: true,
    },
  },
  facebook: {
    attributes: {
    },
  },
}

const getDetailsFromPlayer = (player, readyRes) => {
  const iplayer = player.getInternalPlayer()
  const videoData = iplayer.playerInfo?.videoData || {}
  const duration = player.getDuration()
  return {
    ...(videoData.video_id && {mediaId: videoData.video_id}),
    ...(duration && {duration: player.getDuration()}),
    ...(videoData.author && {channel: videoData.author}),
    ...(iplayer.videoTitle && {title: iplayer.videoTitle}),
  }
}

export { getDetailsFromPlayer, playerConfig }
