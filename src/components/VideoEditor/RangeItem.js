import { useEffect, useRef, useState } from 'react'
import { getColorByName } from '@/lib/colors'
import { formatTimecode } from '@/lib/format'

export default function RangeItem({
  range,
  limits,
  totalWidth,
  totalTime,
  isActive,
  minSec,
  padding,
  onActive,
  onSeek,
  onDoubleClick,
  onChange,
  onResizing
}) {

  const minWidth = totalWidth * (minSec / totalTime)
  const elementRef = useRef()
  const [left, setLeft] = useState()
  const [width, setWidth] = useState()
  const [leftLimit, setLeftLimit] = useState()
  const [rightLimit, setRightLimit] = useState()
  const [isResizing, setIsResizing] = useState(false)
  const emptyRange = range.to === range.from

  useEffect(() => {
    setLeft(totalWidth * (range.from / totalTime))
    setWidth(totalWidth * ((range.to - range.from) / totalTime))
    setLeftLimit(totalWidth * (limits[0] / totalTime))
    setRightLimit(totalWidth * (limits[1] / totalTime))
  }, [totalWidth, limits, range])

  useEffect(() => {
    setIsResizing(true)
    onResizing && onResizing(true)
    const delayDebounceFn = setTimeout(() => {
      setIsResizing(false)
      onResizing && onResizing(false)
    }, 100)
    return () => clearTimeout(delayDebounceFn)
  }, [left, width])

  const handleMouseDown = (e, side) => {
    e.preventDefault()
    e.stopPropagation()
    const ref = elementRef.current

    const orgWidth = parseFloat(
      getComputedStyle(ref, null).getPropertyValue("width").replace("px", "")
    )
    let originalElementX = ref.getBoundingClientRect().left
    let originalMouseX = e.pageX

    const onMouseMove = (e) => {
      document.body.style.cursor = "col-resize !important"

      if (side === "right") {
        let newWidth = e.pageX - ref.getBoundingClientRect().left

        if (newWidth <= 0) return
        if (newWidth < minWidth) newWidth = minWidth
        if (left + newWidth > rightLimit) newWidth = rightLimit - left

        setWidth(newWidth)

        const to = (newWidth + left) / totalWidth * totalTime
        onChange && onChange({ ...range, to })

        onSeek && onSeek(to)

      } else if (side === "left") {
        const offset = (e.pageX - originalMouseX)
        let newWidth = orgWidth - offset
        let newLeft = originalElementX + offset - padding

        if (newLeft > (width + left)) return
        if (newWidth <= minWidth) return
        if (newLeft <= leftLimit) {
          newWidth = newWidth + (newLeft - leftLimit)
          newLeft = leftLimit
        }

        setWidth(newWidth)
        setLeft(newLeft)

        const from = newLeft / totalWidth * totalTime
        const to = (newWidth + newLeft) / totalWidth * totalTime
        onChange && onChange({ ...range, from, to })

        onSeek && onSeek(from)
      }
    }

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove)
      document.body.style.cursor = "auto"
    };

    if (elementRef) {
      window.addEventListener("mousemove", onMouseMove)
      window.addEventListener("mouseup", onMouseUp)
    }
  }

  const onClick = e => {
    e.preventDefault()
    e.stopPropagation()
  }

  const onMouseDown = e => {
    e.preventDefault()
    e.stopPropagation()
    onActive(range)

    if (e.detail === 2 && onDoubleClick) {
      onDoubleClick(range)
    }
  }

  const color = getColorByName(range.color) || null

  return (
    <div
      ref={elementRef}
      className={`absolute top-0 bottom-0 cursor-pointer border-2 ${isActive && !emptyRange ? 'active z-10 border-white/30 outline-2 outline outline-black' : 'not-active border-white/10 opacity-50 hover:opacity-60'}`}
      style={{
        width: `${width}px`,
        left: `${left}px`,
        backgroundColor: color?.base || 'rgba(255,255,255,0.5)',
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
    >
      {width > 25 && (
        <>
          <div
            className="range-label px-1.5 py-0.5 text-sm overflow-hidden absolute inset-0 right-1 -top-0.5 whitespace-nowrap"
          >
            #{range.id} { range.name }
            <small className="block -mt-1 opacity-80">
              {Math.round(range.to - range.from)}s [{formatTimecode(range.from, true, true)} - {formatTimecode(range.to, true, true)}]
            </small>
          </div>
        </>
      )}
      <div className="w-full h-full relative hidden lg:block">
        {isActive && (
          <>
            {range.from !== range.to && (
              <div
                className="-left-[1px] -translate-x-1/2 -translate-y-1/2 absolute top-1/2 w-3 h-3 bg-white border rounded cursor-col-resize"
                onMouseDown={(e) => handleMouseDown(e, "left")}
              ></div>
            )}
            <div
              className="-right-[2px] translate-x-1/2 -translate-y-1/2 absolute top-1/2 w-3 h-3 bg-white border rounded cursor-col-resize"
              onMouseDown={(e) => handleMouseDown(e, "right")}
            ></div>
          </>
        )}
      </div>
    </div>
  )
}

