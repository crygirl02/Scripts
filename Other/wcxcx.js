/*

软件名称:文创小程序阅读 复制链接到微信打开
更新时间：2021-04-05 @肥皂 @ztxtop
脚本说明：文创阅读小程序自动阅读
脚本为自动完成文创阅读的小程序阅读任务
脚本需要配合文创阅读使用
小程序任务不知道能有几个,我今天小程序跑了五毛

本脚本由@ztxtop大佬编写

食用方法:进入文创阅读,点小程序阅读,进入小程序后获得数据

TG电报群: https://t.me/hahaha8028

boxjs地址 :  
https://raw.githubusercontent.com/age174/-/main/feizao.box.json

文创阅读小程序
圈X配置如下，其他软件自行测试，定时可以多设置几次，没任务会停止运行的
[task_local]
#文创阅读小程序
10 9-22 * * * https://raw.githubusercontent.com/age174/-/main/wcxcx.js, tag=文创阅读小程序, img-url=https://ae01.alicdn.com/kf/Ua6bd9417d492473f8ca0c3110b2176307.jpg, enabled=true

[rewrite_local]
#文创阅读小程序
^https://yd\.wcyd168\.com/hfTask/getUserByToken url script-request-body https://raw.githubusercontent.com/age174/-/main/wcxcx.js

#loon
^https://yd\.wcyd168\.com/hfTask/getUserByToken script-path=https://raw.githubusercontent.com/age174/-/main/wcxcx.js, requires-body=true, timeout=10, tag=文创阅读小程序

#surge
文创阅读小程序 = type=http-request,pattern=^https://yd\.wcyd168\.com/hfTask/getUserByToken,requires-body=1,max-size=0,script-path=https://raw.githubusercontent.com/age174/-/main/wcxcx.js,script-update-interval=0

[MITM]
hostname = yd.wcyd168.com

*/

const $ = new Env('文创小程序')
let wcxcx = $.getjson('wcxcx', [])
let needNotice = $.getval('wcxcxNotice') == 'true'
let concurrency = ($.getval('wcxcxConcurrency') || '1') - 0 // 并发执行任务的账号数，默单账号循环执行
concurrency = concurrency < 1 ? 1 : concurrency

!(async () => {
  if (typeof $request !== "undefined") {
    await getck()
  } else {
    // 获取分组执行账号数据
    let execAcList = getExecAcList()
    let msgInfo = []
    for (let arr of execAcList) {
      let allAc = arr.map(ac => ac.no).join(', ')
      $.log(`\n=======================================\n开始【${$.name}账号：${allAc}】`)
      let rtList = await Promise.all(arr.map((ac, i) => execTask(ac, i)))
      msgInfo.push(rtList.map(ac => `【账号${ac.no}】\n执行次数：${ac.execNum||0}\n当前余额：${ac.amount}`).join('\n\n'))
    }
    if (msgInfo.length <= 0) {
      msgInfo.push(`暂无账号数据，请进入任务列表页面抓取数据`)
    }
    if (needNotice) {
      $.msg($.name, '', msgInfo.join('\n\n'))
    } else {
      $.log('\n======== [脚本运行完毕,打印日志结果] ========\n' + msgInfo.join('\n\n'))
    }
  }
})()
.catch((e) => $.logErr(e))
  .finally(() => $.done())

function execTask(ac, i) {
  return new Promise(async resolve => {
    try {
      await $.wait(i * 50)
      let userInfo = await postApi(ac.url, {headers: ac.headers, body: ac.body})
      if (userInfo && userInfo.id) {
        await $.wait((i + 1) * 600)
        ac.weixin = userInfo.weixin
        let taskList = await postApi(ac.url.replace('getUserByToken', 'getWxMini'), {headers: ac.headers, body: ac.body})
        $.log(`😄账号${ac.no}：本次共${taskList && taskList.length}个小程序任务待处理`)
        if (taskList && taskList.length >= 0) {
          let count = 0
          for (let task of taskList) {
            // 打开小程序
            $.log(`😄账号${ac.no}开始打开第${++count}个小程序：${task.id}`)
            ac.execNum = count
            let openRt = await postApi(ac.url.replace('getUserByToken', 'openWxMini'), {headers: ac.headers, body: ac.body}, `&id=${task.id}`)
            if (openRt && openRt.code == 0) {
              let time = parseInt(Math.random() * (9 - 6 + 1) + 6, 10)
              $.log(`🌝账号${ac.no}等待${time}秒后提交第${count}个小程序任务`)
              await $.wait(time * 1000)
              openRt = await postApi(ac.url.replace('getUserByToken', 'openedWxMini'), {headers: ac.headers, body: ac.body})
            } else {
              $.log(`😂账号${ac.no}打开第${count}个小程序失败：\n${JSON.stringify(openRt, null, 2)}`)
            }
          }
          if (count > 0) {
            userInfo = await postApi(ac.url, {headers: ac.headers,body: ac.body})
          }
        }
        if (userInfo && userInfo.id) {
          ac.amount = userInfo.amount
        } else {
          ac.amount = '获取失败'
        }
      } else {
        $.logErr(`🚫账号${ac.no}：token无效，请重新抓包后再试`)
      }
    } catch (e) {
      $.logErr(`账号${ac.no} 循环执行任务出现异常: ${e}`)
    } finally {
      resolve(ac)
    }
  })
}

function getExecAcList() {
  let acList = ((Array.isArray(wcxcx) && wcxcx) || []).filter(o => o.id).map((o, i) => {
    return {
      no: i + 1,
      id: o.id,
      url: o.url,
      weixin: o.weixin,
      headers: o.headers,
      body: o.body
    }
  })
  let execAcList = []
  let len = acList.length
  // 计算分组后每组账号个数
  let slot = len % concurrency == 0 ? len / concurrency : parseInt(len / concurrency) + 1
  slot = Math.ceil(len / (slot || 1))
  let idx = -1
  acList.forEach((o, i) => {
    if (i % slot == 0) {
      idx++
    }
    if (execAcList[idx]) {
      execAcList[idx].push(o)
    } else {
      execAcList[idx] = [o]
    }
  })
  $.log(`----------- 共${len}个账号分${execAcList.length}组去执行 -----------`)
  return execAcList
}

// 数据获取
async function getck() {
  const url = $request.url
  if (url.indexOf("/hfTask/getUserByToken") > -1) {
    let newAc = await postApi(url, {headers: $request.headers, body: $request.body})
    if (newAc) {
      wcxcx = (Array.isArray(wcxcx) && wcxcx) || []
      let status = 1
      let no = wcxcx.length
      for (let i = 0, len = no; i < len; i++) {
        let ac = wcxcx[i] || {}
        if (ac.id) {
          if (ac.id == newAc.id) {
            no = i
            status = 0
            break
          }
        } else if (no == len) {
          no = i
        }
      }
      wcxcx[no] = {
        id: newAc.id, weixin: newAc.weixin, url, headers: $request.headers, body: $request.body
      }
      $.setdata(JSON.stringify(wcxcx, null, 2), 'wcxcx')
      $.msg($.name, "", `文创小程序[账号${no+1}] ${status?'新增':'更新'}数据成功！`)
    }
  } else {
    $.log('不满足条件的请求匹配路径，跳过处理')
  }
}

function postApi(url, ac, id = '') {
  return new Promise((resolve) => {
    let opts = {url, headers: ac.headers, body: ac.body + id}
    $.post(opts, async (err, resp, data) => {
      let obj = ''
      try {
        if (err) {
          $.logErr(`❌ API请求失败，请检查网络后重试\n url: ${opts.url} \n data: ${JSON.stringify(err, null, 2)}\n`)
        } else {
          obj = $.toObj(data, obj)
        }
      } catch (e) {
        $.logErr(`======== 文创小程序 ========\nurl: ${opts.url}\nerror:${e}\ndata: ${resp && resp.body}\n`)
      } finally {
        resolve(obj)
      }
    })
  })
}

function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
