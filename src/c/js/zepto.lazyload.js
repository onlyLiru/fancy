
define(function(require, exports, module){
/*
 * Lazy Load - jQuery plugin for lazy loading images
 *
 * Copyright (c) 2007-2013 Mika Tuupola
 *
 * Licensed under the MIT license:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Project home:
 *   http://www.appelsiini.net/projects/lazyload
 *
 * Version:  1.8.5
 *
 */
!function(a,b,c,d){var e=a(b);a.fn.lazyload=function(c){function i(){var b=0;f.each(function(){var c=a(this);if(!h.skip_invisible||"none"!==c.css("display"))if(a.abovethetop(this,h)||a.leftofbegin(this,h));else if(a.belowthefold(this,h)||a.rightoffold(this,h)){if(++b>h.failure_limit)return!1}else c.trigger("appear"),b=0})}var g,f=this,h={threshold:0,failure_limit:0,event:"scroll",effect:"show",container:b,data_attribute:"original",skip_invisible:!0,appear:null,load:null};return c&&(d!==c.failurelimit&&(c.failure_limit=c.failurelimit,delete c.failurelimit),d!==c.effectspeed&&(c.effect_speed=c.effectspeed,delete c.effectspeed),a.extend(h,c)),g=h.container===d||h.container===b?e:a(h.container),0===h.event.indexOf("scroll")&&g.on(h.event,function(){return i()}),this.each(function(){var b=this,c=a(b);b.loaded=!1,c.one("appear",function(){if(!this.loaded){if(h.appear){var d=f.length;h.appear.call(b,d,h)}a("<img />").on("load",function(){var d,e;c.hide().attr("src",c.data(h.data_attribute))[h.effect](h.effect_speed),b.loaded=!0,d=a.grep(f,function(a){return!a.loaded}),f=a(d),h.load&&(e=f.length,h.load.call(b,e,h))}).attr("src",c.data(h.data_attribute))}}),0!==h.event.indexOf("scroll")&&c.on(h.event,function(){b.loaded||c.trigger("appear")})}),e.on("resize",function(){i()}),/iphone|ipod|ipad.*os 5/gi.test(navigator.appVersion)&&e.on("pageshow",function(b){b=b.originalEvent||b,b.persisted&&f.each(function(){a(this).trigger("appear")})}),a(b).on("load",function(){i()}),this},a.belowthefold=function(c,f){var g;return g=f.container===d||f.container===b?e.height()+e.scrollTop():a(f.container).offset().top+a(f.container).height(),g<=a(c).offset().top-f.threshold},a.rightoffold=function(c,f){var g;return g=f.container===d||f.container===b?e.width()+e[0].scrollX:a(f.container).offset().left+a(f.container).width(),g<=a(c).offset().left-f.threshold},a.abovethetop=function(c,f){var g;return g=f.container===d||f.container===b?e.scrollTop():a(f.container).offset().top,g>=a(c).offset().top+f.threshold+a(c).height()},a.leftofbegin=function(c,f){var g;return g=f.container===d||f.container===b?e[0].scrollX:a(f.container).offset().left,g>=a(c).offset().left+f.threshold+a(c).width()},a.inviewport=function(b,c){return!(a.rightoffold(b,c)||a.leftofbegin(b,c)||a.belowthefold(b,c)||a.abovethetop(b,c))},a.extend(a.fn,{"below-the-fold":function(b){return a.belowthefold(b,{threshold:0})},"above-the-top":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-screen":function(b){return a.rightoffold(b,{threshold:0})},"left-of-screen":function(b){return!a.rightoffold(b,{threshold:0})},"in-viewport":function(b){return a.inviewport(b,{threshold:0})},"above-the-fold":function(b){return!a.belowthefold(b,{threshold:0})},"right-of-fold":function(b){return a.rightoffold(b,{threshold:0})},"left-of-fold":function(b){return!a.rightoffold(b,{threshold:0})}})}($,window,document);
});