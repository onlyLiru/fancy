define("/WEB-UED/fancy/dist/p/myActivity/category.handlebars",["alinw/handlebars/1.3.0/runtime"],function(require,exports,module){var Handlebars=require("alinw/handlebars/1.3.0/runtime"),template=Handlebars.template;module.exports=template(function(Handlebars,depth0,helpers,partials,data){function program1(depth0,data){var stack1,buffer="";return buffer+="\r\n	",stack1=helpers["with"].call(depth0,depth0&&depth0.object,{hash:{},inverse:self.noop,fn:self.program(2,program2,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+='\r\n	<div class="row">\r\n		',stack1=helpers.each.call(depth0,depth0&&depth0.list,{hash:{},inverse:self.noop,fn:self.program(4,program4,data),data:data}),(stack1||0===stack1)&&(buffer+=stack1),buffer+="\r\n	</div>\r\n"}function program2(depth0,data){var stack1,helper,buffer="";return buffer+='\r\n		<h4 class="bg-white borderB">',(helper=helpers.name)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.name,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</h4>\r\n	"}function program4(depth0,data){var stack1,helper,buffer="";return buffer+='\r\n			<div class="col-25 ac list-div" >\r\n				<a href="/goods/list.html?categoryId=',(helper=helpers.id)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.id,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+'" class="external block">\r\n					<img src="http://img.fancyedu.com/image1.jpg@1e_220w_220h_1c_0i_1o_90Q_1x.jpg" >\r\n				</a>\r\n				<span class="name">',(helper=helpers.name)?stack1=helper.call(depth0,{hash:{},data:data}):(helper=depth0&&depth0.name,stack1=typeof helper===functionType?helper.call(depth0,{hash:{},data:data}):helper),buffer+=escapeExpression(stack1)+"</span>\r\n			</div>\r\n		"}this.compilerInfo=[4,">= 1.0.0"],helpers=this.merge(helpers,Handlebars.helpers),data=data||{};var stack1,functionType="function",escapeExpression=this.escapeExpression,self=this,blockHelperMissing=helpers.blockHelperMissing;return stack1=typeof depth0===functionType?depth0.apply(depth0):depth0,stack1=blockHelperMissing.call(depth0,stack1,{hash:{},inverse:self.noop,fn:self.program(1,program1,data),data:data}),stack1||0===stack1?stack1:""})});