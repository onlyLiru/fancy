define("/WEB-UED/fancy/dist/p/activityDetail/list.handlebars",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime"),template=Handlebars.template;module.exports=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,helper,buffer="";return buffer+='\r\n	<img class="lazy" data-original="',(helper=helpers.imageUrl)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.imageUrl,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" >\r\n'}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;return stack1=typeof depth0===functionType?depth0.apply(depth0):depth0,stack1=blockHelperMissing.call(depth0,stack1,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),stack1||0===stack1?stack1:""})});