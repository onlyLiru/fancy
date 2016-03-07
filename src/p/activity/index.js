define(function(require, exports, module){
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var main = {
        init:function(){ 
            var self=this;
            
            $(".swiper-container").swiper();
            
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
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#J-category-box').html(Tcategory(res.data.categoryDTOList));
                    }else{
                        $('#J-category-box').html('暂无数据');
                        // alert(res.info.message);
                    }
                },
                beforeSend:function(){
                    $.showIndicator();
                },
                complete:function(){
                    $.hideIndicator();
                },
                error:function(){
                    // alert('error');
                }
            });
        }
	};
	main.init();
});