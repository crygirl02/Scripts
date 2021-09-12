
const $ = new Env('ZEALER');
let status;
status = (status = ($.getval("zbstatus") || "1") ) > 1 ? `${status}` : ""; // 账号扩展字符
const zburlArr = [], zbbodyArr = [],zb1bodyArr = [],zb2bodyArr = [],zbhdArr = [],zbcount = ''
let zburl = $.getdata('zburl')
let zbbody = $.getdata('zbbody')
let zb1body = $.getdata('zb1body')
let zb2body = $.getdata('zb2body')
let zbhd = $.getdata('zbhd')
let DD = RT(4000,10000)
let tz = ($.getval('tz') || '1');//通知
let id = '',boundary = '',dzid = '',verifyStr = '',verifyTime = '',fxid = ''
$.message = ''


!(async () => {
  if (typeof $request !== "undefined") {
    await zbck()
  } else {zburlArr.push($.getdata('zburl'))
    zbhdArr.push($.getdata('zbhd'))
    zbbodyArr.push($.getdata('zbbody'))
    zb1bodyArr.push($.getdata('zb1body'))
    zb2bodyArr.push($.getdata('zb2body'))
    let zbcount = ($.getval('zbcount') || '1');
  for (let i = 2; i <= zbcount; i++) {
    zburlArr.push($.getdata(`zburl${i}`))
    zbbodyArr.push($.getdata(`zbbody${i}`))
    zb1bodyArr.push($.getdata(`zb1body${i}`))
    zb2bodyArr.push($.getdata(`zb2body${i}`))
    zbhdArr.push($.getdata(`zbhd${i}`))
  }
    console.log(`------------- 共${zbhdArr.length}个账号-------------\n`)
      for (let i = 0; i < zbhdArr.length; i++) {
        if (zbhdArr[i]) {
          zburl = zburlArr[i];
          zbbody = zbbodyArr[i];
          zb1body = zb1bodyArr[i];
          zb2body = zb2bodyArr[i];
          zbhd = zbhdArr[i];
          $.index = i + 1;
          console.log(`\n开始ZEALER【${$.index}】`)
await openbox()
await $.wait(1000)
await index()
await $.wait(DD)
for (let c = 0; c < 5; c++) {
  $.index = c + 1
  console.log(`\n第${c+1}次执行任务！`)
    await zbdzlb()
    await $.wait(DD)
    await zbfxlb()
    await $.wait(DD)
}
 message()
  }
  
  
}}
})()
  .catch((e) => $.logErr(e))
  .finally(() => $.done())
function zbck() {
   if ($request.url.indexOf("index") > -1){
 const zburl = $request.url
  if(zburl)     $.setdata(zburl,`zburl${status}`)
    $.log(zburl)
 const zbbody = $request.body
  if(zbbody)   $.setdata(zbbody,`zbbody${status}`)
    $.log(zbbody)
 const zbhd = JSON.stringify($request.headers)
  if(zbhd)    $.setdata(zbhd,`zbhd${status}`)
$.log(zbhd)
   $.msg($.name,"",'ZEALER'+`${status}` +' 获取headers成功！')
} else if ($request.url.indexOf("activitylist") > -1) {
   const zb1body = $request.body
  if(zb1body)   $.setdata(zb1body,`zb1body${status}`)
  
    $.log(zb1body)
    $.msg($.name,"",'ZEALER'+`${status}` +' 获取body成功！')
} else if ($request.url.indexOf("havingenergy") > -1) {
   const zb2body = $request.body
  if(zb2body)   $.setdata(zb2body,`zb2body${status}`)
  
    $.log(zb2body)
    $.msg($.name,"",'ZEALER'+`${status}` +' 获取气泡body成功！')
  }
            
}


//分享列表
function zbfxlb(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : `https://app.zaaap.cn/contentcp/homeContent`,
        headers : JSON.parse($.getdata('zbhd')),
        body : `lastId=0&pageNum=1&verifyStr=${verifyStr}&verifyTime=${verifyTime}`,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)
        if(result.status == 200){

        fxid = result.data[RT(0,10)].id

        //$.log(''+result.data[RT(0,10)].id)
        //$.message +=''+result.data[RT(0,10)].id
       await zbfx()
        
} else {
        $.log('\n'+result.msg)
        
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}

//分享
function zbfx(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : `https://app.zaaap.cn/content/contentshare`,
        headers : JSON.parse($.getdata('zbhd')),
        body : `content_id=${fxid}&type=1&verifyStr=${verifyStr}&verifyTime=${verifyTime}`,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)
        if(result.status == 200){

      
        $.log(''+result.msg)
        $.message +=result.msg+'\n'
       
        
} else {
        $.log('\n'+result.msg)
        
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}

//开宝箱
function openbox(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : `https://app.zaaap.cn/points/home/openbox`,
        headers : JSON.parse($.getdata('zbhd')),
        body : zbbody,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)
        if(result.status == 200){

        $.log('\n开启宝箱'+result.msg+'  获得能量币：'+result.data.energy+'个')
        $.message +='\n开启宝箱'+result.msg+'  获得能量币：'+result.data.energy+'个'
} else {
        $.log('\n'+result.msg)
        $.message +=result.msg+'\n'
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}

//能量球ID
function index(timeout = 0) {
  return new Promise((resolve) => {
let url = {
        url : `https://app.zaaap.cn/points/home/index`,
        headers : JSON.parse($.getdata('zbhd')),
        body : zbbody,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)
        if(result.status == 200){
id =result.data.energyList[0].id
$.log('\n'+result.data.registerData.txt)
        await $.wait(1000);
        await havingenergy();
} else {
        $.log('\n'+result.msg)
       $.message +=result.msg+'\n'
}
        } catch (e) {
        } finally {
          resolve()
        }
    },timeout)
  })
}

//点赞列表
function zbdzlb(timeout = 0) {
    return new Promise((resolve) => {
  let url = {
          url : `https://app.zaaap.cn/contentcp/homeContent`,
          headers : JSON.parse($.getdata('zbhd')),
          body : `lastId=0&pageNum=1&verifyStr=${verifyStr}&verifyTime=${verifyTime}`,
  }
        $.post(url, async (err, resp, data) => {
          try {
      const result = JSON.parse(data)
          if(result.status == 200){

          dzid = result.data[RT(0,10)].id

          //$.log(''+result.data[RT(0,10)].id)
          //$.message +=''+result.data[RT(0,10)].id
         await zbdz()
          
  } else {
          $.log('\n'+result.msg)
          
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }

//点赞
function zbdz(timeout = 0) {
    return new Promise((resolve) => {
  let url = {
          url : `https://app.zaaap.cn/user/contentpraise`,
          headers : JSON.parse($.getdata('zbhd')),
          body : `content_id=${dzid}&type=0&verifyStr=${verifyStr}&verifyTime=${verifyTime}`,
  }
        $.post(url, async (err, resp, data) => {
          try {
      const result = JSON.parse(data)
          if(result.status == 200){
          $.log(''+result.msg)
          $.message +=result.msg+'\n'
          
  } else {
          $.log('\n'+result.msg)
          
  }
          } catch (e) {
          } finally {
            resolve()
          }
      },timeout)
    })
  }


//收能量
function havingenergy(timeout = 0) {
  return new Promise((resolve) => {
boundary = zb2body.match(/------(\w+)--/)[1]
const body = `------${boundary}
Content-Disposition: form-data; name="energyId"

${id}
------${boundary}--`;
              
          

              
let url = {
        url : `https://app.zaaap.cn/points/home/havingenergy`,
        headers : JSON.parse($.getdata('zbhd')),
        body : body,
}
      $.post(url, async (err, resp, data) => {
        try {
    const result = JSON.parse(data)
        if(result.status == 200){

        $.log('\n收取气泡'+result.msg)

        $.message +='\n收取气泡'+result.msg

    await $.wait(1000);

    await index();

} else {

       $.log('\n'+result.msg)

       $.message +=result.msg+'\n'
}

        } catch (e) {

        } finally {

          resolve()
        }
    },timeout)
  })
}





//通知
function message() {
    if(tz == 1){$.msg($.name,"",$.message)}
    }
  
    //随机延迟
  function RT(X, Y) {
      do rt = Math.floor(Math.random() * Y);
      while (rt < X)
      return rt;}
  
    //当前时间
  console.log('\n'+getCurrentDate());
  function getCurrentDate() {
  var date = new Date();
  var seperator1 = "-";
  var seperator2 = ":";
  var month = date.getMonth() + 1;
  var strDate = date.getDate();
  if (month >= 1 && month <= 9) {
  month = "0" + month;
  }
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  }
  var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
  + " " + date.getHours() + seperator2 + date.getMinutes()
  + seperator2 + date.getSeconds();
  return currentdate;
    
    
    }
  
  
  
  
  
function Env(t,e){class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`\ud83d\udd14${this.name}, \u5f00\u59cb!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),a={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(a,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t){let e={"M+":(new Date).getMonth()+1,"d+":(new Date).getDate(),"H+":(new Date).getHours(),"m+":(new Date).getMinutes(),"s+":(new Date).getSeconds(),"q+":Math.floor(((new Date).getMonth()+3)/3),S:(new Date).getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,((new Date).getFullYear()+"").substr(4-RegExp.$1.length)));for(let s in e)new RegExp("("+s+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?e[s]:("00"+e[s]).substr((""+e[s]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r)));let h=["","==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="];h.push(e),s&&h.push(s),i&&h.push(i),console.log(h.join("\n")),this.logs=this.logs.concat(h)}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t.stack):this.log("",`\u2757\ufe0f${this.name}, \u9519\u8bef!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}
