//[rewrite_locak]
//https://bp-api.coohua.com/bubuduo-xffd/mall/game/cash/list url script-request-header https://raw.githubusercontent.com/crygirl02/Scripts/main/REG/dsj.js

//[MITM]
//hostname=*.gaoqingdianshi.com

//[task_local]
// */30 8-23 * * * https://raw.githubusercontent.com/crygirl02/Scripts/main/REG/dsj.js, tag=电视家, enabled=true

const $ = new Env("电视家 测试");
const notify = $.isNode() ? require('./sendNotify') : '';
let message = ""
let dsj_header = $.isNode() ? (process.env.dsj_header ? process.env.dsj_header : "") : ($.getdata('dsj_header') ? $.getdata('dsj_header') : "")
let dsj_headerArr = []
let dsj_headers = ""
const walkstep = Math.floor(Math.random() * 2000) + 19800;
var gametimes = Math.floor(Math.random() * 200) + 2000;
var time = Date.parse(new Date()).toString();
const TaskCode = ` {
	"FirstDownLoginTv": "首次登录电视家TV端",
	"SpWatchVideo" : "激励视频",
	"Mobilewatchvideo": "激励视频",
	"FirstDownLoginMobile": "首次下载并登录手机版",
	"MutilPlatformActive": "双端活跃",
	"1M002": "手机在线20分钟",
	"1M005": "手机版分享",
	"gameTime": "游戏时长",
	"inviteTask": "邀请领现金",
	"taskExtraIos": "额外IOS",
	"playTask": "播放任务",
	"ShortvideoPlay": "刷短视频",
	"task_mobile_visit_song": "访问点歌台",
	"task_mobile_upload_album": "相册上电视",
	"task_mobile_create_family": "开通家庭号",
	"carveUp": "百万金币",
	"sleep": "睡觉赚钱"
}`

if (dsj_header.indexOf('@') > -1) {
  dsj_headerArr = dsj_header.split('@')
} else if (dsj_header.indexOf('&') > -1) {
  dsj_headerArr = dsj_header.split('&')
} else if (dsj_header.indexOf('\n') > -1) {
  dsj_headerArr = dsj_header.split('\n')
}
else {
  dsj_headerArr = [dsj_header]
}

!(async () => {
  if (typeof $request !== "undefined") {
    GetHeader()
  } else {
    console.log(`共${dsj_headerArr.length}个账号`)
    for (let k = 0; k < dsj_headerArr.length; k++) {
      if (dsj_headerArr[k]) {
        dsj_header1 = dsj_headerArr[k]
        $.index = k + 1
        $.log(`\n开始【电视家 ${$.index}】\n`)
        
      }
    }
    date = new Date()
    if ($.isNode() && date.getHours() == 11 && date.getMinutes() < 10) {
      if (message.length != 0) {
        await notify.sendNotify("电视家", `${message}\n\ n`);
        await SignGet()
      }
    }
  }
})()
  .catch((e) => $.logErr(e))
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
      'uuid': uuid,
      'userid': userid,
      'Authorization': authorization,
      'appid': appid,
      'Host': 'api.gaoqingdianshi.com'
    }
    bodyVal2 = JSON.stringify(bodyVal)
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
    }
  }
}


function TaskAll() {
  return new Promise((resolve) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v5/task/get`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data)
        if (data.errCode == 0) {
          console.log(`\n【任务状态】: \n`)
          const TaskData = data.data
          TaskData.forEach(function (item) {
            if (item.dayCompCount == item.dayDoCountMax) {
              result = "已完成"
            } else {
              result = "未完成"
            }
            $.log(`${item.name}:\t${item.dayCompCount}/${item.dayDoCountMax}，${result}`)
          })
        }
        $.log("\n")
      } catch (e) {
        $.logErr(e, resp)
      } finally {
        resolve()
      }
    })
  })
}

function SignGet() {
  return new Promise((resolve) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v8/sign/get`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, async (err, resp, data) => {
      try {
        data = JSON.parse(data)
        if (data.errCode == 0) {
          const reward = data.data.recentDays
          reward.forEach(function (item) {
            rewardJSON=Json.stringify(item)
            $.log(rewardJSON)
          })
        }
      } catch (e) {
        $.logErr(e, resp)
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
    $.get(url, async (error, response, data) => {
      try {
        let result = JSON.parse(data)
        if (result.errCode == 0) {
          if (result.data.tempCoin != null) {
            result.data.tempCoin.forEach(async function (item) {
              await GetCoin(item.id)
              $.log(`领取${item.from}气泡，获取金币 ${item.coin} 枚\n`)
              await $.wait(3000)
            })
            coin = result.data.coin
          }
          else {
            $.log(`\n当前无金币可以领取\n`)
          }
        }
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

function GetCoin(code) {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/coin/temp/exchange?id=${code}`,
      headers: JSON.parse(dsj_header1)
    }
    $.get(url, async (error, response, data) => {
      try {
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

function CoinList() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/coin/detail`,
      headers: JSON.parse(dsj_header1)
    }
    $.get(url, async (err, response, data) => {
      try {
        let result = JSON.parse(data)
        var Coin888Count = 0, Coin888Amount = 0
        var Play = 0, PlayAmount = 0
        result.data.forEach(item => {
          if (item.ctime > data) {
            $.log(item.from)
          }
          /*
          if(item.from=="888金币"){Coin888Count+=1,Coin888Amount+=Number(item.amount),$.log(`${item.from}:次数：${Coin888Count},金币：${Coin888Amount}`)}
          if(item.from=="播放任务"){Play+=1,PlayAmount+=Number(item.amount),$.log(`${item.from}:次数：${Play},金币：${PlayAmount}`)}
          */
        })
      }
      catch (e) {
        $.log(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

function tasksV4() {
  return new Promise(async (resolve, reject) => {
    let TaskList = ['1M002', 'SpWatchVideo', 'Mobilewatchvideo', 'MutilPlatformActive', 'MiniLoginIn', 'MiniWatchVideo', 'FirstDownLoginMobile', 'FirstDownLoginTv']
    for (code of TaskList) {
      await dotaskV4(code)
      await $.wait(Math.floor(Math.random() * 2000 + 10000));
    }
    resolve()
  })
}

function dotaskV4(code) {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v4/task/complete?code=${code}`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        let result = JSON.parse(data)
        let TaskJSON = JSON.parse(TaskCode)
        var TaskName = (TaskJSON[code] != "undefined") ? TaskJSON[code] : code
        if (result.errCode == 0) {
          console.log(`【任务名称】：${TaskName}，获得金币:${result.data.getCoin}`)
        } else {
          console.log(`【任务名称】: ${TaskName}，${result.msg}`)
        }
      } catch (e) {
        $.logErr(e, response)
      } finally {
        resolve()
      }
    })
  })
}

function tasksV5() {
  return new Promise(async (resolve, reject) => {
    let TaskList = ['task_xiaoman', 'ShortvideoPlay', 'task_mobile_create_family', 'task_mobile_upload_album', 'task_mobile_visit_album', 'task_mobile_visit_song', '1M005', 'playTask', 'H5Page_4']
    for (code of TaskList) {
      await dotaskV5(code)
      await $.wait(Math.floor(Math.random() * 2000 + 10000));
    }
    resolve()
  })
}

function dotaskV5(code) {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v5/task/complete?code=${code}&comType=0`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        let result = JSON.parse(data)
        let TaskJSON = JSON.parse(TaskCode)
        if (result.errCode == 0) {
          $.log('【任务名称】：' + TaskJSON[code] + '，获得金币:' + result.data.getCoin)
        } else {
          $.log('【任务名称】：' + TaskJSON[code] + '，' + result.msg)
        }
      } catch (e) {
        $.logErr(e, response)
      } finally {
        resolve()
      }
    })
  })
}

function getGametime() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v4/task/complete?code=gameTime&time=${gametimes}`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        let result = JSON.parse(data)
        let TaskJSON = JSON.parse(TaskCode)
        if (result.errCode == 0) {
          $.log('【任务名称】：' + TaskJSON[code] + '，获得金币:' + result.data.getCoin)
        } else {
          $.log('【任务名称】：' + TaskJSON[code] + '，' + result.msg)
        }
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

function signin() {
  return new Promise((resolve, reject) => {
    let url = {
      url: 'http://api.gaoqingdianshi.com/api/v5/sign/signin?accelerate=0&ext=0&ticket=',
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, async (error, response, data) => {
      try {
        let result = JSON.parse(data)
        if (result.errCode == 0) {
          console.log(`\n【签到收益】: ${result.data.reward[0].count}金币`)
        } else if (result.errCode == 4) {
          console.log(`\n【签到结果】重复签到`)
        } else if (result.errCode == 6) {
          console.log(`\n【签到结果】失败`)
        }
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

//领明天额度
function Reward(code) {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/sign/chooseAdditionalReward?rewardId=${code}`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      resolve()
    })
  })
}

function sleep() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/taskext/getSleep?ext=1`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        $.log(`睡觉任务: ${data}\n`)
        let sleepres = JSON.parse(data)
        if (sleepres.errCode == 0) {
          sleeping = sleepres.data.name + '报名成功 🛌'
        } else if (sleepres.errCode == 4006) {
          sleeping = '睡觉中😴'
        } else {
          sleeping = ''
        }
        resolve()
      } catch (e) {
        $.msg($.name, `睡觉结果: 失败`, `说明: ${e}`)
      }
      console.log(`\n【睡觉任务】: ${sleeping}`)
      resolve()
    })
  })
}

function wakeup() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/taskext/getCoin?code=sleep&coin=1910&ext=1`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      $.log(`睡觉打卡: ${data}\n`)
    })
    resolve()
  })
}

function CarveUp() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v2/taskext/getCarveUp?ext=1`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        const result = JSON.parse(data)
        if (result.errCode == 0) {
          $.log(`【瓜分百万金币】报名成功`)
        }
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

function walk() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/taskext/getWalk?step=${walkstep}`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        let result = JSON.parse(data)
        $.get({
          url: `http://api.gaoqingdianshi.com/api/taskext/getCoin?code=walk&coin=${result.data.unGetCoin}&ext=1`,
          headers: JSON.parse(dsj_header1),
        }, (error, response, data) => { })
        $.log(`【走路领金币】：获得${result.data.unGetCoin} 金币`)
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

function getCUpcoin() {
  return new Promise((resolve, reject) => {
    $.get({
      url: `http://api.gaoqingdianshi.com/api/taskext/getCoin?ext=0&code=carveUp`,
      headers: JSON.parse(dsj_header1),
    }, (error, response, data) => {
      //console.log(data)
      $.log(`【瓜分百万金币】: 获得${data}金币`)
    })
    resolve()
  })
}

function GetInfo() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v3/user/info`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      let result = JSON.parse(data)
      if (result.errCode == 0) {
        nickname = result.data.nickname
        headImgUrl = result.data.headImgUrl
        invite()
      } else {
        console.log(`\n【电视家提示】: ${result.msg}`)
      }
      resolve()
    })
  })
}


function invite() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/activity/invite/bind?ename=${nickname}&eavatar=${headImgUrl}&uid=${JSON.parse(dsj_header1).userid}&inviteCode=1126866`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      let result = JSON.parse(data)
      if (result.errCode == 0) {
      } else {
      }
      resolve()
    })
  })
}

function cash() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/cash/info`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      try {
        let cashresult = JSON.parse(data)
        if (cashresult.errCode == "0") {
          console.log(`\n【当前资产状态】\n总现金: ${cashresult.data.amount / 100}, 提现额度: ${cashresult.data.withdrawalQuota / 100}`)
        }
      }
      catch (e) {
        $.logErr(e, response)
      }
      finally {
        resolve()
      }
    })
  })
}

//零花赚
function lhz() {
  return new Promise((resolve, reject) => {
    let url = {
      url: `http://api.gaoqingdianshi.com/api/v5/task/complete?code=H5Page_2&comType=0`,
      headers: JSON.parse(dsj_header1),
    }
    $.get(url, (error, response, data) => {
      //console.log(data)
      let result = JSON.parse(data)
      if (result.errCode == 0) {
        console.log('\n阅读零花赚：' + '阅读次数:' + result.data.dayCompCount)
      } else {
        console.log('\n【阅读零花赚: ' + result.msg)
      }
      resolve()
    })
  })
}

function wx_tasks() {
  return new Promise(async (resolve, reject) => {
    let taskcode = ['1M002', 'SpWatchVideo', 'Mobilewatchvideo', 'MutilPlatformActive', 'MiniLoginIn', 'MiniWatchVideo', 'FirstDownLoginMobile', 'FirstDownLoginTv']
    for (code of taskcode) {
      await wx_dotask(code)
      await $.wait(10000);
    }
    resolve()
  })
}
//小程序任务
function wx_dotask(code) {
  return new Promise((resolve, reject) => {
    let url = {
      url: `https://api.dianshihome.com/api/v4/task/complete?code=${code}&comType=1`,
      headers: JSON.parse(`{
        "userid": "${JSON.parse(dsj_header1).userid}",
        "authorization": "${JSON.parse(dsj_header1).authorization}",
        "appid": "${JSON.parse(dsj_header1).appId}",
        "Host": "api.dianshihome.com",
        "content-type": "application/x-www-form-urlencoded",
        "Referer": "https://servicewechat.com/wx9e8718eb2360dfb8/117/page-frame.html"
      }`)
    }
    $.get(url, (error, response, data) => {
      //console.log(data)
      let result = JSON.parse(data)
      let TaskJSON = JSON.parse(TaskCode)
      var TaskName = (TaskJSON[code] != "undefined") ? TaskJSON[code] : code
      if (result.errCode == 0) {
        console.log('【微信任务】：' + TaskName + '，获得金币:' + result.data.getCoin)
      } else {
        console.log('【微信任务】: ' + TaskName + '，' + result.msg)
      }
      resolve()
    })
  })
}

function Env(t, e) { "undefined" != typeof process && JSON.stringify(process.env).indexOf("GITHUB") > -1 && process.exit(0); class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
