define("/WEB-UED/fancy/dist/p/hotActivity/index",["/WEB-UED/fancy/dist/c/js/globale","/WEB-UED/fancy/dist/c/js/registerHelper","handlebars","/WEB-UED/fancy/dist/p/hotActivity/page.handlebars"],function(require,exports,module){var G=require("/WEB-UED/fancy/dist/c/js/globale");require("/WEB-UED/fancy/dist/c/js/registerHelper");var Tpage=require("/WEB-UED/fancy/dist/p/hotActivity/page.handlebars"),main={init:function(){var self=main;self.from=$("#J-from").val(),self._getData()},_getData:function(){var self=this;$.ajax({type:"get",cach:!1,url:"/activity/getHotActivity.json",success:function(res){return"noLogin"==res?void(location.href="/login.do?target="+location.href):void(1==res.info.ok&&($(".swiper-wrapper").html(Tpage(res.data.map)),$(".swiper-container").swiper({effect:"coverflow",loop:!0,autoHeight:!0,autoplay:5e3}),$("a[_href]").off().on("click",function(){var href=$(this).attr("_href");href="fsl"==self.from?"/"+self.from+href:href,location.href=href})))},beforeSend:function(){},complete:function(){},error:function(){}})}};G._getLoginUser(main.init)}),define("/WEB-UED/fancy/dist/c/js/globale",[],function(require,exports,module){var main={init:function(){var self=this;self._back()},_back:function(){var self=this;self._navigator().mobileWebKit&&$(".J-back").off().on("click",function(e){e.stopPropagation(),e.preventDefault(),window.history.go(-1)})},_getUrlParam:function(name){var reg=new RegExp("(^|&)"+name+"=([^&]*)(&|$)"),r=window.location.search.substr(1).match(reg);return null!=r?unescape(r[2]):null},_getLoginUser:function(callback){var loginUser;$.ajax({type:"get",cache:!1,url:"/login/getLoginUser.do",success:function(res){1==res.info.ok?(loginUser=res.data.loginUser,window.fancyLoginUser=loginUser,callback&&callback(loginUser)):alert(res.info.message)},beforeSend:function(){},complete:function(){},error:function(){}})},_getCartCount:function(userMes){userMes=userMes||window.fancyLoginUser,userMes&&$.ajax({type:"get",cache:!1,url:"/cart/countCart.json",success:function(res){return"noLogin"==res?void(location.href="/login.do?target="+location.href):void(1==res.info.ok?res.data.count>0&&$("#J-cart-count").show().html(res.data.count):alert(res.info.message))},beforeSend:function(){$.showIndicator()},complete:function(){$.hideIndicator()},error:function(){}})},_editCount:function(d){var box=$(d.box),defaultCount=d.defaultCount||1;box.html('<p class="edit-count color-gray">                <i class="iconfont J-cut">&#xe607;</i>                <span class="J-number">'+defaultCount+'</span>                <i class="iconfont J-add">&#xe608;</i>            </p>'),$(".J-cut").bind("click",function(){var curNum=parseInt($(this).parent().find(".J-number").text());1>=curNum||$(this).parent().find(".J-number").text(curNum-1)}),$(".J-add").bind("click",function(){var curNum=parseInt($(this).parent().find(".J-number").text());$(this).parent().find(".J-number").text(curNum+1)})},_navigator:function(){var u=navigator.userAgent;return{isWeixin:"micromessenger"==u.toLowerCase().match(/MicroMessenger/i),trident:u.indexOf("Trident")>-1,presto:u.indexOf("Presto")>-1,webKit:u.indexOf("AppleWebKit")>-1,gecko:u.indexOf("Gecko")>-1&&-1==u.indexOf("KHTML"),deskWebkit:-1==u.indexOf("Android")&&-1==u.indexOf("Mobile"),mobileWebKit:!!u.match(/AppleWebKit.*Mobile.*/)||!!u.match(/AppleWebKit/)||!!u.match(/.*Mobile.*/),ios:!!u.match(/(i[^;]+\;(U;)? CPU.+Mac OS X)/),android:u.indexOf("Android")>-1||u.indexOf("Linux")>-1,iPhone:u.indexOf("iPhone")>-1&&u.indexOf("Mac")>-1,iPad:u.indexOf("iPad")>-1,webApp:-1==u.indexOf("Safari")}},connectWebViewJavascriptBridge:function(callback){window.WebViewJavascriptBridge?callback(WebViewJavascriptBridge):document.addEventListener("WebViewJavascriptBridgeReady",function(){callback(WebViewJavascriptBridge)},!1)},_scroll:function(obj){var self=this;obj||(obj=$(".content")),$.config={showPageLoadingIndicator:!0},self._navigator().ios?self.scroller={type:"js"}:self.scroller={type:"auto"},obj.scroller(self.scroller)}};module.exports=main,main.init()}),define("/WEB-UED/fancy/dist/c/js/registerHelper",["handlebars"],function(require,exports,module){var Handlebars=require("handlebars");Handlebars.registerHelper("ifCond",function(v1,operator,v2,options){switch(operator){case"!=":return v1!=v2?options.fn(this):options.inverse(this);case"==":return v1==v2?options.fn(this):options.inverse(this);case"===":return v1===v2?options.fn(this):options.inverse(this);case"<":return v2>v1?options.fn(this):options.inverse(this);case"<=":return v2>=v1?options.fn(this):options.inverse(this);case">":return v1>v2?options.fn(this):options.inverse(this);case">=":return v1>=v2?options.fn(this):options.inverse(this);case"&&":return v1&&v2?options.fn(this):options.inverse(this);case"||":return v1||v2?options.fn(this):options.inverse(this);default:return options.inverse(this)}})}),define("/WEB-UED/fancy/dist/p/hotActivity/page.handlebars",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime"),template=Handlebars.template;module.exports=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,buffer="";return buffer+="\r\n	",stack1=helpers.each.call(depth0,depth0&&depth0.imgList,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\r\n"}function program2(depth0,data){var stack1,helper,buffer="";return buffer+='\r\n	    <div class="swiper-slide">\r\n	        <a external _href="/activity/activityDetail.html?id=',(helper=helpers.activityId)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.activityId,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" class="external block">\r\n	            <img src="',(helper=helpers.imageUrl)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.imageUrl,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" >\r\n	        </a>\r\n	    </div>\r\n	'}function program4(depth0,data){return'\r\n	<div class="no-data">\r\n	    <p>暂无数据</p>\r\n	    <i class="iconfont">&#xe688;</i>\r\n	</div>\r\n'}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,buffer="",functionType="function",escapeExpression=this.escapeExpression,self=this;return stack1=helpers["if"].call(depth0,depth0&&depth0.CartVOList,{hash:{},inverse:self.program(4,program4,data),fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\r\n"})});