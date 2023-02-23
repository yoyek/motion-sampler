import Image from 'next/image'
import { hashCode } from '@/lib/format'
import { formatTimecode } from '@/lib/format'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { loadVideoDetails } from '@/lib/storage'

export default function HistoryItem({ item, onRemoveItem, onUrlChange }) {
  const urlHash = hashCode(item.url)
  const { videoId, title, thumbnail, duration, channel, extractor, channelUrl } = loadVideoDetails(urlHash) || {}

  const handleRemove = e => {
    e.preventDefault()
    e.stopPropagation()
    onRemoveItem && onRemoveItem(item)
  }

  return (
    <li className="history-item w-90 mb-9 group">
      <button
        className="text-left w-full"
        onClick={e => onUrlChange(item.url)}
      >
        <div className="video-thumb relative">
          <span className="video-time absolute bottom-1 right-1 z-10 py-0 px-1 bg-zinc-900/80 rounded text-sm">{formatTimecode(duration, true, true)}</span>
          <span
            className="absolute top-1 right-1 z-10 p-1 border bg-zinc-900/30 lg:hidden group-hover:block hover:bg-black rounded-full"
            onClick={handleRemove}
          >
            <XMarkIcon className="w-4 h-4" />
          </span>
          <div className="relative overflow-hidden aspect-video lg:rounded-xl">
            <Image
              className="object-cover w-full h-full"
              src={thumbnail}
              width={480}
              height={360}
              alt={title}
            />
          </div>
        </div>
        <div className="gap-3 mt-3 ">
          <h3 className="text-md">
            {title}
          </h3>
          <div className="channel text-sm">
            <span className="opacity-60">
              {channel}
            </span>
            <span className="ml-2 opacity-40">
              [{extractor}]
            </span>
          </div>
        </div>
      </button>
    </li>
  )
}
