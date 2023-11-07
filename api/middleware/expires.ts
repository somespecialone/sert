export default eventHandler((event) => {
  const now = new Date()
  const currentMinute = now.getMinutes()

  // Guess I don't need some kind of smart Expired value that depends on currency rates updated value.
  // Cache for the time to nearest cron update should be enough for most cases.
  if (currentMinute <= CRON_MINUTES[0]) {
    now.setMinutes(CRON_MINUTES[0], 0, 0)
  } else if (currentMinute <= CRON_MINUTES[1]) {
    now.setMinutes(CRON_MINUTES[1], 0, 0)
  } else {
    const roundedToHour = Math.ceil(now.getTime() / (1000 * 60 * 60)) * 1000 * 60 * 60
    now.setTime(roundedToHour + 1000 * 60 * CRON_MINUTES[0]) // + nearest minutes
  }

  setResponseHeaders(event, { Expires: now.toUTCString() })
})
