const $ = new Env("电视家_新");
const notify = $.isNode() ? require('./sendNotify') : '';
message = ""
let dsj_header= $.isNode() ? (process.env.dsj_header ? process.env.dsj_header : "") : ($.getdata('dsj_header') ? $.getdata('dsj_header') : "")
let dsj_headerArr = []
let dsj_headers = ""
const walkstep = '20000';
const gametimes = "1999";

if ($.isNode() && process.env.dsj_header) {
    if (process.env.dsj_header.indexOf('@') > -1) {
      dsj_headerArr = process.env.dsj_header.split('@');
    } else if (process.env.dsj_header.indexOf('\n') > -1) {
      dsj_headerArr = process.env.dsj_header.split('\n');
    } else {
      dsj_headerArr = [process.env.dsj_header]
    }
  }

!(async() => {
    if (typeof $request !== "undefined") {
        GetHeader()
    } else {
        console.log(`共${dsj_headerArr.length}个账号`)
        for (let k = 0; k < dsj_headerArr.length; k++) {
            if(dsj_headerArr[k]){
                dsj_header1=dsj_headerArr[k]
                $.index=k+1
                $.log(`\n开始【电视家 ${$.index}】\n`)
                await TaskAll()
                await CoinInfo()
            }
        }
        date = new Date()
        if ($.isNode() && date.getHours() == 11 && date.getMinutes() < 10) {
            if (message.length != 0) {
                await notify.sendNotify("电视家", `${message}\n\ n`);
            }
        } else {
            $.msg($.name, "", message)
        }
    }
})()
    .catch ((e) => $.logErr(e))
    .finally(() => $.done())


function GetHeader() {
    if ($request.url.match(/\/v3\/user\/info/)) {
        headerVal1 = JSON.stringify($request.headers)
        result = JSON.parse(headerVal1)
        uuid = result.uuid
        userid = result.userid
        authorization = result.Authorization
        $.log(authorization)
        appid = result.appId
        let bodyVal = {
            'uuid' :uuid, 
            'userid' :userid, 
            'Authorization' :authorization, 
            'appid':appid, 
            'Host':'api.gaoqingdianshi.com'}
        bodyVal2 =JSON.stringify(bodyVal)
        if (dsj_header) {
            if (dsj_header.indexOf(userid) > -1) {
                $.log("此cookie已存在，本次跳过")
            } else if (dsj_header.indexOf(userid) === -1) {
                dsj_headers = dsj_header + "@" + bodyVal2;
                console.log(bodyVal2)
                $.setdata(dsj_headers, 'dsj_header');
                $.log(`${$.name}获取cookie: 成功, dsj_headers: ${bodyVal}`);
                bodys = dsj_headers.split("@")
            }
        } else {
            $.setdata(bodyVal2, 'dsj_header');
            console.log(bodyVal2)
            $.log(`${$.name}获取cookie: 成功, dsj_headers: ${bodyVal}`);
            $.msg($.name, `获取第一个cookie: 成功🎉`, ``)
        }
    }
  }


function TaskAll() {
  return new Promise((resolve) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v5/task/get`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, async(err, resp, data) => {
      try {
        //console.log(data)
        data = JSON.parse(data)
        if (data.errCode == 0) {
          console.log(`\n【任务状态】: \n`)
          const TaskData=data.data
          TaskData.forEach(function(item){
              if(item.dayCompCount==item.dayDoCountMax){
                  result="已完成"
              } else {
                  result="未完成"
              }
              $.log(`${item.name}:\t${result}`)
          })
        }
      } catch (e) {
          $.logErr(e,resp)
      } finally {
        resolve()
      }
    })
  })
}

function CoinInfo() {
  return new Promise((resolve, reject) => {
    let url = {
        url: `http://api.gaoqingdianshi.com/api/coin/info`,
        headers: JSON.parse(dsj_header1)
      }
    $.get(url,async(error, response, data) => {
      try{
        let result = JSON.parse(data)
        if (result.errCode == 0) {
          if(result.data.tempCoin != null){
            result.data.tempCoin.forEach(async function(item){
              await GetCoin(item.id)
              $.log(`${item.from}点击气泡成功，获取金币 ${item.coin} 枚`)
              await $.wait(3000)
            })            
          }
          else{
            $.log(`\n当前无金币可以领取\n`)
          }
        }
      }
      catch(e){
        $.logErr(e,response)
      }
      finally{
        resolve()
      }
    })
  })
}

function GetCoin(code) {
  return new Promise((resolve, reject) => {
    let url ={
      url: `http://api.gaoqingdianshi.com/api/coin/temp/exchange?id=${code}`,
      headers: JSON.parse(dsj_header1)
    }
    $.get(url,async(error, response, data) => {
      try{
      }
      catch(e){
        $.logErr(e,response)
      }
      finally{
        resolve()
      }
    })
  })
}

function CoinList(){
  return new Promise((resolve,reject)=>{
    let url ={
      url: `http://api.gaoqingdianshi.com/api/coin/detail`,
      headers=JSON.parse(dsj_header1)
    }
    $.get(url,async(err,response,data)=>{
      try{
        let result = JSON.parse(data)
        var Total=[]
        var fromContainer={}
        result.data.forEach(function(item){
          fromContainer[item.from]=fromContainer[item.from]||[]
          fromContainer[item.from].push(item)
        })
        $.log(fromContainer)
        var fromName=Object.keys(fromContainer)
        fromName.forEach(function(nameitem){
          let count=0
          fromContainer[nameitem].forEach(function(item){
            amount = Number(item.amout)
            count += amount
          })
          Total.push({'from':nameitem,'amout':count})
        })
        $.log(Total)
      }
      catch(e){
        $.log(e,response)
      }
      finally{
        resolve()
      }
    })
  })
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}

