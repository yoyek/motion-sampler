import { XMarkIcon } from '@heroicons/react/24/solid'
import { InformationCircleIcon  } from '@heroicons/react/24/outline'
import VideoSettings from '@/components/VideoSettings'

export default function EditorTopBar({
  details,
  onClick,
  className
}) {

  return (
    <div className={`editor-top-bar flex lg:border-b lg:border-l lg:border-zinc-100/30 rounded-bl ${className}`}>
      <VideoSettings
        className="close-editor lg:hidden h-12 py-2.5 px-2.5 bg-zinc-900 rounded-bl"
        details={details}
      >
        <InformationCircleIcon className="w-7 h-7" />
      </VideoSettings>
      <button
        className="close-editor p-2 bg-zinc-900 border-l border-zinc-100/20"
        onClick={e => {
          e.preventDefault()
          e.stopPropagation()
          onClick()
        }}
      >
        <XMarkIcon className="h-8 w-8" />
      </button>
    </div>
  )
}
