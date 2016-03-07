define(function(require, exports, module){
        require('../../c/js/zepto.lazyload');
    var G=require('../../c/js/globale');
    var Tlist=require("./list.handlebars"); 
    var main = {
        curPage:1,
        totalPage:2,
        load:true,
        isFirstLoad:true,//只有第一次进来才做init操作
        init:function(){ 
            var self=this;
            self.categoryId=G._getUrlParam('categoryId');
            self.brandId=G._getUrlParam('brandId');
            self.from=$('#J-from').val();

            self._page();
            /*获取登录信息*//*购物车数量*/
            G._getLoginUser(G._getCartCount);

            self._pullToFresh();
        },
        _pullToFresh:function(){
            var self=this;
            // 添加'refresh'监听器
            $(document).on('refresh', '.pull-to-refresh-content',function(e) {
                self.curPage=1;
                self.isPullToFresh=true;
                self._getList();
            });
            
        },
        _page:function(){
            var self=this;

            self._getList();

            // 注册'infinite'事件处理函数
            $(document).on('infinite', '.infinite-scroll',function() {
                // 如果正在加载，或者最后一页了则退出
                if (self.curPage > self.totalPage || self.loading) {
                    return;
                }else{
                    self.isPullToFresh=false;
                    self._getList();
                }
            });
        },
        _getList:function(){
            var self=this;
            /*取商品数据*/
            var data={
                    curPage:self.curPage,
                    pageSize:10,
                    categoryId:self.categoryId
                };
            var url='/goods/listGoodsPage.json';
            /*取品牌数据*/
            if(self.brandId){
                url='/goods/listGoodsPageByBrandId.json';
                data={
                    curPage:self.curPage,
                    pageSize:10,
                    brandId:self.brandId
                };
            };
            $.ajax({
                type:'get',
                cach:false,
                url:url,
                data:data,
                success:function(res){
                    if(res=='noLogin' && $('J-from').val()=='fsl'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        // 更新最后加载的序号
                        if(res.data.page){
                            self.curPage=res.data.page.curPage+1;
                            self.totalPage=res.data.page.totalPage;
                            if(self.isPullToFresh){//下拉刷新
                                $('#J-list').html(Tlist(res.data));
                                // 加载完毕需要重置
                                $.pullToRefreshDone('.pull-to-refresh-content');
                            }else{//无限加载
                                $('#J-list').append(Tlist(res.data));
                            };

                            $.refreshScroller();

                            if(self.isFirstLoad){
                                $.init();
                                self.isFirstLoad=false;
                            };

                            /*图片延迟加载*/
                            $(".content img.lazy").lazyload({
                                event:"sporty",
                                threshold : 100
                            });

                            var timeout = setTimeout(function() {
                                $("img.lazy").trigger("sporty")
                            }, 100);
                        }else{
                            $('#J-list').html('<p class="pd10">暂无数据</p>');
                        }

                        $('a[_href]').off().on('click',function(){
                            var href=$(this).attr('_href');
                            if(self.from=='fsl'){
                                href='/'+self.from+href;
                            }else{
                                href=href;
                            }
                            location.href=href;
                        })
                    };
                },
                beforeSend:function(){
                    self.loading=true;
                    // $.showIndicator();
                    $('.infinite-scroll-preloader').show();
                },
                complete:function(){
                    self.loading=false;
                    // $.hideIndicator();
                    $('.infinite-scroll-preloader').hide();
                },
                error:function(){
                    // alert('error');
                }
            });
        }
	};
	main.init();
});