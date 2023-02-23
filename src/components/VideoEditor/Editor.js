import { useState, useRef, useEffect, useMemo } from 'react'
import { getNextRangeColor } from '@/lib/colors'
import { getNextId } from '@/lib/uid'
import { playerConfig, getDetailsFromPlayer } from '@/lib/player'
import { useFirstRender } from '@/hooks/useFirstRender'
import { useWindowSize } from '@/hooks/useWindowSize'
import { useEditorHotkeys } from '@/hooks/useEditorHotkeys'
import config from '@/config/frontend'
import ReactPlayer from 'react-player'
import SeekSlider from './SeekSlider'
import RangeSelector from './RangeSelector'
import Transport from './Transport'
import CuttingControls from './CuttingControls'
import RangeBar from './RangeBar'
import SourceBar from './SourceBar'
import DownloadBar from './DownloadBar'
import TopBar from './TopBar'
const { progressInterval, sliderPadding } = config

export default function VideoEditor({
  videoUrl,
  ranges,
  formats,
  startTime,
  playerState,
  details,
  outputFormat,
  onUrlChange,
  onRangesChange,
  onPlayerState,
  onDetailsChange,
  onFormatChange,
  className,
}) {
  const isFirstRender = useFirstRender()
  const windowSize = useWindowSize()
  const controlsRef = useRef()
  const hostVideo = useRef()

  const [ activeRange, setActiveRange ] = useState(null)
  const [ currentSeek, setCurrentSeek ] = useState(startTime || 0)
  const [ controlsState, setControlsState ] = useState({})
  const [ isPlaying, setIsPlaying ] = useState(true)
  const [ isRangePlay, setIsRangePlay ] = useState(false)
  const [ isSeeking, setIsSeeking ] = useState(false)
  const [ isResizing, setIsResizing ] = useState(false)

  const activateRange = (range, doSeek) => {
    setActiveRange(range || null)
    setIsRangePlay(false)
    if (range && doSeek) {
      console.log(`activateRange ${range?.id} + doSeek`)
      // setIsRangePlay(true)
      handleSeek(range.from)
    }
  }

  const handleRemoveRange = removeRangeId => {
    if (!removeRangeId) return
    onRangesChange(old => old.filter(r => r.id !== removeRangeId))
    if (activeRange?.id === removeRangeId) {
      activateRange(null)
    }
  }

  const handleOnProgress = e => {
    if (isSeeking || isResizing) return
    setCurrentSeek(e.playedSeconds)
  }

  const handleSeek = (time, pause) => {
    // const duration = depsRef?.current?.details?.duration || details.duration
    const duration = details.duration
    if (time < 1) time = 0
    if (time > duration) time = duration
    setCurrentSeek(time)
    hostVideo.current.seekTo(time)
    pause && handlePause()
  }

  const handlePlay = () => {
    setIsPlaying(true)
  }

  const handlePause = () => {
    setIsPlaying(false)
  }

  const handleLastFrame = () => {
    setIsPlaying(false)
    handleSeek(Math.max(0, currentSeek - (1/details.fps)))
  }

  const handleNextFrame = () => {
    setIsPlaying(false)
    handleSeek(Math.min(details.duration, currentSeek + (1/details.fps)))
  }

  const handlePlayerReady = async e => {
    const player = hostVideo.current
    const playerDetails = getDetailsFromPlayer(player, e)
    onDetailsChange(old => ({ ...old, ...playerDetails }))
  }

  const handleUpdateRange = newRange => {
    if (activeRange) {
      onRangesChange(old => old.map(r => 
        r.id === activeRange.id ? { ...r, ...newRange } : r
      ))
    }
  }

  const handleCutFrom = () => {
    if (!controlsState.cutFrom) return
    let range = activeRange
    let newBase

    // Remove previously started new range
    // And create new one
    if (range && range.from === range.to) {
      handleRemoveRange(range.id)
      newBase = { ...range }
      range = null
    }

    //  Create new range if seek is after current
    if (range && currentSeek > range.to) {
      range = null
    }

    // Update active range start point
    if (range) {
      return onRangesChange(o => o.map(r => 
        r.id === activeRange.id ? { ...r, from: currentSeek } : r
      ))
    }

    // Create new range
    if (!controlsState.hoverRangeId || newBase) {
      const newRange = {
        id: newBase?.id || getNextId(ranges),
        from: currentSeek,
        to: currentSeek,
        color: newBase?.color || getNextRangeColor(ranges)
      }
      activateRange(newRange)
      onRangesChange(old => {
        return [ ...old, newRange ]
      })
    }
  }

  const handleCutTo = () => {
    if (!controlsState.cutTo) return
    if (activeRange) {
      onRangesChange(old => old.map(r => 
        r.id === activeRange.id ? { ...r, to: currentSeek } : r
      ))
    }
  }

  const handlePlayChunk = () => {
    if (!activeRange) return
    handleSeek(activeRange.from)
    handlePlay()
    setIsRangePlay(true)
  }

  const handleStopChunk = () => {
    if (!activeRange) return
    handlePause()
    setIsRangePlay(false)
  }

  const handleLoopToggle = () => {
    onPlayerState(old => ({ ...old, isLooping: !old.isLooping }))
  }

  const handleMuteToggle = () => {
    onPlayerState(old => ({ ...old, isMuted: !old.isMuted }))
  }

  const handleControlsUpdate = newControls => {
    setControlsState(old => ({ ...old, ...newControls }))
  }

  // Update active range change
  useEffect(() => {
    if (activeRange && !isFirstRender)
      setActiveRange(ranges.find(r => r.id === activeRange.id))
  }, [ranges])

  // Cleanup zero length ranges
  useEffect(() => {
    onRangesChange(old => old.filter(r => {
      return !(r.from === r.to) || (activeRange && r.id === activeRange.id)
    }))
  }, [activeRange])

  // Stop range playback if we reach end of range
  useEffect(() => {
    if (
      isPlaying &&
      isRangePlay &&
      activeRange &&
      currentSeek >= activeRange.to &&
      activeRange.from !== activeRange.to
    ) {
      if (playerState.isLooping)
        handleSeek(activeRange.from)
      else 
        handleStopChunk()
    }
  }, [currentSeek, playerState, activeRange])

  const depsRef = useEditorHotkeys({
    currentSeek,
    isPlaying,
    activeRange,
    details,
    activateRange,
    handleCutFrom,
    handleCutTo,
    handleSeek,
    handlePlay,
    handlePause,
    handleRemoveRange,
  })

  const playerClass = useMemo(() => {
    if (details.extractor === 'mixcloud')
      return 'bottom-0 right-[30px] left-[30px] h-[180px]'
    if (details.extractor === 'facebook')
      return 'inset-0 aspect-square h-full mx-auto'
    return 'inset-0'
  }, [details.extractor])

  return (
    <section className={`video-editor w-full relative ${className}`}>
      <div className="video-preview absolute inset-0 bottom-[174px] lg:bottom-[88px] group">
        <TopBar
          className="absolute right-0 lg:top-0 z-30"
          details={details}
          onClick={() => onUrlChange('')}
        />
        <div
          className={`react-player-wrapper absolute overflow-hidden object-contain ${playerClass}`}
        >
          <ReactPlayer
            url={videoUrl}
            muted={playerState.isMuted}
            width="100%"
            height="100%"
            ref={hostVideo}
            playing={isPlaying}
            onProgress={handleOnProgress}
            controls={false}
            progressInterval={progressInterval}
            onReady={handlePlayerReady}
            onPlay={handlePlay}
            onPause={handlePause}
            config={playerConfig}
          />
        </div>
      </div>
      <div className="bottom-bar absolute inset-0 top-auto">

        <SeekSlider
          className="z-20"
          padding={sliderPadding}
          duration={details.duration}
          chapters={details.chapters}
          currentSeek={currentSeek}
          onChange={handleSeek}
          onSeeking={setIsSeeking}
        />
        {videoUrl && (
          <RangeSelector
            className="w-full h-[40px] mt-[14px] mb-[3px]"
            padding={sliderPadding}
            ranges={ranges}
            activeRange={activeRange}
            totalTime={details.duration}
            onActivate={range => activateRange(range, true)}
            onChange={onRangesChange}
            seek={currentSeek}
            onControlsUpdate={handleControlsUpdate}
            onSeek={handleSeek}
            onDoubleClick={() => controlsRef?.current?.openEditing()}
            onResizing={setIsResizing}
          />
        )}

        <div className="app-controls bg-zinc-900 lg:flex">
          <Transport
            className=""
            playerState={playerState}
            isPlaying={isPlaying}
            details={details}
            currentSeek={currentSeek}
            onPause={handlePause}
            onPlay={handlePlay}
            onLastFrame={handleLastFrame}
            onNextFrame={handleNextFrame}
            onVolumeChange={volume => onPlayerState(old => ({ ...old, volume }))}
            onLoopToggle={handleLoopToggle}
            onMuteToggle={handleMuteToggle}
          >
            <CuttingControls
              range={activeRange}
              ranges={ranges}
              controlsState={controlsState}
              onTimeFrom={handleCutFrom}
              onTimeTo={handleCutTo}
            />
          </Transport>
          <RangeBar
            className={`h-9 flex-grow`}
            range={activeRange}
            isRangePlay={isRangePlay}
            onPlayChunk={handlePlayChunk}
            onClose={() => activateRange(null)}
            onRemove={() => handleRemoveRange(activeRange.id)}
            onChange={newRange => handleUpdateRange(newRange) }
            innerRef={controlsRef}
          >
            <DownloadBar
              videoUrl={videoUrl}
              details={details}
              range={activeRange}
              formats={formats}
              outputFormat={outputFormat}
              onFormatChange={onFormatChange}
            />
          </RangeBar>
          {windowSize.width > 400 && (
            <SourceBar
              videoUrl={videoUrl}
              onChange={onUrlChange}
              details={details}
            />
          )}
        </div>
      </div>
    </section>
  )
}
