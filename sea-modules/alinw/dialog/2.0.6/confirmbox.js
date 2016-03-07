define("alinw/dialog/2.0.6/confirmbox",["$","./dialog","arale/overlay/1.1.4/overlay","arale/position/1.0.1/position","arale/iframe-shim/1.0.2/iframe-shim","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","arale/overlay/1.1.4/mask","arale/templatable/0.9.2/templatable","gallery/handlebars/1.0.2/handlebars","./dialog.handlebars","./confirmbox.handlebars"],function(a,b,c){var d=a("$"),e=a("./dialog"),f=a("./confirmbox.handlebars"),g=e.extend({attrs:{title:"标题",confirmTpl:'<a class="kuma-button kuma-button-sblue" href="javascript:;">确&nbsp;&nbsp;定</a>',cancelTpl:'<a class="kuma-button kuma-button-swhite" href="javascript:;">取&nbsp;&nbsp;消</a>',message:"默认内容"},setup:function(){g.superclass.setup.call(this);var a={classPrefix:this.get("classPrefix"),message:this.get("message"),title:this.get("title"),timeout:this.get("timeout"),iconType:this.get("iconType"),msgTileTpl:this.get("msgTileTpl"),confirmTpl:this.get("confirmTpl"),cancelTpl:this.get("cancelTpl"),hasFoot:this.get("confirmTpl")||this.get("cancelTpl")};this.set("content",f(a))},events:{"mousedown [data-role=confirm]":function(a){a.preventDefault(),this.trigger("confirm")},"mousedown [data-role=cancel]":function(a){a.preventDefault(),this.trigger("cancel"),this.hide()}},_onChangeMessage:function(a){this.$("[data-role=message]").html(a)},_onChangeTimeout:function(a){this.$("[data-role=timeout]").html(a)},_onChangeIconType:function(a){this.$("[data-role=iconType]").html(a)},_onChangeMsgTile:function(a){this.$("[data-role=msgTile]").html(a)},_onChangeTitle:function(a){this.$("[data-role=title]").html(a)},_onChangeConfirmTpl:function(a){this.$("[data-role=confirm]").html(a)},_onChangeCancelTpl:function(a){this.$("[data-role=cancel]").html(a)}});g.iconView=function(a,b,c){var e={message:a,iconType:c.iconType,msgTileTpl:c.msgTile,title:c.title?c.title:"",afterShow:function(){var a=this;if("number"==typeof c.timeout&&c.timeout){var e=Math.round(c.timeout/1e3),f=d(".kuma-dialog-second-view");f.html(e);var g=setInterval(function(){e>1?(e-=1,f.html(e)):clearInterval(g)},1e3);setTimeout(function(){d.isFunction(b)&&b.apply(a)===!1||a.hide()},c.timeout?c.timeout:2e3)}},afterRender:function(){"boolean"==typeof c.simple&&c.simple&&(this.$("[data-role=message]").css({"margin-bottom":"0"}),this.$(".kuma-dialog-container").css({"padding-bottom":"15px"}))},onConfirm:function(){d.isFunction(b)&&b.apply(this)===!1||this.hide()}};return new g(d.extend(null,e,c)).show().after("hide",function(){this.destroy()})},g.alert=function(a,b,c){var e={message:a,title:"",cancelTpl:"",onConfirm:function(){d.isFunction(b)&&b.apply(this)===!1||this.hide()}};return new g(d.extend(null,e,c)).show().after("hide",function(){this.destroy()})},g.confirm=function(a,b,c,e,f){"object"!=typeof e||f||(f=e);var h={message:a,title:b||"确认框",onConfirm:function(){d.isFunction(c)&&c.apply(this)===!1||this.hide()},onCancel:function(){d.isFunction(e)&&e.apply(this)===!1||this.hide()}};return new g(d.extend(null,h,f)).show().after("hide",function(){this.destroy()})},g.show=function(a,b,c){var e={message:a,title:"",confirmTpl:!1,cancelTpl:!1};return new g(d.extend(null,e,c)).show().before("hide",function(){b&&b()}).after("hide",function(){this.destroy()})},g.tipConfirm=function(a,b,c){var e={message:a,title:""};return new g(d.extend(null,e,c)).show().before("hide",function(){})},c.exports=g,c.exports.outerBoxClass="alinw-dialog-2_0_6"}),define("alinw/dialog/2.0.6/dialog",["$","arale/overlay/1.1.4/overlay","arale/position/1.0.1/position","arale/iframe-shim/1.0.2/iframe-shim","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","arale/overlay/1.1.4/mask","arale/templatable/0.9.2/templatable","gallery/handlebars/1.0.2/handlebars"],function(a,b,c){function d(a){null==a.attr("tabindex")&&a.attr("tabindex","-1")}function e(a){var b=a[0].contentWindow.document;return b.body.scrollHeight&&b.documentElement.scrollHeight?Math.min(b.body.scrollHeight,b.documentElement.scrollHeight):b.documentElement.scrollHeight?b.documentElement.scrollHeight:b.body.scrollHeight?b.body.scrollHeight:void 0}var f=a("$"),g=a("arale/overlay/1.1.4/overlay"),h=a("arale/overlay/1.1.4/mask"),i=a("arale/events/1.1.0/events"),j=a("arale/templatable/0.9.2/templatable"),k=g.extend({Implements:j,attrs:{template:a("alinw/dialog/2.0.6/dialog.handlebars"),trigger:{value:null,getter:function(a){return f(a)}},classPrefix:"kuma-dialog",content:{value:null,setter:function(a){return/^(https?:\/\/|\/|\.\/|\.\.\/)/.test(a)&&(this._type="iframe"),a}},hasMask:!0,closeTpl:"&#xe610;",width:500,height:null,initialHeight:300,effect:"none",zIndex:999,autoFit:!0,align:{value:{selfXY:["50%","50%"],baseXY:["50%","50%"]},getter:function(a){return this.element.height()>f(window).height()?{selfXY:["50%","0"],baseXY:["50%","0"]}:a}}},parseElement:function(){this.set("model",{classPrefix:this.get("classPrefix"),closeTpl:this.get("closeTpl")}),k.superclass.parseElement.call(this),this.contentElement=this.$("[data-role=content]"),this.contentElement.css({height:"100%",zoom:1}),this.$("[data-role=close]").hide()},events:{"click [data-role=close]":function(a){a.preventDefault(),this.hide()}},show:function(){return"iframe"===this._type&&(!this.get("height")&&this.contentElement.css("height",this.get("initialHeight")),this._showIframe()),k.superclass.show.call(this),this},hide:function(){return"iframe"===this._type&&this.iframe&&(this.iframe.attr({src:"javascript:'';"}),this.iframe.remove(),this.iframe=null),k.superclass.hide.call(this),clearInterval(this._interval),delete this._interval,this},destroy:function(){return this.element.remove(),this._hideMask(),clearInterval(this._interval),k.superclass.destroy.call(this)},setup:function(){k.superclass.setup.call(this),this._setupTrigger(),this._setupMask(),this._setupKeyEvents(),this._setupFocus(),d(this.element),d(this.get("trigger")),this.activeTrigger=this.get("trigger").eq(0)},_onRenderContent:function(a){if("iframe"!==this._type){var b;try{b=f(a)}catch(c){b=[]}b[0]?this.contentElement.empty().append(b):this.contentElement.empty().html(a),this._setPosition()}},_onRenderCloseTpl:function(a){""===a?this.$("[data-role=close]").html(a).hide():this.$("[data-role=close]").html(a).show()},_onRenderVisible:function(a){a?"fade"===this.get("effect")?this.element.fadeIn(300):this.element.show():this.element.hide()},_setupTrigger:function(){this.delegateEvents(this.get("trigger"),"click",function(a){a.preventDefault(),this.activeTrigger=f(a.currentTarget),this.show()})},_setupMask:function(){var a=this;h._dialogs=h._dialogs||[],this.after("show",function(){if(this.get("hasMask")){h.set("opacity",.8).set("backgroundColor","#fff").set("zIndex",a.get("zIndex")).show(),h.element.insertBefore(a.element);for(var b=!1,c=0;c<h._dialogs.length;c++)h._dialogs[c]===a&&(b=!0);b||h._dialogs.push(a)}}),this.after("hide",this._hideMask)},_hideMask:function(){if(this.get("hasMask")&&h._dialogs)for(var a=h._dialogs.length,b=0;a>b;b++)if(h._dialogs[b]===this)if(h._dialogs.splice(b,1),0===h._dialogs.length)h.hide();else if(b===a-1){var c=h._dialogs[h._dialogs.length-1];h.set("zIndex",c.get("zIndex")),h.element.insertBefore(c.element)}},_setupFocus:function(){this.after("show",function(){this.element.focus()}),this.after("hide",function(){this.activeTrigger&&this.activeTrigger.focus()})},_setupKeyEvents:function(){},_showIframe:function(){var a=this;this.iframe||this._createIframe(),this.iframe.attr({src:this._fixUrl(),name:"dialog-iframe"+(new Date).getTime()}),this.iframe.one("load",function(){a.get("visible")&&(a.get("autoFit")&&(clearInterval(a._interval),a._interval=setInterval(function(){a._syncHeight()},300)),a._syncHeight(),a._setPosition(),a.trigger("complete:show"))})},_fixUrl:function(){var a=this.get("content").match(/([^?#]*)(\?[^#]*)?(#.*)?/);return a.shift(),a[1]=(a[1]&&"?"!==a[1]?a[1]+"&":"?")+"t="+(new Date).getTime(),a.join("")},_createIframe:function(){var a=this;this.iframe=f("<iframe>",{src:"javascript:'';",scrolling:"no",frameborder:"no",allowTransparency:"true",css:{border:"none",width:"100%",display:"block",height:"100%",overflow:"hidden"}}).appendTo(this.contentElement),i.mixTo(this.iframe[0]),this.iframe[0].on("close",function(){a.hide()})},_syncHeight:function(){var a;if(this.get("height"))clearInterval(this._interval),delete this._interval;else{try{this._errCount=0,a=e(this.iframe)+"px"}catch(b){this._errCount=(this._errCount||0)+1,this._errCount>=6&&(a=this.get("initialHeight"),clearInterval(this._interval),delete this._interval)}this.contentElement.css("height",a),this.element[0].className=this.element[0].className}}});c.exports=k,c.exports.outerBoxClass="alinw-dialog-2_0_6"}),define("alinw/dialog/2.0.6/dialog.handlebars",["gallery/handlebars/1.0.2/runtime"],function(a,b,c){var d=a("gallery/handlebars/1.0.2/runtime"),e=d.template;c.exports=e(function(a,b,c,d,e){this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var f in a.helpers)c[f]=c[f]||a.helpers[f];e=e||{};var g,h="",i="function",j=this.escapeExpression;return h+='<div class="',(g=c.classPrefix)?g=g.call(b,{hash:{},data:e}):(g=b.classPrefix,g=typeof g===i?g.apply(b):g),h+=j(g)+'">\n    <a class="',(g=c.classPrefix)?g=g.call(b,{hash:{},data:e}):(g=b.classPrefix,g=typeof g===i?g.apply(b):g),h+=j(g)+'-close kuma-icon" title="Close" href="javascript:;" data-role="close"></a>\n\n    <div class="',(g=c.classPrefix)?g=g.call(b,{hash:{},data:e}):(g=b.classPrefix,g=typeof g===i?g.apply(b):g),h+=j(g)+'-content" data-role="content"></div>\n</div>'})}),define("alinw/dialog/2.0.6/confirmbox.handlebars",["gallery/handlebars/1.0.2/runtime"],function(a,b,c){var d=a("gallery/handlebars/1.0.2/runtime"),e=d.template;c.exports=e(function(a,b,c,d,e){function f(a,b){var d,e="";return e+='\n<div class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-title" data-role="title">',(d=c.title)?d=d.call(a,{hash:{},data:b}):(d=a.title,d=typeof d===q?d.apply(a):d),(d||0===d)&&(e+=d),e+="</div>\n"}function g(a,b){var d,e="";return e+='\n    <div class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-icon-view" data-role="">\n        ',d=c["if"].call(a,a.iconType,{hash:{},inverse:s.noop,fn:s.program(4,h,b),data:b}),(d||0===d)&&(e+=d),e+='\n        <span class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-tile" data-role="msgTile">\n            ',(d=c.msgTileTpl)?d=d.call(a,{hash:{},data:b}):(d=a.msgTileTpl,d=typeof d===q?d.apply(a):d),(d||0===d)&&(e+=d),e+="\n        </span>\n    </div>\n    "}function h(a,b){var d,e="";return e+=' \n            <i class="kuma-icon kuma-icon-',(d=c.iconType)?d=d.call(a,{hash:{},data:b}):(d=a.iconType,d=typeof d===q?d.apply(a):d),e+=r(d)+'" ></i>\n        '}function i(){return" icon-space "}function j(a,b){var d,e="";return e+='\n    <div class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+"-operation ",d=c["if"].call(a,a.iconType,{hash:{},inverse:s.noop,fn:s.program(6,i,b),data:b}),(d||0===d)&&(e+=d),e+='" data-role="foot">\n        ',d=c["if"].call(a,a.confirmTpl,{hash:{},inverse:s.noop,fn:s.program(9,k,b),data:b}),(d||0===d)&&(e+=d),e+="\n        ",d=c["if"].call(a,a.cancelTpl,{hash:{},inverse:s.noop,fn:s.program(11,l,b),data:b}),(d||0===d)&&(e+=d),e+="\n        ",d=c["if"].call(a,a.autoHide,{hash:{},inverse:s.noop,fn:s.program(13,m,b),data:b}),(d||0===d)&&(e+=d),e+="\n    </div>\n    "}function k(a,b){var d,e="";return e+='\n        <div class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-confirm" data-role="confirm">\n            ',(d=c.confirmTpl)?d=d.call(a,{hash:{},data:b}):(d=a.confirmTpl,d=typeof d===q?d.apply(a):d),(d||0===d)&&(e+=d),e+="\n        </div>\n        "}function l(a,b){var d,e="";return e+='\n        <div class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-cancel" data-role="cancel">\n            ',(d=c.cancelTpl)?d=d.call(a,{hash:{},data:b}):(d=a.cancelTpl,d=typeof d===q?d.apply(a):d),(d||0===d)&&(e+=d),e+="\n        </div>\n        "}function m(a,b){var d,e="";return e+='\n        <div class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-auto-close">\n            <span class="',(d=c.classPrefix)?d=d.call(a,{hash:{},data:b}):(d=a.classPrefix,d=typeof d===q?d.apply(a):d),e+=r(d)+'-second-view"></span>秒后将自动关闭.\n        </div>\n        '}this.compilerInfo=[3,">= 1.0.0-rc.4"],c=c||{};for(var n in a.helpers)c[n]=c[n]||a.helpers[n];e=e||{};var o,p="",q="function",r=this.escapeExpression,s=this;return o=c["if"].call(b,b.title,{hash:{},inverse:s.noop,fn:s.program(1,f,e),data:e}),(o||0===o)&&(p+=o),p+='\n<div class="',(o=c.classPrefix)?o=o.call(b,{hash:{},data:e}):(o=b.classPrefix,o=typeof o===q?o.apply(b):o),p+=r(o)+'-container">\n    ',o=c["if"].call(b,b.msgTileTpl,{hash:{},inverse:s.noop,fn:s.program(3,g,e),data:e}),(o||0===o)&&(p+=o),p+='\n    <div class="',(o=c.classPrefix)?o=o.call(b,{hash:{},data:e}):(o=b.classPrefix,o=typeof o===q?o.apply(b):o),p+=r(o)+"-message ",o=c["if"].call(b,b.iconType,{hash:{},inverse:s.noop,fn:s.program(6,i,e),data:e}),(o||0===o)&&(p+=o),p+='" data-role="message">',(o=c.message)?o=o.call(b,{hash:{},data:e}):(o=b.message,o=typeof o===q?o.apply(b):o),(o||0===o)&&(p+=o),p+="</div>\n    ",o=c["if"].call(b,b.hasFoot,{hash:{},inverse:s.noop,fn:s.program(8,j,e),data:e}),(o||0===o)&&(p+=o),p+="\n</div>"})});
