import { useRef, useEffect } from 'react'
import config from '@/config/frontend'
const { shortSeek, longSeek } = config

const useEditorHotkeys = (dependencies) => {
  const depsRef = useRef(dependencies)

  useEffect(() => {
    const onGlobalKeydown = e => {
      if (e.target.nodeName === 'INPUT')
        return

      const {
        currentSeek,
        activeRange,
        details: { duration, fps },
        isPlaying,
        handleSeek,
        handleCutFrom,
        handleCutTo,
        handlePlay,
        handlePause,
        handleRemoveRange,
        activateRange,
      } = depsRef.current

      switch(e.code) {
        case 'Period':
          e.preventDefault()
          handleSeek(Math.min(duration, currentSeek + (1/fps)), true)
          break
        case 'Comma':
          e.preventDefault()
          handleSeek(Math.min(duration, currentSeek - (1/fps)), true)
          break
        case 'Backspace':
          handleRemoveRange(activeRange?.id)
          break
        case 'Escape':
          activateRange(null)
          break
        case 'BracketLeft':
          e.preventDefault()
          handleCutFrom()
          break
        case 'BracketRight':
          e.preventDefault()
          handleCutTo()
          break
        case 'ArrowLeft':
          e.preventDefault()
          handleSeek(currentSeek - (e.shiftKey ? longSeek : shortSeek))
          break
        case 'ArrowRight':
          e.preventDefault()
          handleSeek(currentSeek + (e.shiftKey ? longSeek : shortSeek))
          break
        case 'Space':
          e.preventDefault()
          isPlaying ? handlePause() : handlePlay()
          break
        default:
          break
      }
    }

    document.addEventListener('keydown', onGlobalKeydown)
    return () => document.removeEventListener('keydown', onGlobalKeydown)
  }, [])

  // Update dependencies
  useEffect(() => {
    depsRef.current = dependencies
  }, [dependencies])

  return depsRef
}

export { useEditorHotkeys }
