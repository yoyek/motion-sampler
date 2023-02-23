import path from 'path'
const fnCacheMap = new Map()

export function cache(fn) {
  return async function (...args) {
    const cacheKey = fn.constructor.name + '_' + JSON.stringify(args)
    if (fnCacheMap.has(cacheKey)) {
      return fnCacheMap.get(cacheKey)
    }
    const result = await fn.apply(this, args)
    fnCacheMap.set(cacheKey, result)
    return result
  }
}

export function getTempFilepathFor(filepath) {
  const parsed = path.parse(filepath)
  return path.format({ ...parsed, base: '~' + parsed.base })
}
