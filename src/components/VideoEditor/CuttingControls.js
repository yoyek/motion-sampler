import { ArrowUpTrayIcon } from '@heroicons/react/24/solid'
import { getColorByName } from '@/lib/colors'

export default function CuttingControls({ range, ranges, controlsState, onTimeFrom, onTimeTo }) {
  const color = range?.color ? getColorByName(range.color) : null
  const fromDisabled = !controlsState.cutFrom
  const toDisabled = !controlsState.cutTo
  const isEmpty = range && range.from === range.to

  return (
    <div
      className="cutting-controls flex relative"
    >
      <button
        className={`h-9 px-3 py-1.5 bg-zinc-800 border-r border-r-zinc-700 hover:bg-zinc-700 disabled:text-zinc-500`}
        onClick={onTimeFrom}
        disabled={fromDisabled}
      >
        <ArrowUpTrayIcon className="w-5 h-5 cursor-pointer rotate-90" />
      </button>
      <button
        className={`h-9 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 disabled:text-zinc-500`}
        onClick={onTimeTo}
        disabled={toDisabled}
      >
        <ArrowUpTrayIcon className="w-5 h-5 cursor-pointer -rotate-90" />
      </button>
      {ranges.length === 0 && (
        <div className="w-[320px] -ml-[290px] -mt-8 flex justify-end text-sm absolute top-0 left-0">
          <span className="opacity-50">Play video, find moment and start cutting</span>
          <span className="w-5 h-5 mt-1 ml-1">👇</span>
        </div>
      )}
      {isEmpty && (
        <div className="text-sm flex justify-end lg:justify-start absolute w-[320px] -ml-[239px] lg:ml-[102px] mt-[43px] lg:mt-2">
          <span className="hidden lg:inline w-5 h-5 mr-3">👈</span>
          <span className="opacity-50">Now play forward, then set ending point</span>
          <span className="lg:hidden w-5 h-5 ml-2 mr-2">☝</span>
        </div>
      )}
    </div>
  )
}
