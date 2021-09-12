/*
软件名称:阳光果园 企业版
更新时间：2021-04-03 @肥皂
脚本说明：阳光果园自动签到和收取果实

零撸版，一天可以收取三个果实，一个果实1.5元
20元提现，六天可撸二十,提现规则更改为100提现,
注册送的果树到期后用收取的果实去首页兑换新手专享果树
兑换之后可继续撸,二十天左右可提现一百,已有多人到账
零撸结束可撸400+

果实出售方法，点击市场  选择官方回收或者我要出售都可以
建议官方回收

需要实名人脸，不过是免费的，看自己玩不玩吧
不必强撸

企业版二维码下载地址 https://raw.githubusercontent.com/age174/-/main/DFB97E20-66E7-49E7-98F6-E9433FECFFDA.jpeg
微信扫描打不开网址的用其他扫码软件打开就行了

或者用 https://645695.com/index.html?invite_code=3EI8GJSILF 链接打开下载



本脚本以学习为主！
使用方法:
打开阳光果园，找到首页 任务 签到，获得阳光果园的数据
或者点收取果实也能获取数据
4.3更新,修复官方域名更换导致无法获取数据的问题,请更换新的重写,如果开启代理无法进入的可以开启直连抓包,或者添加一个分流规则走直连

TG电报群: https://t.me/hahaha802



boxjs地址 :  

https://raw.githubusercontent.com/age174/-/main/feizao.box.json


阳光果园
圈X配置如下，其他软件自行测试
[task_local]
#阳光果园
50 12 * * * https://raw.githubusercontent.com/age174/-/main/yggy.js, tag=阳光果园, img-url=https://s3.ax1x.com/2021/02/06/yYzeWn.png, enabled=true


[rewrite_local]
#阳光果园
^https://.+?[^/]/index/guoyuan url script-request-body https://raw.githubusercontent.com/age174/-/main/yggy.js



#loon
^https://.+?[^/]/index/guoyuan script-path=https://raw.githubusercontent.com/age174/-/main/yggy.js, requires-body=true, timeout=10, tag=阳光果园



#surge

阳光果园 = type=http-request,pattern=^https://.+?[^/]/index/guoyuan,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/age174/-/main/yggy.js,script-update-interval=0




[MITM]
hostname = sdk.*.com

*/


const $ = new Env('阳光果园');
let status;
status = (status = ($.getval("yggystatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const yggybodyArr = [], yggyhdArr = [],yggyurlArr = [],yggycount = ''
let yggybody = $.getdata('yggybody')
let yggyhd = $.getdata('yggyhd')
let yggyurl = $.getdata('yggyurl')
let sdk = '';
!(async () => {
  if (typeof $request !== "undefined") {
    await yggyck()
   
  } else {yggybodyArr.push($.getdata('yggybody'))
    yggyhdArr.push($.getdata('yggyhd'))
    yggyurlArr.push($.getdata('yggyurl'))
    let yggycount = ($.getval('yggycount') || '1');
  for (let i = 2; i <= yggycount; i++) {
    yggybodyArr.push($.getdata(`yggybody${i}`))
    yggyurlArr.push($.getdata(`yggyurl${i}`))
    yggyhdArr.push($.getdata(`yggyhd${i}`))
  }
    console.log(`------------- 共${yggyhdArr.length}个账号-------------\n`)
      for (let i = 0; i < yggyhdArr.length; i++) {
        if (yggyhdArr[i]) {
         
          yggybody = yggybodyArr[i];
          yggyhd = yggyhdArr[i];
          yggyhd = yggyhdArr[i];
          $.index = i + 1;
          console.log(`\n开始【阳光果园${$.index}】`)
          //await yggyhhb();
            await yggyqd();
            await $.wait(2000);
            await yggysq();
  }
}}

})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
//阳光果园数据获取


function yggyck() {
   if ($request.url.indexOf("signIn") > -1 || $request.url.indexOf("collectFruit") > -1) {
 const yggybody = $request.body
  if(yggybody)     $.setdata(yggybody,`yggybody${status}`)
    $.log(yggybody)
const yggyurl = $request.url
  if(yggyurl)     $.setdata(yggyurl,`yggyurl${status}`)
    $.log(yggyurl)
  const yggyhd = JSON.stringify($request.headers)
        if(yggyhd)    $.setdata(yggyhd,`yggyhd${status}`)
$.log(yggyhd)
   $.msg($.name,"",'阳光果园'+`${status}` +'获取数据获取成功！')
  }
}


//阳光果园收取果实     
function yggysq(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : `https://sdk.${sdk}.com/index/guoyuan/collectFruit`,
        headers : JSON.parse(yggyhd),
        body : yggybody,}
      $.post(url, async (err, resp, data) => {
        try {
           
    const result = JSON.parse(data)
        if(result.code == 10000){
        console.log('\n阳光果园收取果实回执:成功🌝 '+result.msg+'获得果实'+result.data+'个')
    
}else{
       console.log('\n阳光果园收取果实回执:失败🚫 '+result.msg)
}
        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
    },timeout)
  })
}



//阳光果园签到
function yggyqd(timeout = 0) {
  return new Promise((resolve) => {
    setTimeout( ()=>{
      if (typeof $.getdata('yggyhd') === "undefined") {
        $.msg($.name,"",'请先获取阳光果园数据!😓',)
        $.done()
      }
sdk = yggyurl.match(/sdk.(\w+).com/)[1]
let url = {
        url : `https://sdk.${sdk}.com/index/guoyuan/signIn`,
        headers : JSON.parse(yggyhd),
        body : yggybody,}
      $.post(url, async (err, resp, data) => {
        try {
          
    const result = JSON.parse(data)
        if(result.code == 10000){
        console.log('\n阳光果园签到回执:成功🌝 '+result.msg+'开始收取果实')
        $.msg('阳光果园','','阳光果园签到成功')

}else{
        console.log('\n阳光果园签到回执:失败🚫 '+result.msg)

} 

        } catch (e) {
          //$.logErr(e, resp);
        } finally {
          resolve()
        }
      })
    },timeout)
  })
}



function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
