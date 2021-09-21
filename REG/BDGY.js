/*
测试用环境变量：BaiduCookie
打开百度果园，获取百度CK
浇一次水，获取种子ID
*/

const $ = new Env('百度果园测试')
const notify = $.isNode() ? require('./sendNotify') : ''
let message = "", count = 0, BaiduCookieArr = []
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148'

if ($.isNode()) {
    if (process.env.BaiduCookie) {
        if (process.env.BaiduCookie.indexOf('@') > -1) {
            BaiduCookieArr = process.env.BaiduCookie.split('@');
        } else if (process.env.BaiduCookie.indexOf('\n') > -1) {
            BaiduCookieArr = process.env.BaiduCookie.split('\n');
        } else if (process.env.BaiduCookie.indexOf('&') > -1) {
            BaiduCookieArr = process.env.BaiduCookie.split('&');
        } else {
            BaiduCookieArr = [process.env.BaiduCookie]
        }
    }
} else {
    BaiduCookie = ($.getdata('BaiduCookie')) ? $.getdata('BaiduCookie') : ""
    if (BaiduCookie) {
        if (BaiduCookie.indexOf('@') == -1) {
            BaiduCookieArr.push(BaiduCookie)
        } else if (BaiduCookie.indexOf('\n') > -1) {
            BaiduCookieArr.BaiduCookie.split('\n')
        } else if (BaiduCookie.indexOf('&') > -1) {
            BaiduCookieArr.BaiduCookie.split('&')
        } else {
            BaiduCookieArr = [BaiduCookie]
        }
    }
}

if ($.isNode() && process.env.BaiduPlantNo) {
    BaiduPlantNo = [process.env.BaiduPlantNo]
} else {
    BaiduPlantNo = ($.getdata('BaiduPlantNo')) ? $.getdata('BaiduPlantNo') : ""
}

!(async () => {
    if (typeof $request !== "undefined") {
        GetHeaders()
        GetPlantNo()
        $.done()
    }
    else {
        console.log(`-------------共${BaiduCookieArr.length}个账号-------------\n`)
        for (i = 0; i < BaiduCookieArr.length; i++) {
            $.log(`开始${$.name}${i + 1}\n`)
            BaiduCookie = BaiduCookieArr[i]
            await BucketWater()
            if ($.time('HH') >= 7 && $.time('HH') <= 9) await Three_MealsWater()
            if ($.time('HH') >= 11 && $.time('HH') <= 14) await Three_MealsWater()
            if ($.time('HH') >= 18 && $.time('HH') <= 21) await Three_MealsWater()
            await Watering()
        }
    }
    //await notify.sendNotify($.name,message)
})()
    .catch((e) => $.logErr(e))
    .finally(() => $.done())

function BucketWater() {
    return new Promise((resolve) => {
        let url = {
            url: 'https://orchard.baidu.com/orchard/collect/water?waterType=bucket',
            headers: {
                'Cookie': BaiduCookie,
                'User-Agent': UA,
            },
        }
        $.get(url, async (err, response, data) => {
            try {
                const result = JSON.parse(data)
                if (result.errno == 0) {
                    $.log(`收集水桶水滴：${result.data.rewardWater}g，剩余水滴：${result.data.waterInfo.availableWaterDrop}g\n`)
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

function Three_MealsWater() {
    return new Promise((resolve) => {
        let url = {
            url: `https://orchard.baidu.com/orchard/collect/water?waterType=three_meals`,
            headers: {
                'Cookie': BaiduCookie,
                'User-Agent': UA,
            },
        }
        $.get(url, async (err, response, data) => {
            try {
                const result = JSON.parse(data)
                if (result.errno == 0) {
                    $.log(`领取三餐水滴：${result.data.rewardWater}g，剩余水滴：${result.data.waterInfo.availableWaterDrop}g\n`)
                }
                else{
                    $.log(`${result.msg}\n`)
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

function red_packetWater() {
    return new Promise((resolve) => {
        let url = {
            url: `https://orchard.baidu.com/orchard/collect/water?waterType=red_packet`,
            headers: {
                'Cookie': BaiduCookie,
                'User-Agent': UA,
            },
        }
        $.get(url, async (err, response, data) => {
            try {
                const result = JSON.parse(data)
                if (result.errno == 0) {
                    $.log(`开红包获得水滴：${result.data.rewardWater}g，剩余水滴：${result.data.waterInfo.availableWaterDrop}g\n`)
                }
                else{
                    $.log(`${result.msg}\n`)
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

function TaskWater(code) {
    return new Promise((resolve) => {
        let url = {
            url: `https://orchard.baidu.com/orchard/collect/water?waterType=task?taskId=${code}`,
            headers: {
                'Cookie': BaiduCookie,
                'User-Agent': UA,
            },
        }
        $.get(url, async (err, response, data) => {
            try {
                const result = JSON.parse(data)
                if (result.errno == 0) {

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

function Watering() {
    return new Promise((resolve) => {
        $.wait(Math.random() * 200 + 5000)
        let url = {
            url: `https://orchard.baidu.com/orchard/plant/watering?${BaiduPlantNo}`,
            headers: {
                'Cookie': BaiduCookie,
                'User-Agent': UA,
            },
        }
        $.get(url, async (err, response, data) => {
            try {
                const result = JSON.parse(data)
                if (result.errno == 0) {
                    water = result.data.waterInfo.availableWaterDrop
                    $.log(`浇水成功，剩余水滴${water}\n`)
                    count = Math.trunc(result.data.waterInfo.availableWaterDrop / 10)
                    redpacket_leftcount = result.data.itemsList.redPacket.leftWaterTimes
                    if(redpacket_leftcount==0){
                        await red_packetWater()
                    }
                    for (i = 1; i <= count; i++) {
                        await Watering()
                        await $.wait(Math.random() * 200 + 5000)
                    }
                } else {
                    $.log(`${result.msg}\n`)
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

function GetHeaders() {
    if ($request.url.indexOf('orchard') > -1) {
        const BaiduCookie = JSON.stringify($request.headers)
        let Headers = JSON.parse(BaiduCookie)
        Headers = BaiduCookie.match(/BAIDUCUID=\w+; BDUSS=\w+;/).toString()
        $.setdata(Headers, 'BaiduCookie')
        $.msg($.name, "Cookie数据获取成功")
    }
}

function GetPlantNo() {
    if ($request.url.indexOf('plantNo') > -1) {
        const BaiduCookie = $request.url
        let Headers = JSON.parse(BaiduCookie)
        plantNo = BaiduCookie.match(/plantNo=\w+/).toString()
        $.setdata(plantNo, 'BaiduPlantNo')
        $.msg($.name, "种子数据获取成功")
    }
}
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); s && this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; if (this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))), !this.isMuteLog) { let t = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; t.push(e), s && t.push(s), i && t.push(i), console.log(t.join("\n")), this.logs = this.logs.concat(t) } } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }