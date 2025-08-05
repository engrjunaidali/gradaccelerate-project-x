import { DateTime } from 'luxon'

export const formatDate = (dateString: string) => {
  return DateTime.fromISO(dateString).toFormat('MMM dd, yyyy')
}

export const formatDateWithTime = (dateString: string) => {
  return DateTime.fromISO(dateString).toFormat('MMM dd, yyyy \'at\' h:mm a')
}