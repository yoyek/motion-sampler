import { formatTimecode } from '@/lib/format'
import { SpeakerWaveIcon, SpeakerXMarkIcon, } from '@heroicons/react/24/outline'
import {
  PlayIcon,
  PauseIcon,
  ArrowUpTrayIcon,
  ArrowPathIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/solid'

export default function Transport({
  playerState,
  isPlaying,
  details,
  currentSeek,
  onPause,
  onPlay,
  onLastFrame,
  onNextFrame,
  onVolumeChange,
  onLoopToggle,
  onMuteToggle,
  className,
  children,
}) {

  const { isLooping, isMuted } = playerState

  return (
    <div className={`player-transport flex ${className}`}>
      {isPlaying ? (
        <button className="h-9 px-2 py-1 bg-zinc-800 border-r border-r-zinc-700" onClick={onPause}>
          <PauseIcon className="w-7 h-7 cursor-pointer" />
        </button>
      ) : (
        <button className="h-9 px-2.5 py-1.5 bg-zinc-800 border-r border-r-zinc-700" onClick={onPlay}>
          <PlayIcon className="w-6 h-6 cursor-pointer" />
        </button>
      )}
      {isMuted ? (
        <button className="h-9 px-2.5 py-1.5 bg-zinc-800 text-zinc-500" onClick={e => onMuteToggle(false)}>
          <SpeakerXMarkIcon className="w-5 h-5 cursor-pointer" />
        </button>
      ) : (
        <button className="h-9 px-2.5 py-1.5 bg-zinc-800" onClick={e => onMuteToggle(true)}>
          <SpeakerWaveIcon className="w-5 h-5 cursor-pointer" />
        </button>
      )}
      <button
        className={`px-2.5 py-1.5 border-r border-r-zinc-700  bg-zinc-800 ${isLooping ? 'text-white' : 'text-zinc-500'}`}
        onClick={e => onLoopToggle && onLoopToggle()}
      >
        <ArrowPathIcon className={`w-5 h-5 cursor-pointer`} />
      </button>
      <button className="h-9 px-2.5 py-1.5 bg-zinc-800 border-r border-r-zinc-700" onClick={onLastFrame}>
        <ChevronLeftIcon className="w-5 h-5 cursor-pointer" />
      </button>
      <button className="h-9 px-2.5 py-1.5 bg-zinc-800 border-r border-r-zinc-700" onClick={onNextFrame}>
        <ChevronRightIcon className="w-5 h-5 cursor-pointer" />
      </button>
      <div className={`timecode h-9 px-2.5 py-[3px] lg:py-2 text-xs lg:text-sm leading-tight text-zinc-400 font-mono`}>
        {formatTimecode(currentSeek, true, true)}<span className="hidden lg:inline">&nbsp;</span>/ {formatTimecode(details.duration, true, true)}
      </div>
      {children}
    </div>
  )
}
