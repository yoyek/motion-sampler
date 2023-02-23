import path from 'path'

const {
  NEXT_PUBLIC_PROGRESS_INTERVAL,
  NEXT_PUBLIC_SLIDER_PADDING,
  NEXT_PUBLIC_AUTOPLAY,
  NEXT_PUBLIC_DEFAULT_OUTPUT,
} = process.env.NODE_ENV

const config = {
  autoplay: NEXT_PUBLIC_AUTOPLAY === 'true' || NEXT_PUBLIC_AUTOPLAY === '1',
  progressInterval: NEXT_PUBLIC_PROGRESS_INTERVAL
    ? parseInt(NEXT_PUBLIC_PROGRESS_INTERVAL)
    : 30,
  sliderPadding: NEXT_PUBLIC_SLIDER_PADDING
    ? parseInt(NEXT_PUBLIC_SLIDER_PADDING)
    : 30,
  defaultOutput: NEXT_PUBLIC_DEFAULT_OUTPUT || 'flac',
  defaultDetails: {
    duration: 0,
    fps: 30
  },
  defaultPlayerState: {
    isLooping: false,
    isMuted: false,
    isSeeking: false,
    isResizing: false,
    volume: 0.75,
  },
  shortSeek: 5,
  longSeek: 20,
}

export default config
