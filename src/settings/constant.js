const ua = navigator.userAgent.replace(/[\.0-9]+/g,"x");
const domain = window.location;
export default {
  dbName:"CopiBon",
  ua:ua,
  domain:domain
}
