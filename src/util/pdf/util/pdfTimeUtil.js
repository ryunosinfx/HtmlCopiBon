const re_yyyy = /yyyy/;
const re_MM = /MM/;
const re_dd = /dd/;
const re_hh = /hh/;
const re_mm = /mm/;
const re_ss = /ss/;

export const unixTimeToDateFormat = (unixtime, format = "yyyy-MM-dd hh:mm:ss") => {
  const d = new Date(unixtime);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() * 1 + 1))
    .slice(-2);
  const day = ('0' + d.getDate())
    .slice(-2);;
  const hour = ('0' + d.getHours())
    .slice(-2);
  const min = ('0' + d.getMinutes())
    .slice(-2);
  const sec = ('0' + d.getSeconds())
    .slice(-2);
  return format.replace(re_yyyy, year)
    .replace(re_MM, month)
    .replace(re_dd, day)
    .replace(re_hh, hour)
    .replace(re_mm, min)
    .replace(re_ss, sec);
}
export const getNowUnixtime = () => {
  return new Date().getTime();
}
export const getNow = () => {
  //(D:20181012023235+02'00')
  const now = getNowUnixtime();
  const retText = unixTimeToDateFormat(now, "(D:yyyyMMddhhmmss+0:00)")
  return retText;
}
