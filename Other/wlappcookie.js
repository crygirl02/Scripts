const jsname='⛱文旅看点'
const $ = Env(jsname)

//getdomain
if($request&&$request.url.indexOf("getDomain.action")>=0) {
  const getdomainbody = $request.body
    if (getdomainbody) $.setdata(getdomainbody,'getdomainbody')
    $.log(`[${jsname}] 获取getdomainbody请求🎉: 成功,getdomainbody: ${getdomainbody}`)
  const getdomainkey = JSON.stringify($request.headers)
    if (getdomainkey) $.setdata(getdomainkey,'getdomainkey')
    $.log(`[${jsname}] 获取getdomainkey请求🎉: 成功,getdomainkey: ${getdomainkey}`)
}
//userlogin

if($request&&$request.url.indexOf("userlogin.action")>=0) {
  const userloginbody = $request.body
    if (userloginbody) $.setdata(userloginbody,'userloginbody')
    $.log(`[${jsname}] 获取userloginbody请求🎉: 成功,userloginbody: ${userloginbody}`)
  const userloginkey = JSON.stringify($request.headers)
    if (userloginkey) $.setdata(userloginkey,'userloginkey')
    $.log(`[${jsname}] 获取userloginkey请求🎉: 成功,userloginkey: ${userloginkey}`)
    $.msg(`获取登录cookie: 成功🎉`, ``)

}
//artlist
if($request&&$request.url.indexOf("artlist.action")>=0 && $request.body.indexOf("%22articlevideo%22%20%3A%20%220%22")>=0) {
  const artlistbody = $request.body
    if (artlistbody) $.setdata(artlistbody,'artlistbody')
    $.log(`[${jsname}] 获取artlistbody请求🎉: 成功,artlistbody: ${artlistbody}`)
  const artlistkey = JSON.stringify($request.headers)
    if (artlistkey) $.setdata(artlistkey,'artlistkey')
    $.log(`[${jsname}] 获取artlistkey请求🎉: 成功,artlistkey: ${artlistkey}`)

}
//artstation
if($request&&$request.url.indexOf("stationarticle.action")>=0) {
  const artstationurl = $request.url;
    if (artstationurl) $.setdata(artstationurl,'artstationurl')
    $.log(`[${jsname}] 获取ArtstationURL请求🎉: 成功,artstationurl: ${artstationurl}`)

  const artstationkey = JSON.stringify($request.headers)
    if (artstationkey) $.setdata(artstationkey,'artstationkey')
    $.log(`[${jsname}] 获取artstationkey请求🎉: 成功,artstationkey: ${artstationkey}`)

}
//readaccount
if($request&&$request.url.indexOf("readAccount.action")>=0 && $request.body.indexOf("%22paytype%22%20%3A%201")>=0) {
  const readaccountbody = $request.body
    if (readaccountbody) $.setdata(readaccountbody,'readaccountbody')
    $.log(`[${jsname}] 获取readaccountbody请求🎉: 成功,readaccountbody: ${readaccountbody}`)

  const readaccountkey = JSON.stringify($request.headers)
    if (readaccountkey) $.setdata(readaccountkey,'readaccountkey')
    $.log(`[${jsname}] 获取readaccountkey请求🎉: 成功,readaccountkey: ${readaccountkey}`)
    $.msg(`获取文章奖励cookie: 成功🎉`, ``)

}
//infome
if($request&&$request.url.indexOf("infoMe.action")>=0) {
  const infomebody = $request.body
    if (infomebody) $.setdata(infomebody,'infomebody')
    $.log(`[${jsname}] 获取infomebody请求🎉: 成功,infomebody: ${infomebody}`)

  const infomekey = JSON.stringify($request.headers)
    if (infomekey) $.setdata(infomekey,'infomekey')
    $.log(`[${jsname}] 获取infomekey请求🎉: 成功,infomekey: ${infomekey}`)
    $.msg(`获取用户账户cookie: 成功🎉`, ``)

}

//videoartlist
if($request&&$request.url.indexOf("artlist.action")>=0 && $request.body.indexOf("%22articlevideo%22%20%3A%20%221%22")>=0) {
  const videoartlistbody = $request.body
    if (videoartlistbody) $.setdata(videoartlistbody,'videoartlistbody')
    $.log(`[${jsname}] 获取videoartlistbody请求🎉: 成功,videoartlistbody: ${videoartlistbody}`)

  const videoartlistkey = JSON.stringify($request.headers)
    if (videoartlistkey) $.setdata(videoartlistkey,'videoartlistkey')
    $.log(`[${jsname}] 获取videoartlistkey请求🎉: 成功,videoartlistkey: ${videoartlistkey}`)


}

//videoreadaccount
if($request&&$request.url.indexOf("readAccount.action")>=0 && $request.body.indexOf("%22paytype%22%20%3A%202")>=0) {
  const videoreadaccountbody = $request.body
    if (videoreadaccountbody) $.setdata(videoreadaccountbody,'videoreadaccountbody')
    $.log(`[${jsname}] 获取videoreadaccountbody请求🎉: 成功,videoreadaccountbody: ${videoreadaccountbody}`)

  const videoreadaccountkey = JSON.stringify($request.headers)
    if (videoreadaccountkey) $.setdata(videoreadaccountkey,'videoreadaccountkey')
    $.log(`[${jsname}] 获取videoreadaccountkey请求🎉: 成功,videoreadaccountkey: ${videoreadaccountkey}`)
    $.msg(`获取视频奖励cookie: 成功🎉`, ``)

}

//artdetail
if($request&&$request.url.indexOf("artDetail.action")>=0) {
  const artdetailbody = $request.body
    if (artdetailbody) $.setdata(artdetailbody,'artdetailbody')
    $.log(`[${jsname}] 获取artdetailbody请求🎉: 成功,artdetailbody: ${artdetailbody}`)

  const artdetailkey = JSON.stringify($request.headers)
    if (artdetailkey) $.setdata(artdetailkey,'artdetailkey')
    $.log(`[${jsname}] 获取artdetailkey请求🎉: 成功,artdetailkey: ${artdetailkey}`)


}

//getallkey
if (typeof $request !== 'undefined') {
     $.done()
}
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
