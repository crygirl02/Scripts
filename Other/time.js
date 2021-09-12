/*
今日时间

使用:
#每天 7:00-23:00 整点通知, 也可以自定义其他时间, 详情:https://community.nssurge.com/d/33-scripting

[Script]
cron "0 7-23 * * *" script-path=https://github.com/congcong0806/surge-list/raw/master/Script/time.js
 
作者:聪聪
聪聪 https://t.me/congcongx_bot
群组 https://t.me/YinxiangBiji
频道 https://t.me/YinxiangBiji_News
*/

Date.prototype.format = function(fmt) {
	var date = {
	        "M+": this.getMonth() + 1,
	        "d+": this.getDate(),
	        "h+": this.getHours(),
	        "m+": this.getMinutes(),
	        "s+": this.getSeconds(),
	        "q+": Math.floor((this.getMonth() + 3) / 3),
	        "S": this.getMilliseconds()
	    };
    if (/(y+)/i.test(fmt)) {
    	fmt = fmt.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(fmt)) {
        	fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return fmt;
};

const areas = [
               ["UTC", +0],["纽约", -5],["东京", +9],["巴黎", +2],["悉尼", +10]
           ]

time();

async function time() {
	var now = new Date(); 
	var content = "";
	var week = "北京 "+calcTime(+8)+" UTC+8 星期" + "日一二三四五六".charAt(now.getDay());
	content += week;
	for (var i in areas) {
		var u = valPlus(areas[i][1]);
        content += "\n"+areas[i][0]+" "+calcTime(u)+" UTC" + u;
    }
	
    $notification.post('今日时间', "", content);
    $done();
}

function calcTime(offset) { 
    var d = new Date(); 
    var utc = d.getTime() + (d.getTimezoneOffset() * 60000); 
    var nd = new Date(utc + (3600000 * offset)); 
    return nd.format("yyyy-MM-dd hh:mm:ss"); 
}

function valPlus(offset) { 
    if(offset == 0)
    	return "";
    else if (offset > 0)
    	return "+" + offset;
    else return offset;
}