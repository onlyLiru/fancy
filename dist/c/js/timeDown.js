define("/WEB-UED/fancy/dist/c/js/timeDown",[],function(require,exports,module){var main={init:function(year,month,day,divname){var self=this,interval=1e3;window.setInterval(function(){self.ShowCountDown(year,month,day,divname)},interval)},ShowCountDown:function(year,month,day,divname){var now=new Date,endDate=new Date(year,month-1,day),leftTime=endDate.getTime()-now.getTime(),leftsecond=parseInt(leftTime/1e3),day1=Math.floor(leftsecond/86400),hour=Math.floor((leftsecond-24*day1*60*60)/3600),minute=Math.floor((leftsecond-24*day1*60*60-3600*hour)/60),second=Math.floor(leftsecond-24*day1*60*60-3600*hour-60*minute),cc=document.getElementById(divname);now>endDate||(cc.innerHTML="距离还有:<span>"+day1+"</span>天<span>"+hour+"</span>时<span>"+minute+"</span>分<span>"+second+"</span>秒")}};module.exports=main});