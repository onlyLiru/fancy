define("/WEB-UED/fancy/dist/p/orderDetail/express.handlebars",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime"),template=Handlebars.template;module.exports=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,helper,options,buffer="";return buffer+="\n			",helper=helpers.ifCond||depth0&&depth0.ifCond,options={hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data},stack1=helper?helper.call(depth0,null==data||data===!1?data:data.index,"==",0,options):helperMissing.call(depth0,"ifCond",null==data||data===!1?data:data.index,"==",0,options),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\n			<li class="mb10">',(helper=helpers.AcceptStation)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.AcceptStation,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'<br>\n				<span class="color-gray fz12">',(helper=helpers.AcceptTime)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.AcceptTime,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</span>\n				<i class="iconfont color-gray">&#xe620;</i>\n			</li>\n		'}function program2(depth0,data){var stack1,helper,buffer="";return buffer+='\n				<li class="mb10 color-orange">',(helper=helpers.AcceptStation)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.AcceptStation,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'<br>\n					<span class="color-gray fz12">',(helper=helpers.AcceptTime)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.AcceptTime,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</span>\n					<i class="iconfont">&#xe620;</i>\n				</li>\n			'}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,helper,buffer="",functionType="function",escapeExpression=this.escapeExpression,self=this,helperMissing=helpers.helperMissing;return buffer+='<ul class="pd10">\n    <li>物流公司：',(helper=helpers.expressCode)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.expressCode,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</li>\n    <li>物流单号：",(helper=helpers.expressNo)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.expressNo,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'</li>\n</ul>\n<div class="bg-white pd10 fz12">\n	<ul class="express-ul">\n		',stack1=helpers.each.call(depth0,depth0&&depth0.trace,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\n	</ul>\n</div>"})});