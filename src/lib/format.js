export function formatTimecode(seconds, optional, rounded) {
  const h = ('0' + Math.floor(seconds / 3600)).slice(-2)
  const min = ('0' + Math.floor(seconds % 3600 / 60)).slice(-2)
  const sec = ('0' + Math.floor(seconds % 60)).slice(-2)
  const mil = ('00' + Math.round((seconds - Math.floor(seconds)) * 1000)).slice(-3)
  if (optional) {
    if (h === '00') {
      return `${min}:${sec}${rounded ? '' : '.'+mil}`
    } else {
      return `${h}:${min}:${sec}`
    }
  }
  return `${h}:${min}:${sec}.${mil}`
}

export function hashCode(str) {
  if (!str) return null
  return Array.from(str)
    .reduce((s, c) => Math.imul(31, s) + c.charCodeAt(0) | 0, 0)
}

export function toQueryString(queries) {
  return Object.keys(queries).reduce((result, key) => {
    return [...result, `${encodeURIComponent(key)}=${encodeURIComponent(queries[key])}`]
  }, []).join('&')
}

export function shortHash(input) {
  let hash = 5381
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 33) ^ input.charCodeAt(i)
  }
  return (hash >>> 0).toString(36).substring(0, 12)
}

export function formatBytes(bytes, decimals = 2) {
  if (!+bytes) return '0 Bytes'
  const k = 1024
  const dm = decimals < 0 ? 0 : decimals
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
}
