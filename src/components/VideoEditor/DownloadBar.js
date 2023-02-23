import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { toQueryString } from '@/lib/format'

export default function DownloadControls({
  videoUrl,
  details,
  range,
  formats,
  outputFormat,
  onFormatChange
}) {

  const emptyRange = range && range.from === range.to

  const downloadRangeUrl = output => {
    const queryStr = toQueryString({
      videoUrl,
      from: range?.from || '',
      to: range?.to || '',
      name: range?.name || '',
      output,
    })
    return `/api/download?${queryStr}`
  }

  if (!videoUrl || !details || emptyRange) return ""

  if (!details.isFetchable) {
    if (range || !details.fetchReason) return ""
    return (
      <div className="px-3 py-2.5 text-red-400 opacity-70 text-xs">
        Not fetchable. {details.fetchReason}
      </div>
    )
  }

  if (details.isFetching) {
    if (range) return ""
    return (
      <div className="px-3 py-2.5 text-blue-400 opacity-70 text-xs">
        Fetching media...
      </div>
    )
  }

  if (!details.isFetched) return ""

  return (
    <div className="download-controls h-9 pl-1 text-gray-400 flex text-sm">
      <select
        className={`h-9 m-0 text-white text-right w-[80px] lg:w-auto opacity-50 rounded-none`}
        style={{ backgroundColor: 'transparent' }}
        value={outputFormat}
        onChange={e => onFormatChange(e.target.value)}
      >
        {formats.map(format => (
          <option key={format.name} value={format.name}>{format.label}</option>
        ))}
      </select>
      <a
        className="px-3 py-2"
        href={downloadRangeUrl(outputFormat)}
        target="_blank"
        rel="noreferrer"
      >
        <ArrowDownTrayIcon className="w-5 h-5 text-white" />
      </a>
    </div>
  )
}
