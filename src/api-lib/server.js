export function sendError(res, error, statusCode = 500) {
  return res.status(statusCode).json({ error })
}
