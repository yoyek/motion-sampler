import { useEffect, useRef, useState, useCallback } from 'react'
import RangeItem from './RangeItem'

export default function RangeSelector({ ranges, totalTime, minSec, activeRange, padding, seek, onChange, onActivate, onControlsUpdate, onDoubleClick, onSeek, onResizing, className }) {
  const containerRef = useRef()
  const [totalWidth, setTotalWidth] = useState(0)
  const [sortedRanges, setSortedRanges] = useState([])
  const [controls, setControls] = useState({ cutFrom: false, cutTo: false })

  const onRangeChange = newRange => {
    const newRanges = sortedRanges.map(r => r.id === newRange.id ? newRange : r)
    onChange && onChange(getSorted(newRanges))
  }

  const handleWindowChange = e => {
    if (!containerRef) return
    setTotalWidth(containerRef?.current?.offsetWidth || 0)
  }

  const getSorted = unsorted => {
    return [ ...unsorted ].sort((a, b) => a.from - b.from)
  }

  const getLimits = useCallback(() => {
    const newLimits = {}

    sortedRanges.forEach(range => {
      const idx = sortedRanges.findIndex(r => r.id === range.id)
      let leftLimit = 0
      let rightLimit = totalTime
      if (sortedRanges[idx - 1]) leftLimit = sortedRanges[idx - 1].to
      if (sortedRanges[idx + 1]) rightLimit = sortedRanges[idx + 1].from
      newLimits[range.id] = [ leftLimit, rightLimit, range.from, range.to ]
    })

    return newLimits
  }, [sortedRanges])

  const rangeLimit = rangeId => {
    return (getLimits())[rangeId] || {}
  }

  useEffect(() => {
    setTotalWidth(containerRef.current?.offsetWidth || 0)
    window.addEventListener('resize', handleWindowChange)
    return () => window.removeEventListener('resize', handleWindowChange)
  }, [totalTime])

  useEffect(() => {
    setSortedRanges(getSorted(ranges))
  }, [ranges])

  // Update controls
  useEffect(() => {
    const newControls = {}
    const hoverRange = sortedRanges.find(r => seek >= r.from && seek < r.to)
    newControls.hoverRangeId = hoverRange?.id || null

    if (activeRange) {
      const limit = rangeLimit(activeRange.id)
      const zeroLength = limit[2] === limit[3]

      if (zeroLength && seek !== limit[2]) {
        newControls.cutFrom = !hoverRange
      }

      if (seek < limit[0] || seek > limit[1]) {
        // Outside range limit
        if (!zeroLength)
          newControls.cutFrom = false
        newControls.cutTo = false
      } else if (seek === limit[2] || seek === limit[3]) {
        // Exacly at range edges
        newControls.cutFrom = false
        newControls.cutTo = true
      } else {
        // Inside range limit
        if (!zeroLength) {
          newControls.cutFrom = seek !== limit[3]
        }
        newControls.cutTo = seek > limit[2]
      }
    } else {
      newControls.cutFrom = !hoverRange
      newControls.cutTo = false
    }

    setControls({ ...controls, ...newControls })
    onControlsUpdate(newControls)
  }, [seek, activeRange])

  if (!totalTime) {
    return <div className={`range-container empty ${className}`} />
  }

  return (
    <div
      className="range-selector"
      style={{
        paddingLeft: padding && `${padding}px`,
        paddingRight: padding && `${padding}px`
      }}
    >
      <div
        className={`relative ${className}`}
        ref={containerRef}
        onMouseDown={e => {
          e.stopPropagation()
          return onActivate(null)
        }}
      >
        {sortedRanges.map(range => (
          <RangeItem
            key={range.id}
            range={range}
            limits={rangeLimit(range.id)}
            totalWidth={totalWidth}
            totalTime={totalTime}
            padding={padding}
            onChange={onRangeChange}
            onDoubleClick={range => onDoubleClick && onDoubleClick(range)}
            minSec={minSec}
            isActive={range.id === activeRange?.id}
            onActive={onActivate}
            onSeek={onSeek}
            onResizing={onResizing}
          />
        ))}
      </div>
    </div>
  )
}

