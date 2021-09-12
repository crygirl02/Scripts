// TODO:

//++++++++++++++++++++++++++++++++++++
const $ = new Env("HELPBANG Cookie");
let helpbang = $.getjson('helpbang', [])

  //++++++++++++++++++++++++++++++++++++
  !(async () => {
    if (typeof $request !== "undefined") {
      await GetCookie();
    }
  })()
  .catch((e) => {
    $.log('', `❌ ${$.name}, 失败! 原因: ${e}!`, '')
  })
  .finally(() => {
    $.done();
  })

//++++++++++++++++++++++++++++++++++++
async function GetCookie() {
  //基础数据
  if ($request.url.indexOf("getUserInfo") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    //[response data]
    let [userId, gold] = await userinfo(userbody, userkey);
    if (userId) {
      let status = 1;
      let no = helpbang.length;
      for (let i = 0, len = no; i < len; i++) {
        let ac = helpbang[i] || {};
        if (ac.uid) {
          if (ac.uid == userId) {
            no = i;
            status = 0;
            break;
          }
        } else if (no == len) {
          no = i;
        }
      }
      let helpbangck = helpbang[no]
      if (!helpbangck) {
        helpbang[no] = {
          uid: userId,
          bd: userbody,
          hd: userkey,
          gold: gold,
        };
      }

      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: userbody: ${userbody}`)
      $.log(`获取成功🎉: userkey: ${userkey}`)
      $.log(`获取成功🎉: userid: ${userId}`)
      $.log(`获取成功🎉: gold: ${gold}`)
      $.msg($.name, '', `互利帮[账号${no+1}] ${status?'新增':'更新'}[UID]数据成功！🎉`);
    } else {
      $.msg($.name, '', '互利帮用户[UID]数据获取失败⚠️');
    }
  }
  //任务中心
  if ($request.url.indexOf("getRewardTaskConfigInfo_V5") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].tkinfosum = sum;
      helpbang[calarrno(len, hduid)].tkinfonon = non;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: tkinfosum: ${sum}`)
      $.log(`获取成功🎉: tkinfonon: ${non}`)
      $.msg($.name, '', `互利帮[账号${calarrno(len,hduid)+1}] 获取[任务中心]数据成功！🎉`);
    } else {
      $.msg($.name, '', '互利帮[任务中心]数据获取失败⚠️');
    }
  }
  //签到
  if ($request.url.indexOf("signInWatchVideo") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].signsum = sum;
      helpbang[calarrno(len, hduid)].signnon = non;
      helpbang[calarrno(len, hduid)].signtt = tt;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: signsum: ${sum}`)
      $.log(`获取成功🎉: signnon: ${non}`)
      $.log(`获取成功🎉: signtt: ${tt}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[签到]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[签到]数据获取失败⚠️');
    }
  }
  //发布互助任务
  if ($request.url.match(/\/benefit\/addTask/)) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].gotasksum = sum;
      helpbang[calarrno(len, hduid)].gotasknon = non;
      helpbang[calarrno(len, hduid)].gotasktt = tt;
      helpbang[calarrno(len, hduid)].gotaskbody = userbody;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: gotasksum: ${sum}`)
      $.log(`获取成功🎉: gotasknon: ${non}`)
      $.log(`获取成功🎉: gotasktt: ${tt}`)
      $.log(`获取成功🎉: gotaskbody: ${userbody}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[发布互助任务]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[发布互助任务]数据获取失败⚠️');
    }
  }
  //互助任务coin
  if ($request.url.indexOf("completeMutualAidTask") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].fintasksum = sum;
      helpbang[calarrno(len, hduid)].fintasknon = non;
      helpbang[calarrno(len, hduid)].fintasktt = tt;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: fintasksum: ${sum}`)
      $.log(`获取成功🎉: fintasknon: ${non}`)
      $.log(`获取成功🎉: fintasktt: ${tt}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[互助任务奖励]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[互助任务奖励]数据获取失败⚠️');
    }
  }
  //sharewx朋友圈
  if ($request.url.indexOf("completeShareWxCircleTask") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].wxsharesum = sum;
      helpbang[calarrno(len, hduid)].wxsharenon = non;
      helpbang[calarrno(len, hduid)].wxsharett = tt;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: wxsharesum: ${sum}`)
      $.log(`获取成功🎉: wxsharenon: ${non}`)
      $.log(`获取成功🎉: wxsharett: ${tt}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[分享微信朋友圈]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[分享微信朋友圈]数据获取失败⚠️');
    }
  }
  //sharewx微信群
  if ($request.url.indexOf("completeShareWxGroupTask") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].sharesum = sum;
      helpbang[calarrno(len, hduid)].sharenon = non;
      helpbang[calarrno(len, hduid)].sharett = tt;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: sharesum: ${sum}`)
      $.log(`获取成功🎉: sharenon: ${non}`)
      $.log(`获取成功🎉: sharett: ${tt}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[分享微信群]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[分享微信群]数据获取失败⚠️');
    }
  }
  //kanvideo
  if ($request.url.indexOf("completeWatchVideoTask") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].kanvideohd = userkey;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: kanvideohd: ${userkey}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[看视频]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[看视频]数据获取失败⚠️');
    }
  }
  //步数金币
  if ($request.url.indexOf("exchangeStepToCoin") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].stepcoinhd = userkey;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: stepcoinhd: ${userkey}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[步数金币]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[步数金币]数据获取失败⚠️');
    }
  }
  //气泡金币
  if ($request.url.indexOf("collectCoin") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].collectcoinsum = sum;
      helpbang[calarrno(len, hduid)].collectcoinnon = non;
      helpbang[calarrno(len, hduid)].collectcointt = tt;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: collectcoinsum: ${sum}`)
      $.log(`获取成功🎉: collectcoinnon: ${non}`)
      $.log(`获取成功🎉: collectcointt: ${tt}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[气泡金币]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[气泡金币]数据获取失败⚠️');
    }
  }
  if ($request.url.indexOf("applyWithdraw") > -1) {
    const userbody = $request.body;
    const userkey = JSON.stringify($request.headers);
    let hduid = $request.headers['uniqueId'];
    let sum = $request.headers['checkSum'];
    let non = $request.headers['nonce'];
    let tt = $request.headers['curTime'];
    let len = helpbang.length
    if (hduid) {
      helpbang[calarrno(len, hduid)].txsum = sum;
      helpbang[calarrno(len, hduid)].txnon = non;
      helpbang[calarrno(len, hduid)].txtt = tt;
      $.setdata(JSON.stringify(helpbang, null, 2), 'helpbang');
      $.log(`获取成功🎉: txsum: ${sum}`)
      $.log(`获取成功🎉: txnon: ${non}`)
      $.log(`获取成功🎉: txtt: ${tt}`)
      $.msg($.name, "", `互利帮[账号${calarrno(len,hduid)+1}] 获取[提现]数据成功！🎉`);
    } else {
      $.msg($.name, "", '互利帮[提现]数据获取失败⚠️');
    }
  }
}
//++++++++++++++++++++++++++++++++++++

function userinfo(userbody, userkey) {
  return new Promise((resolve) => {
    let options = {
      url: `https://hlxcx.renmaibangvip.cn/user/getUserInfo`,
      body: userbody,
      headers: JSON.parse(userkey),
    }
    $.post(options, async (err, resp, data) => {
      try {
        if (err) {
          console.log(`⛔️API查询请求失败,请检查网络设置‼️‼️ \n ${JSON.stringify(err)}`);
        } else {
          if (safeGet(data)) {
            data = JSON.parse(data);
            userId = data.data.userInfo.uniqueId
            gold = data.data.userInfo.coinBalance
          }
        }
      } catch (e) {
        $.log(`=================\nurl: ${options.url}\ndata: ${resp && resp.body}`);
        $.logErr(e, resp);
      } finally {
        resolve([userId, gold])
      }
    })
  })
}

//++++++++++++++++++++++++++++++++++++
function calarrno(l, n) {
  let no = l;
  for (let i = 0, len2 = no; i < len2; i++) {
    let ac = helpbang[i] || {};
    if (ac.uid) {
      if (ac.uid == n) {
        no = i;
        break;
      }
    } else if (no == len2) {
      no = i;
    }
  }
  return no
}

function safeGet(data) {
  try {
    if (typeof JSON.parse(data) == "object") {
      return true;
    }
  } catch (e) {
    console.log(e);
    console.log(`⛔️服务器访问数据为空，请检查自身设备网络情况`);
    return false;
  }
}

function Env(name, opts) {
  class Http {
    constructor(env) {
      this.env = env
    }

    send(opts, method = 'GET') {
      opts = typeof opts === 'string' ? {
        url: opts
      } : opts
      let sender = this.get
      if (method === 'POST') {
        sender = this.post
      }
      return new Promise((resolve, reject) => {
        sender.call(this, opts, (err, resp, body) => {
          if (err) reject(err)
          else resolve(resp)
        })
      })
    }

    get(opts) {
      return this.send.call(this.env, opts)
    }

    post(opts) {
      return this.send.call(this.env, opts, 'POST')
    }
  }

  return new(class {
    constructor(name, opts) {
      this.name = name
      this.http = new Http(this)
      this.data = null
      this.dataFile = 'box.dat'
      this.logs = []
      this.isMute = false
      this.isNeedRewrite = false
      this.logSeparator = '\n'
      this.startTime = new Date().getTime()
      Object.assign(this, opts)
      this.log('', `🔔${this.name}, 开始!`)
    }

    isNode() {
      return 'undefined' !== typeof module && !!module.exports
    }

    isQuanX() {
      return 'undefined' !== typeof $task
    }

    isSurge() {
      return 'undefined' !== typeof $httpClient && 'undefined' === typeof $loon
    }

    isLoon() {
      return 'undefined' !== typeof $loon
    }

    isShadowrocket() {
      return 'undefined' !== typeof $rocket
    }

    toObj(str, defaultValue = null) {
      try {
        return JSON.parse(str)
      } catch {
        return defaultValue
      }
    }

    toStr(obj, defaultValue = null) {
      try {
        return JSON.stringify(obj)
      } catch {
        return defaultValue
      }
    }

    getjson(key, defaultValue) {
      let json = defaultValue
      const val = this.getdata(key)
      if (val) {
        try {
          json = JSON.parse(this.getdata(key))
        } catch {}
      }
      return json
    }

    setjson(val, key) {
      try {
        return this.setdata(JSON.stringify(val), key)
      } catch {
        return false
      }
    }

    getScript(url) {
      return new Promise((resolve) => {
        this.get({
          url
        }, (err, resp, body) => resolve(body))
      })
    }

    runScript(script, runOpts) {
      return new Promise((resolve) => {
        let httpapi = this.getdata('@chavy_boxjs_userCfgs.httpapi')
        httpapi = httpapi ? httpapi.replace(/\n/g, '').trim() : httpapi
        let httpapi_timeout = this.getdata('@chavy_boxjs_userCfgs.httpapi_timeout')
        httpapi_timeout = httpapi_timeout ? httpapi_timeout * 1 : 20
        httpapi_timeout = runOpts && runOpts.timeout ? runOpts.timeout : httpapi_timeout
        const [key, addr] = httpapi.split('@')
        const opts = {
          url: `http://${addr}/v1/scripting/evaluate`,
          body: {
            script_text: script,
            mock_type: 'cron',
            timeout: httpapi_timeout
          },
          headers: {
            'X-Key': key,
            'Accept': '*/*'
          }
        }
        this.post(opts, (err, resp, body) => resolve(body))
      }).catch((e) => this.logErr(e))
    }

    loaddata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require('fs')
        this.path = this.path ? this.path : require('path')
        const curDirDataFilePath = this.path.resolve(this.dataFile)
        const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
        const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
        if (isCurDirDataFile || isRootDirDataFile) {
          const datPath = isCurDirDataFile ? curDirDataFilePath : rootDirDataFilePath
          try {
            return JSON.parse(this.fs.readFileSync(datPath))
          } catch (e) {
            return {}
          }
        } else return {}
      } else return {}
    }

    writedata() {
      if (this.isNode()) {
        this.fs = this.fs ? this.fs : require('fs')
        this.path = this.path ? this.path : require('path')
        const curDirDataFilePath = this.path.resolve(this.dataFile)
        const rootDirDataFilePath = this.path.resolve(process.cwd(), this.dataFile)
        const isCurDirDataFile = this.fs.existsSync(curDirDataFilePath)
        const isRootDirDataFile = !isCurDirDataFile && this.fs.existsSync(rootDirDataFilePath)
        const jsondata = JSON.stringify(this.data)
        if (isCurDirDataFile) {
          this.fs.writeFileSync(curDirDataFilePath, jsondata)
        } else if (isRootDirDataFile) {
          this.fs.writeFileSync(rootDirDataFilePath, jsondata)
        } else {
          this.fs.writeFileSync(curDirDataFilePath, jsondata)
        }
      }
    }

    lodash_get(source, path, defaultValue = undefined) {
      const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
      let result = source
      for (const p of paths) {
        result = Object(result)[p]
        if (result === undefined) {
          return defaultValue
        }
      }
      return result
    }

    lodash_set(obj, path, value) {
      if (Object(obj) !== obj) return obj
      if (!Array.isArray(path)) path = path.toString().match(/[^.[\]]+/g) || []
      path
        .slice(0, -1)
        .reduce((a, c, i) => (Object(a[c]) === a[c] ? a[c] : (a[c] = Math.abs(path[i + 1]) >> 0 === +path[i + 1] ? [] : {})), obj)[
          path[path.length - 1]
        ] = value
      return obj
    }

    getdata(key) {
      let val = this.getval(key)
      // 如果以 @
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
        const objval = objkey ? this.getval(objkey) : ''
        if (objval) {
          try {
            const objedval = JSON.parse(objval)
            val = objedval ? this.lodash_get(objedval, paths, '') : val
          } catch (e) {
            val = ''
          }
        }
      }
      return val
    }

    setdata(val, key) {
      let issuc = false
      if (/^@/.test(key)) {
        const [, objkey, paths] = /^@(.*?)\.(.*?)$/.exec(key)
        const objdat = this.getval(objkey)
        const objval = objkey ? (objdat === 'null' ? null : objdat || '{}') : '{}'
        try {
          const objedval = JSON.parse(objval)
          this.lodash_set(objedval, paths, val)
          issuc = this.setval(JSON.stringify(objedval), objkey)
        } catch (e) {
          const objedval = {}
          this.lodash_set(objedval, paths, val)
          issuc = this.setval(JSON.stringify(objedval), objkey)
        }
      } else {
        issuc = this.setval(val, key)
      }
      return issuc
    }

    getval(key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.read(key)
      } else if (this.isQuanX()) {
        return $prefs.valueForKey(key)
      } else if (this.isNode()) {
        this.data = this.loaddata()
        return this.data[key]
      } else {
        return (this.data && this.data[key]) || null
      }
    }

    setval(val, key) {
      if (this.isSurge() || this.isLoon()) {
        return $persistentStore.write(val, key)
      } else if (this.isQuanX()) {
        return $prefs.setValueForKey(val, key)
      } else if (this.isNode()) {
        this.data = this.loaddata()
        this.data[key] = val
        this.writedata()
        return true
      } else {
        return (this.data && this.data[key]) || null
      }
    }

    initGotEnv(opts) {
      this.got = this.got ? this.got : require('got')
      this.cktough = this.cktough ? this.cktough : require('tough-cookie')
      this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar()
      if (opts) {
        opts.headers = opts.headers ? opts.headers : {}
        if (undefined === opts.headers.Cookie && undefined === opts.cookieJar) {
          opts.cookieJar = this.ckjar
        }
      }
    }

    get(opts, callback = () => {}) {
      if (opts.headers) {
        delete opts.headers['Content-Type']
        delete opts.headers['Content-Length']
      }
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {}
          Object.assign(opts.headers, {
            'X-Surge-Skip-Scripting': false
          })
        }
        $httpClient.get(opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body
            resp.statusCode = resp.status
          }
          callback(err, resp, body)
        })
      } else if (this.isQuanX()) {
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {}
          Object.assign(opts.opts, {
            hints: false
          })
        }
        $task.fetch(opts).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => callback(err)
        )
      } else if (this.isNode()) {
        this.initGotEnv(opts)
        this.got(opts)
          .on('redirect', (resp, nextOpts) => {
            try {
              if (resp.headers['set-cookie']) {
                const ck = resp.headers['set-cookie'].map(this.cktough.Cookie.parse).toString()
                if (ck) {
                  this.ckjar.setCookieSync(ck, null)
                }
                nextOpts.cookieJar = this.ckjar
              }
            } catch (e) {
              this.logErr(e)
            }
            // this.ckjar.setCookieSync(resp.headers['set-cookie'].map(Cookie.parse).toString())
          })
          .then(
            (resp) => {
              const {
                statusCode: status,
                statusCode,
                headers,
                body
              } = resp
              callback(null, {
                status,
                statusCode,
                headers,
                body
              }, body)
            },
            (err) => {
              const {
                message: error,
                response: resp
              } = err
              callback(error, resp, resp && resp.body)
            }
          )
      }
    }

    post(opts, callback = () => {}) {
      const method = opts.method ? opts.method.toLocaleLowerCase() : 'post'
      // 如果指定了请求体, 但没指定`Content-Type`, 则自动生成
      if (opts.body && opts.headers && !opts.headers['Content-Type']) {
        opts.headers['Content-Type'] = 'application/x-www-form-urlencoded'
      }
      if (opts.headers) delete opts.headers['Content-Length']
      if (this.isSurge() || this.isLoon()) {
        if (this.isSurge() && this.isNeedRewrite) {
          opts.headers = opts.headers || {}
          Object.assign(opts.headers, {
            'X-Surge-Skip-Scripting': false
          })
        }
        $httpClient[method](opts, (err, resp, body) => {
          if (!err && resp) {
            resp.body = body
            resp.statusCode = resp.status
          }
          callback(err, resp, body)
        })
      } else if (this.isQuanX()) {
        opts.method = method
        if (this.isNeedRewrite) {
          opts.opts = opts.opts || {}
          Object.assign(opts.opts, {
            hints: false
          })
        }
        $task.fetch(opts).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => callback(err)
        )
      } else if (this.isNode()) {
        this.initGotEnv(opts)
        const {
          url,
          ..._opts
        } = opts
        this.got[method](url, _opts).then(
          (resp) => {
            const {
              statusCode: status,
              statusCode,
              headers,
              body
            } = resp
            callback(null, {
              status,
              statusCode,
              headers,
              body
            }, body)
          },
          (err) => {
            const {
              message: error,
              response: resp
            } = err
            callback(error, resp, resp && resp.body)
          }
        )
      }
    }
    /**
     *
     * 示例:$.time('yyyy-MM-dd qq HH:mm:ss.S')
     *    :$.time('yyyyMMddHHmmssS')
     *    y:年 M:月 d:日 q:季 H:时 m:分 s:秒 S:毫秒
     *    其中y可选0-4位占位符、S可选0-1位占位符，其余可选0-2位占位符
     * @param {string} fmt 格式化参数
     * @param {number} 可选: 根据指定时间戳返回格式化日期
     *
     */
    time(fmt, ts = null) {
      const date = ts ? new Date(ts) : new Date()
      let o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'H+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds(),
        'q+': Math.floor((date.getMonth() + 3) / 3),
        'S': date.getMilliseconds()
      }
      if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length))
      for (let k in o)
        if (new RegExp('(' + k + ')').test(fmt))
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length))
      return fmt
    }

    /**
     * 系统通知
     *
     * > 通知参数: 同时支持 QuanX 和 Loon 两种格式, EnvJs根据运行环境自动转换, Surge 环境不支持多媒体通知
     *
     * 示例:
     * $.msg(title, subt, desc, 'twitter://')
     * $.msg(title, subt, desc, { 'open-url': 'twitter://', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     * $.msg(title, subt, desc, { 'open-url': 'https://bing.com', 'media-url': 'https://github.githubassets.com/images/modules/open_graph/github-mark.png' })
     *
     * @param {*} title 标题
     * @param {*} subt 副标题
     * @param {*} desc 通知详情
     * @param {*} opts 通知参数
     *
     */
    msg(title = name, subt = '', desc = '', opts) {
      const toEnvOpts = (rawopts) => {
        if (!rawopts) return rawopts
        if (typeof rawopts === 'string') {
          if (this.isLoon()) return rawopts
          else if (this.isQuanX()) return {
            'open-url': rawopts
          }
          else if (this.isSurge()) return {
            url: rawopts
          }
          else return undefined
        } else if (typeof rawopts === 'object') {
          if (this.isLoon()) {
            let openUrl = rawopts.openUrl || rawopts.url || rawopts['open-url']
            let mediaUrl = rawopts.mediaUrl || rawopts['media-url']
            return {
              openUrl,
              mediaUrl
            }
          } else if (this.isQuanX()) {
            let openUrl = rawopts['open-url'] || rawopts.url || rawopts.openUrl
            let mediaUrl = rawopts['media-url'] || rawopts.mediaUrl
            return {
              'open-url': openUrl,
              'media-url': mediaUrl
            }
          } else if (this.isSurge()) {
            let openUrl = rawopts.url || rawopts.openUrl || rawopts['open-url']
            return {
              url: openUrl
            }
          }
        } else {
          return undefined
        }
      }
      if (!this.isMute) {
        if (this.isSurge() || this.isLoon()) {
          $notification.post(title, subt, desc, toEnvOpts(opts))
        } else if (this.isQuanX()) {
          $notify(title, subt, desc, toEnvOpts(opts))
        }
      }
      if (!this.isMuteLog) {
        let logs = ['', '==============📣系统通知📣==============']
        logs.push(title)
        subt ? logs.push(subt) : ''
        desc ? logs.push(desc) : ''
        console.log(logs.join('\n'))
        this.logs = this.logs.concat(logs)
      }
    }

    log(...logs) {
      if (logs.length > 0) {
        this.logs = [...this.logs, ...logs]
      }
      console.log(logs.join(this.logSeparator))
    }

    logErr(err, msg) {
      const isPrintSack = !this.isSurge() && !this.isQuanX() && !this.isLoon()
      if (!isPrintSack) {
        this.log('', `❗️${this.name}, 错误!`, err)
      } else {
        this.log('', `❗️${this.name}, 错误!`, err.stack)
      }
    }

    wait(time) {
      return new Promise((resolve) => setTimeout(resolve, time))
    }

    done(val = {}) {
      const endTime = new Date().getTime()
      const costTime = (endTime - this.startTime) / 1000
      this.log('', `🔔${this.name}, 结束! 🕛 ${costTime} 秒`)
      this.log()
      if (this.isSurge() || this.isQuanX() || this.isLoon()) {
        $done(val)
      }
    }
  })(name, opts)
}
