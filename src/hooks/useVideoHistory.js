import { useState, useEffect } from "react"
import { getNextId } from '@/lib/uid'
import { loadHistory, saveHistory } from '@/lib/storage'

const useVideoHistory = () => {
  const [ history, setHistory ] = useState([])

  const pushToHistory = videoUrl => {
    if (history.find(h => h.url === videoUrl)) return
    const newHistory = [{ id: getNextId(history) || 1, url: videoUrl }, ...history]
    setHistory(newHistory)
    saveHistory(newHistory)
  }

  const removeFromHistory = historyItem => {
    if (!historyItem?.id) return
    const newHistory = history.filter(i => i.id !== historyItem.id)
    setHistory(newHistory)
    saveHistory(newHistory)
  }

  const flushHistory = () => {
    setHistory([])
    saveHistory([])
  }

  // On init
  useEffect(() => setHistory(loadHistory()), [])

  return [ history, pushToHistory, removeFromHistory, flushHistory ]
}

export { useVideoHistory }
