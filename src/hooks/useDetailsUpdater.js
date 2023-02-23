import { useRef, useEffect } from 'react'
import { toQueryString } from '@/lib/format'

const useDetailsUpdater = (mediaUrl, onDetailsChange) => {
  useEffect(() => {
    let interval
    const checkFetchState = () => {
      fetch(`/api/details?${toQueryString({ mediaUrl, onlyStatus: 1 })}`)
        .then(res => res.json())
        .then(details => {
          onDetailsChange(old => ({...old, ...details}))
          if (details.isFetched || !details.isFetchable) {
            interval && clearInterval(interval)
          }
        })
    }

    if (mediaUrl) {
      fetch(`/api/details?${toQueryString({ mediaUrl })}`)
        .then(res => {
          if (!res.ok) throw Error(res.message)
          return res.json()
        })
        .then(details => {
          onDetailsChange(old => ({...old, ...details}))
          const { isFetched, isFetchable } = details
          if (!isFetched && isFetchable) {
            interval = setInterval(checkFetchState, 1500)
          }
        })
        .catch(err => console.error(err)) // retry?
    }

    return () => interval && clearInterval(interval)
  }, [mediaUrl])
}

export { useDetailsUpdater }
