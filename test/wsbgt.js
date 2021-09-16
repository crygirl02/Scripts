const $ = new Env('我是包工头');
let status;
status = (status = ($.getval("wsbgtstatus") || "1")) > 1 ? `${status}` : ""; // 账号扩展字符
!(async()=>){
  GetCookie()
  } else {
  }

function GetCookie(){
  if($request.url.match("cn.game.77hd.com")){
    bodyval=$request.body
    if(bodyval.indexOf("appid")>-1){
      $.setdata(bodyval,'wsbgtbody')
      $.log(`${$.name}尝试获取body:${bodyval}`)
    }
  }
}
