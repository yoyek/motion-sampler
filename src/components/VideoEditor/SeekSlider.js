import { useState, useEffect, useCallback } from 'react'
import { VideoSeekSlider } from "react-video-seek-slider"
import "react-video-seek-slider/styles.css"

export default function SeekSlider({ duration, currentSeek, padding, chapters, onChange, onSeeking, className }) {
  const [sliderTime, setSliderTime] = useState()
  const [isSeeking, setIsSeeking] = useState(false)
  const [timeCodes, setTimeCodes] = useState(null)

  useEffect(() => {
    if (!chapters?.length) return setTimeCodes(null)
    setTimeCodes(chapters.map(({ start_time, title }) => { 
      return {
        fromMs: start_time * 1000,
        description: title,
      }
    }))
  }, [chapters])

  useEffect(() => {
    onChange((sliderTime || 0) / 1000)
    setIsSeeking(true)
    onSeeking && onSeeking(true)
    const delayDebounceFn = setTimeout(() => {
      setIsSeeking(false)
      onSeeking && onSeeking(false)
    }, 100)
    return () => clearTimeout(delayDebounceFn)
  }, [sliderTime])

  if (!duration) return ''

  const sliderProps = {
    limitTimeTooltipBySides: false,
    max: duration * 1000,
    currentTime: currentSeek * 1000,
    onChange: setSliderTime,
    secondsPrefix: "00:00:",
    minutesPrefix: "00:",
    ...(timeCodes && {timeCodes})
  }

  return (
    <div
      className={`seek-slider bg-gray-800 block relative ${className}`}
      style={{
        paddingLeft: padding && `${padding}px`,
        paddingRight: padding && `${padding}px`
      }}
    >
      <VideoSeekSlider {...sliderProps} />
    </div>
  )
}
