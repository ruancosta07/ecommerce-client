import dayjs from "dayjs"
import ptBr from "dayjs/locale/pt-br"
import utc from "dayjs/plugin/utc"
import timezone from "dayjs/plugin/timezone"
import customParse from "dayjs/plugin/customParseFormat"
import relativeTime from "dayjs/plugin/relativeTime"
const DayJs = dayjs
DayJs.locale(ptBr)
DayJs.extend(utc)
DayJs.extend(timezone)
DayJs.extend(customParse)
DayJs.extend(relativeTime)

export default DayJs