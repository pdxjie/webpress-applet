var DOMAIN = "http://localhost:8080/";
var WEBSITENAME="编程灵感库";
var PAGECOUNT='10';
var WECHAT='微信号：pdx_jie';

const enableScanLogin =false 
const enableChannels =false 
const openId = wx.getStorageSync('openid')
const uploadImageSize=1
//小程序原始id
const appghId ='gh_e49213784fae'
const minapperVersion=4.681
const minapperSource="free"
// url
const casualNavUrl = DOMAIN + '/pdx/banner/show/'
const recommendArticle = DOMAIN + '/pdx/article/recommend'


export default {
  getDomain: DOMAIN,
  getWebsiteName: WEBSITENAME,  
  getPageCount: PAGECOUNT,
  getWecat: WECHAT,
  enableScanLogin,
  minapperVersion,
  minapperSource,
  enableChannels,
  appghId,
  openId,
  casualNavUrl,
  recommendArticle
}