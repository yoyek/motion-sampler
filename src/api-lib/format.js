import slugify from 'slugify'
import config from '@/config/backend'
const { trimDownloadTitle } = config

export function formatDownloadFilename(mediaInfo, format, range = {}) {
  const separator = ' '
  const trimTitle = trimDownloadTitle
  const { title, id } = mediaInfo
  const { from, to, name } = range

  const parts = {
    '$id': id,
    '$title': title && slugify(String(title).substring(0, trimTitle), ' '),
    '$range_name': name && slugify(range.name, ' '),
    '$range_time': from && to && Number(from).toFixed(3) + '-' + Number(to).toFixed(3),
    '$ext': format.ext,
  }

  // Download file name
  let nameParts = []
  parts.$title && nameParts.push(parts.$title)
  nameParts.push('[' + parts.$id + ']')
  parts.$range_name && nameParts.push('(' + parts.$range_name + ')')
  parts.$range_time && nameParts.push(parts.$range_time)

  return nameParts.join(separator) + `.${parts.$ext}`
}
