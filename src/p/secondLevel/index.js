define(function(require, exports, module){
        
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var Tcategory=require("./category.handlebars");
    var main = {
        isFirstLoad:true,
        init:function(){ 
            var self=this;
            self.parentId=G._getUrlParam('parentId');
            /*获取类目*/
            var titBox=$('h1.title');
            if(self.parentId=='10000000'){
                titBox.text('进口图书');
            }else if(self.parentId=='10000001'){
                titBox.text('幼儿用品');
            }else{
                titBox.text('亲子活动');
            }
            self._getCategory();
            
            $(".swiper-container").swiper();
            /*获取登录信息*//*购物车数量*/
            G._getLoginUser(G._getCartCount);
            
            self._pullToFresh();
        },
        _pullToFresh:function(){
            var self=this;
            // 添加'refresh'监听器
            $(document).on('refresh', '.pull-to-refresh-content',function(e) {
                self.isPullToFresh=true;
                self._getCategory();
            });
            
        },
        _getCategory:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/category/listCategoryMerge',
                data:{
                    topLevelId:self.parentId
                },
                success:function(res){
                    if(res.info.ok==true){
                        $('#J-category-box').html(Tcategory(res.data.categoryDTOList));

                        if(self.isPullToFresh){
                            // 加载完毕需要重置
                            $.pullToRefreshDone('.pull-to-refresh-content');
                        };
                        
                        if(self.isFirstLoad){
                            $.init();
                            self.isFirstLoad=false;
                        };
                    }else{
                        $('#J-category-box').html('暂无数据');
                        // alert(res.info.message);
                    }
                },
                error:function(){
                    // alert('error');
                },
                complete:function(){
                    
                }
            });
        }
	};
	main.init();
});