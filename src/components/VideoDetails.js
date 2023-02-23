import Image from 'next/image'
import { useMemo } from 'react'
import { formatTimecode, getResolutionName } from '@/lib/format'
import { format as formatDate, parseISO } from 'date-fns'
import { formatBytes } from '@/lib/format'

export default function VideoDetails({ details, className }) {
  const isVideo = details.type === 'video'

  const dateFormatted = useMemo(() => {
    return details.uploadDate && formatDate(parseISO(details.uploadDate, 'yyyymmdd', {}), 'yyyy-MM-dd')
  }, [details.uploadDate])

  return (
    <div className={`bg-black border border-zinc-100/20 text-left z-30 rounded overflow-hidden ${className}`}>
      <h3 className="text-lg font-light my-3 mx-4">{details.title}</h3>
      {details.thumbnail && (
        <div className="relative w-full overflow-hidden aspect-video">
          <Image
            className="object-cover w-full h-full"
            src={details.thumbnail}
            width={480}
            height={360}
            alt={details.title}
          />
        </div>
      )}
      <ul className="my-4 mx-4 text-sm text-zinc-400 list-disc pl-4">
        <li className="mb-1">
          ID: {details.mediaId}
        </li>
        <li className="mb-1">
          Duration: {details.duration ? formatTimecode(details.duration, true, true) : '?'}
        </li>
        {details.channel && (
          <li className="mb-1">
            Author: <a href={details.channelUrl} target="_blank" rel="noreferrer">{details.channel}</a>
          </li>
        )}
        {details._extended && (
          <>
            <li className="mb-1">
              Site: <a href={details.mediaUrl} target="_blank" rel="noreferrer">{details.extractorKey}</a>
            </li>
            <li className="mb-1">
              Type: {details.type}
            </li>
            <li className="mb-1">
              Source type: {details.ext}
            </li>
            {isVideo && (
              <>
                {details.width && (
                  <li className="mb-1">
                    Resolution: {getResolutionName(details.width, details.height)} (w:{details.width}x{details.height})
                  </li>
                )}
                <li className="mb-1">
                  FPS: {details.fps}
                </li>
                <li className="mb-1">
                  Video Codec: {details.videoCodec} ({Math.round(details.vbr) || '?'}kbps)
                </li>
              </>
            )}
            <li className="mb-1">
              Audio Codec: {details.audioCodec} ({Math.round(details.abr) || '?'}kbps)
            </li>
            <li className="mb-1">
              {details.isLive ? 'Started' : 'Uploaded'} at: {dateFormatted}
            </li>
            {(details.filesize || details.filesizeApprox) && (
              <li className={`mb-1 ${details.tooBig ? 'text-red-400' : ''}`}>
                Source size: { details.filesize ? formatBytes(details.filesize || 0) : '~' + formatBytes(details.filesizeApprox || 0)}
              </li>
            )}
            {details.isLive && (
              <li className="mb-1 text-red-400">
                Live: YES
              </li>
            )}
            {!details.isFetchable &&
              <li className="mb-1 text-red-400">
                Not fetchable - {details.fetchReason}
              </li>
            }
            {details.isFetchable &&
              <li className="mb-1">
                <span>Status: </span>
                {details.isFetched &&
                  <span className="text-lime-500">Ready for processing</span>
                }
                {details.isFetching && (
                  <span className="text-blue-500">Fetching media...</span>
                )}
                {!details.isFetched && !details.isFetching && 
                  <span className="opacity-60">Waiting...</span>
                }
              </li>
            }
          </>
        )}
      </ul>
    </div>
  )
}
