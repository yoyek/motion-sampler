import path from 'path'

const {
  NODE_ENV,
  AUDIO_ONLY,
  STORAGE_PATH,
  SRC_MEDIA_PATH,
  MEDIA_FETCH_LIMIT,
  TRIM_DOWNLOAD_TITLE,
  DEFAULT_FPS,
} = process.env.NODE_ENV

const rootDir = process.cwd()
const storageDir = STORAGE_PATH || path.join(rootDir, 'storage')
const srcMediaDir = SRC_MEDIA_PATH || path.join(storageDir, 'source')

const config = {
  audioOnly: AUDIO_ONLY === 'true' || AUDIO_ONLY === '1',
  env: NODE_ENV,
  mediaFetchLimit: MEDIA_FETCH_LIMIT ? parseInt(MEDIA_FETCH_LIMIT) : 2,
  defaultFps: DEFAULT_FPS ? parseInt(DEFAULT_FPS) : 30,
  trimDownloadTitle: TRIM_DOWNLOAD_TITLE ? parseInt(TRIM_DOWNLOAD_TITLE) : 48,
  rootDir,
  storageDir,
  srcMediaDir,
}

export default config
