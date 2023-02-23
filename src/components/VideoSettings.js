import { useState } from 'react'
import VideoDetails from '@/components/VideoDetails'

export default function VideoSettings({ details, className, children }) {
  const [ isInfoShown, setIsInfoShown ] = useState(false)

  return (
    <div className={`relative ${className}`}>
      <button
        className="cursor-pointer"
        onClick={() => setIsInfoShown(!isInfoShown)}
      >
        {children}
      </button>
      {isInfoShown && 
        <VideoDetails
          details={details}
          className="absolute mt-2 -left-[288px] w-[380px] lg:mt-auto lg:left-auto lg:top-auto lg:bottom-9 lg:right-2"
        />
      }
    </div>
  )
}
