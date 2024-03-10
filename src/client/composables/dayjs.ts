import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/vi'

dayjs.locale('vi')
dayjs.extend(relativeTime)

export const useDayJs = () => {
  const fromTime = (start : Date, end? : Date, noSuffix : boolean = false) : string => {
    const startDayJS = dayjs(start)
    const endDayJS = dayjs(end || new Date())
    return startDayJS.from(endDayJS, noSuffix) as string
  }

  const displayTime = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('DD[/]MM[/]YYY')
  }

  const displayFull = (time : Date) : string => {
    const t = dayjs(time)
    return t.format('HH:mm - DD[/]MM[/]YYYY')
  }

  return { dayjs, fromTime, displayTime, displayFull }
}