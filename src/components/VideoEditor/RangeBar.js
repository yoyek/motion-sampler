import { useState, useEffect } from 'react'
import { getColorByName } from '@/lib/colors'
import { formatTimecode } from '@/lib/format'
import { PencilIcon, PlayIcon, XMarkIcon, ArrowUpRightIcon, ArrowLeftIcon } from '@heroicons/react/24/solid'
import { PlayIcon as PlayIconOutline } from '@heroicons/react/24/outline'

export default function RangeBar({ range, isRangePlay, onPlayChunk, onClose, onRemove, onChange, innerRef, className, children }) {
  const [ editingRange, setEditingRange ] = useState(false)
  const [ name, setName ] = useState()
  const isEmpty = range && range.from === range.to
  const color = range?.color && !isEmpty ? getColorByName(range.color) : {}

  const handleSubmit = e => {
    onChange && onChange({ ...range, name })
    setEditingRange(false)
  }

  const handleCancel = e => {
    setEditingRange(false)
  }

  const handleInputKey = e => {
    if (e.key === 'Enter') handleSubmit(e)
    if (e.key === 'Escape') handleCancel(e)
  }

  useEffect(() => { 
    setName(range && range.name || '')
    setEditingRange(false)
  }, [range])

  useEffect(() => {
    innerRef.current.openEditing = () => setEditingRange(true)
  }, [])

  return (
    <div
      className={`range-controls relative flex ${className}`} ref={innerRef}
      style={{ backgroundColor: color.dark || 'transparent' }}
    >
      <div className="flex grow">
        {range && !isEmpty && !editingRange && (
          <>
            <div className="flex w-[220px] lg:w-auto">
              <button className="px-[2px] py-0.5 ml-2 cursor-pointer" onClick={onPlayChunk}>
                {!isRangePlay && <PlayIcon className={`w-5 text-white rounded h-5`} />}
                {isRangePlay && <PlayIconOutline className={`w-5 text-white rounded h-5`} />}
              </button>

              <div className="pl-2.5 py-2 text-sm">
                #{range.id}
              </div>
              <div className="overflow-auto lg:overflow-hidden max-w-[160px] lg:max-w-none pr-0 pl-2 py-2 text-sm flex cursor-pointer whitespace-nowrap" onClick={e => setEditingRange(true)}>
                {range.name ? range.name : <span className="opacity-50">[Untitled range]</span> }
                <PencilIcon className="w-3 h-3 opacity-40 mt-1 ml-1 mr-0.5" />
              </div>
              <div className="debug font-mono py-2.5 pr-1 ml-1 text-xs opacity-70">
                <span>{Math.round(range.to - range.from)}s</span>
                <span className="hidden xs:inline">&nbsp;[{formatTimecode(range.from, true, true)} - {formatTimecode(range.to, true, true)}]</span>
              </div>
            </div>
            <button
              className={`px-0 py-0.5`}
              onClick={e => onClose && onClose(null)}
            >
              <XMarkIcon className={`w-6 h-6 cursor-pointer`} />
            </button>
          </>
        )}
        {range && editingRange && (
          <div className="range-edit flex">
            <input
              className="bg-black bg-opacity-40 w-54 text-white px-3 text-base rounded-none"
              type="text"
              placeholder={`Range name`}
              value={name}
              onKeyDown={handleInputKey}
              onChange={e => setName(e.target.value)}
              autoFocus={true}
            />
            <button
              className="h-9 px-2.5 py-1.5 text-sm border-x border-zinc-100/20 hover:bg-zinc-100/20 disabled:opacity-40"
              onClick={handleSubmit}
            >
              SAVE
            </button>
            <button
              className="h-9 px-2.5 py-1.5 text-sm border-r border-r-zinc-100/20 hover:bg-zinc-100/20 disabled:opacity-40"
              onClick={handleCancel}
            >
              <XMarkIcon className={`w-5 h-5 cursor-pointer`} />
            </button>
            <button
              className={`px-1 text-xs text-white opacity-60 ml-2`}
              onClick={e => onRemove && onRemove(range.id)}
            >
              remove
            </button>
          </div>
        )}
      </div>
      {!editingRange && children}
    </div>
  )
}
