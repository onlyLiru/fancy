define("alinw/select/2.0.0/select",["arale/select/0.9.7/select","arale/overlay/1.1.1/overlay","$","arale/position/1.0.1/position","arale/iframe-shim/1.0.2/iframe-shim","arale/widget/1.1.1/widget","arale/base/1.1.1/base","arale/class/1.1.0/class","arale/events/1.1.0/events","arale/templatable/0.9.1/templatable","gallery/handlebars/1.0.2/handlebars","gallery/handlebars/1.0.2/runtime"],function(a,b,c){var d=a("arale/select/0.9.7/select"),e=a("$"),f=d.extend({attrs:{triggerTpl:'<div class="kuma-select"><a href="javascript:void(0);"><span data-role="trigger-content"></span><i class="kuma-icon kuma-icon-triangle-down" title="下拉"></i></a></div>',classPrefix:"kuma-select"},setup:function(){f.superclass.setup.call(this),this._initSelectWidth();var a=this.get("selectSource");a&&this.on("change",function(){a.trigger("change")})},_initSelectWidth:function(){var a=this.get("selectSource");if(a){var b=this.get("selectSource").outerWidth()||0;!this.get("width")&&b>0&&this.set("width",parseInt(b))}this.render()}});f.init=function(a){e(a).each(function(){new f({trigger:this})})},c.exports=f});
