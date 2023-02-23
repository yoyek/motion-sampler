import { useState } from 'react'
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon  } from '@heroicons/react/24/outline'
import VideoSettings from '@/components/VideoSettings'

export default function SourceBar({ videoUrl, details, onChange, className }) {
  const [ inputing, setInputing ] = useState(false)

  const handleKeyDown = e => {
    if (event.code === 'Escape') {
      e.preventDefault()
      e.stopPropagation()
      console.log('on Escape', e.target?.blur())
    }
  }

  return (
    <div className={`source-bar bg-zinc-900 lg:bg-zinc-800 flex border-b border-zinc-800 lg:border-none ${className}`}>
      <div className="grow">
        <input
          className="w-[430px] h-12 lg:h-auto select-all py-1.5 bg-transparent text-zinc-400 pl-3 text-base rounded-none focus:text-white"
          type="search"
          placeholder="Paste video url here"
          defaultValue={videoUrl}
          onChange={e => onChange(e.target.value)}
          onFocus={e => setInputing(true) || e.target.select()}
          onBlur={e => setInputing(false)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {inputing &&
        <button
          className="h-12 lg:h-auto px-3 py-3.5 lg:py-1.5 bg-zinc-100/20 relative group"
        >
          <PaperAirplaneIcon className="w-5 h-5 cursor-pointer" />
        </button>
      }
      {!inputing && 
        <VideoSettings details={details}>
          <InformationCircleIcon className="h-8 px-2 pt-1.5" />
        </VideoSettings>
      }
    </div>
  )
}
