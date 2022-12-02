/**
 * It takes a request object and returns x-forward-for header or it's socket ip
 * @param dateString the string to compare from
 * @returns
 */
export const getIp = req => {
  return (
    (Array.isArray(req.headers['x-forwarded-for'])
      ? req.headers['x-forwarded-for'].shift()
      : req.headers['x-forwarded-for']) || req.socket?.remoteAddress
  )
}

/**
 * It takes a date string a returns the time passed in secons.
 * @param dateString the string to compare from
 * @returns
 */
export const getTimePassed = (dateString?: string) => {
  if (!dateString) return undefined
  const lastRead = new Date(dateString)
  const now = new Date()
  return (now.getTime() - lastRead.getTime()) / 1000
}