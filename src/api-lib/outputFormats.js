import config from '@/config/backend'

export const outputFormats = [
  {
    name: 'flac',
    label: 'FLAC',
    format: 'flac',
    ext: 'flac',
    type: 'audio',
    mime: 'audio/flac',
    ffmpeg: video => video
      .audioCodec('flac')
      .outputOptions(['-compression_level 12'])
  },
  {
    name: 'wav16',
    label: 'Wav / 16bit',
    format: 'wav',
    ext: 'wav',
    type: 'audio',
    mime: 'audio/wav',
    ffmpeg: video => video
      .audioCodec('pcm_s16le')
  },
  {
    name: 'wav24',
    label: 'Wav / 24bit',
    format: 'wav',
    ext: 'wav',
    type: 'audio',
    mime: 'audio/wav',
    ffmpeg: video => video
      .audioCodec('pcm_s24le')
  },
  {
    name: 'mp3',
    label: 'Mp3 (256k)',
    format: 'mp3',
    ext: 'mp3',
    type: 'audio',
    mime: 'audio/mp3',
    ffmpeg: video => video
      .audioBitrate('256k')
  },
  {
    name: 'ogg',
    label: 'Ogg Vorbis',
    format: 'ogg',
    ext: 'ogg',
    type: 'audio',
    mime: 'audio/ogg',
    ffmpeg: video => video
      .audioBitrate('160k')
  },
  {
    name: 'mov',
    label: 'Mov (x264+alac)',
    format: 'mov',
    ext: 'mov',
    type: 'video',
    mime: 'video/quicktime',
    ffmpeg: video => video
      .videoBitrate('4096k')
      .videoCodec('libx264')
      .audioCodec('alac')
  },
  {
    name: 'mkv',
    label: 'Mp4 (x264+pcm)',
    format: 'matroska',
    ext: 'mkv',
    type: 'video',
    mime: 'video/webm',
    ffmpeg: video => video
      .videoBitrate('4096k')
      .videoCodec('libx264')
      .audioFrequency(44100)
      .audioChannels(2)
      .audioCodec('pcm_s16le')
  },
  {
    name: 'iphone264',
    label: 'iPhone (x264+aac)',
    format: 'mov',
    ext: 'mov',
    type: 'video',
    mime: 'video/quicktime',
    ffmpeg: video => video
      .videoCodec('libx264')
      .audioChannels(2)
      .audioBitrate('128k')
      .audioCodec('aac')
      .outputOptions([
        '-crf 20',
        '-profile:v baseline',
        '-pix_fmt yuv420p',
      ])
  },
  {
    name: 'iphone265',
    label: 'iPhone (hevc+aac)',
    format: 'mov',
    ext: 'mov',
    type: 'video',
    mime: 'video/quicktime',
    ffmpeg: video => video
      .videoCodec('hevc_videotoolbox')
      .audioCodec('eac3')
      .audioBitrate('224k')
      .outputOptions(['-tag:v hvc1'])
  },
  {
    name: 'source',
    label: 'Source',
    format: 'webm',
    ext: 'webm',
    type: config.audioOnly ? 'audio' : 'video',
    mime: 'video/webm',
    ffmpeg: video => video
      .audioCodec('copy')
      .videoCodec('copy')
  },
]
