const $ = new Env('富豪小镇test');
let status;
status = (status = ($.getval("tfbstatus") || "1")) > 1 ? `${status}` : ""; // 账号扩展字符
let fhxzurlArr = []
let fhxzurl = $.isNode() ? (process.env.fhxzurl ? process.env.fhxzurl : "") : ($.getdata('fhxzurl') ? $.getdata('fhxzurl') : "")
let fhxzurls = ""
let id = ""
let market_getItemList = '[{"type":"market_getItemList","data":{}}]'
!(async() => {
  if (typeof $request !== "undefined") {
    await tfbck()
  } else {
    if (!$.isNode()) {
      fhxzurlArr.push($.getdata('fhxzurl'))
      let tfbcount = ($.getval('tfbcount') || '1');
      for (let i = 2; i <= tfbcount; i++) {
        fhxzurlArr.push($.getdata(`fhxzurl${i}`))
      }
      console.log(`-------------共${fhxzurlArr.length}个账号-------------\n`)
      for (let i = 0; i < fhxzurlArr.length; i++) {
        if (fhxzurlArr[i]) {
          fhxzurl = fhxzurlArr[i];
          $.index = i + 1;
          console.log(`\n开始【富豪小镇 ${$.index}】`)
          //await wzcc(); //汽车
          //await $.wait(Math.floor(Math.random()*100)+1000);      
          await dailyQuestd();
          await $.wait(Math.floor(Math.random() * 100) + 1000);
        }
      }
    } else {
      if (process.env.fhxzurl && process.env.fhxzurl.indexOf('@') > -1) {
        fhxzurlArr = process.env.fhxzurl.split('@');
        console.log(`您选择的是用"@"隔开\n`)
      } else {
        fhxzurls = [process.env.fhxzurl]
      };
      Object.keys(fhxzurls).forEach((item) => {
        if (fhxzurls[item]) {
          fhxzurlArr.push(fhxzurls[item])
        }
      })
      console.log(`共${fhxzurlArr.length}个cookie`)
      for (let k = 0; k < fhxzurlArr.length; k++) {
        $.message = ""
        fhxzurl = fhxzurlArr[k]
        $.index = k + 1;
        console.log(`\n开始【富豪小镇 ${$.index}】`)
        //await wzcc(); //汽车
        //await $.wait(Math.floor(Math.random()*100)+1000);       
        await dailyQuestd();
        await $.wait(Math.floor(Math.random() * 100) + 1000);
      }
    }
  }
})()
  .catch ((e) => $.logErr(e))
  .finally(() => $.done())


function fhxzck() {
  if ($request.url.indexOf("system_getGpvGameOptions") > -1) {
    const fhxzurl = $request.url
    id = fhxzurl.match(/token=(\S+)/)
    $.log(id)
    if (fhxzurl) $.setdata(fhxzurl, `fhxzurl${status}`)
    $.log(fhxzurl)
    $.msg($.name, "", '富豪小镇' + `${status}` + '数据获取成功！')
  }
}

function fhxzck() {
  if ($request.url.indexOf("system_getGpvGameOptions") > -1) {
    const fhxzurl = $request.url
    id = fhxzurl.match(/token=(\S+)/)
    $.log(id)
    if (fhxzurl) $.setdata(fhxzurl, `fhxzurl${status}`)
    $.log(fhxzurl)
    const fhxzhd = JSON.stringify($request.headers)
    if (fhxzhd) $.setdata(fhxzhd, `fhxzhd${status}`)
    $.log(fhxzhd)
    $.msg($.name, "", '富豪小镇' + `${status}` + '数据获取成功！')
  }
}
function dailyQuestd(timeout = 0) {
  return new Promise((resolve) => {
    id = fhxzurl.match(/Token=\S+&/)
    //$.log(id) 
    let url = {
      url: 'https://sunnytown.hyskgame.com/api/messages?access' + id + 'msgtype=market_getItemList',
      body: market_getItemList,
    }
    $.post(url, async(err, resp, data) => {
      try {
        data = JSON.parse(data);
        var lb = data
        for (let i = 0; i < 9; i++) {
            $.log(lb[0]["data"]["marketItemList"][i].title)
            $.log(lb[0]["data"]["marketItemList"][i].label)
            $.log(lb[0]["data"]["marketItemList"][i].progress)
            $.log(lb[0]["data"]["marketItemList"][i].targetNumber)
        }
      } catch (e) {
        $.logErr(e, resp);
      } finally {
        resolve()
      }
    }, timeout)
  })
}
