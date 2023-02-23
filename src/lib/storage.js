const { parse, stringify } = JSON

export function loadVideoData(videoHash) {
  const key = `${videoHash}-data`
  return parse(localStorage.getItem(key) || 'null')
}

export function loadVideoDetails(videoHash) {
  const key = `${videoHash}-details`
  return parse(localStorage.getItem(key) || 'null')
}

export function loadEditorState() {
  return parse(localStorage.getItem('editor-state') || '{}')
}

export function loadHistory() {
  return parse(localStorage.getItem('history') || '[]')
}

export function saveVideoData(videoHash, data) {
  const key = `${videoHash}-data`
  localStorage.setItem(key, stringify(data))
}

export function saveVideoDetails(videoHash, details) {
  const key = `${videoHash}-details`
  localStorage.setItem(key, stringify(details))
}

export function saveEditorState({ playerState, outputFormat }) {
  const { isPlaying, isRangePlay, ...newPlayerState } = playerState || {}
  const newState = { playerState: newPlayerState, outputFormat }
  localStorage.setItem('editor-state', stringify(newState))
}

export function saveHistory(history) {
  localStorage.setItem('history', stringify(history))
}

