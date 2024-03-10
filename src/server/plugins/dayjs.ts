import dayjs from 'dayjs'
// import utc from 'dayjs/plugin/utc'
// dayjs.extend(utc)

declare global {
  var DayJS : any
}

export default defineNitroPlugin(async (nitroApp) => {
  global.DayJS = dayjs
})
