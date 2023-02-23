import { useState, useRef, useEffect } from 'react'
import { getNextId } from '@/lib/uid'
import { hashCode } from '@/lib/format'
import { outputFormats } from '@/api-lib/outputFormats'
import { useFirstRender } from '@/hooks/useFirstRender'
import { useVideoHistory } from '@/hooks/useVideoHistory'
import { useDetailsUpdater } from '@/hooks/useDetailsUpdater'
import { parseMediaLink } from '@/lib/url'
import config from '@/config/frontend'
import backendConfig from '@/config/backend'
import VideoEditor from '@/components/VideoEditor/Editor'
import UrlPage from '@/components/UrlPage'
import {
  loadVideoData,
  loadVideoDetails,
  loadEditorState,
  saveVideoData,
  saveVideoDetails,
  saveEditorState,
} from '@/lib/storage'

const { autoplay, defaultDetails, defaultPlayerState, defaultOutput } = config

export default function VideoPage({ formats }) {
  const isFirstRender = useFirstRender()
  const [ url, setUrl ] = useState('')
  const [ urlHash, setUrlHash ] = useState()
  const [ ranges, setRanges ] = useState([])
  const [ videoDetails, setVideoDetails ] = useState(defaultDetails)
  const [ startTime, setStartTime ] = useState(0)
  const [ outputFormat, setOutputFormat ] = useState(defaultOutput)
  const [ playerState, setPlayerState ] = useState(defaultPlayerState)

  const [
    history, pushToHistory, removeFromHistory, flushHistory
  ] = useVideoHistory()

  const handleUrlChange = (newUrl) => {
    const { mediaUrl, timestamp } = parseMediaLink(newUrl) || {}
    const urlHash = hashCode(mediaUrl)

    setUrl(mediaUrl || '')
    setUrlHash(urlHash)

    if (mediaUrl) {
      const { ranges } = loadVideoData(urlHash) || {}
      setVideoDetails(loadVideoDetails(urlHash) || defaultDetails)
      setRanges(ranges || [])
      timestamp && setStartTime(timestamp)
      pushToHistory(mediaUrl)
    }
  }

  useDetailsUpdater(url, setVideoDetails)

  // On init
  useEffect(() => { 
    const { playerState, outputFormat } = loadEditorState()
    playerState && setPlayerState(playerState)
    outputFormat && setOutputFormat(outputFormat)
  }, [])

  // Save player state
  useEffect(() => {
    if (!isFirstRender) {
      saveEditorState({ playerState, outputFormat })
    }
  }, [playerState, outputFormat])

  // Save video data
  useEffect(() => {
    if (!isFirstRender) {
      saveVideoData(urlHash, { ranges })
    }
  }, [ranges])

  // Save video details
  useEffect(() => {
    if (!isFirstRender) {
      saveVideoDetails(urlHash, videoDetails)
    }
  }, [videoDetails])

  if (!url) {
    return (
      <main className="url-page">
        <UrlPage
          history={history}
          onRemoveFromHistory={removeFromHistory}
          onFlushHistory={flushHistory}
          onUrlChange={handleUrlChange}
        />
      </main>
    )
  }

  return (
    <main className="editor-page">
      <VideoEditor
        className="h-[86vh] lg:h-[100vh]"
        videoUrl={url}
        ranges={ranges}
        formats={formats}
        startTime={startTime}
        playerState={playerState}
        details={videoDetails}
        outputFormat={outputFormat}
        onUrlChange={handleUrlChange}
        onRangesChange={setRanges}
        onPlayerState={setPlayerState}
        onDetailsChange={setVideoDetails}
        onFormatChange={setOutputFormat}
      />
    </main>
  )
}

export async function getStaticProps(context) {
  const { audioOnly } = backendConfig

  // Filter properties for frontend
  const formats = outputFormats
    .map(({ name, label, type }) => ({ name, label, type }))
    .filter(format => !audioOnly || format.type === 'audio')

  return { props: { formats } }
}
