define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var main = {
        init:function(){
            var self=main;
            self._event();
            if(!window.sessionStorage.getDialog){
                window.sessionStorage.getDialog='true';
            };
            if(window.sessionStorage.getDialog=='true'){
                self._getImg();
            };

            function doUpload() {  
                 var formData = new FormData($( "#uploadForm" )[0]); 
                 $.ajax({  
                      url: '/upload/uploadUserHeaderImage.json' ,  
                      type: 'POST',  
                      data: formData,  
                      async: false,  
                      cache: false,  
                      contentType: false,  
                      processData: false,  
                      success: function (returndata) {  
                          alert(returndata);  
                      },  
                      error: function (returndata) {  
                          alert(returndata);  
                      }  
                 });  
            }  

            $('#file').on('change',doUpload)

        },
        _getImg:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/home/getGuidingLayer.do',
                success:function(res){
                    
                    if(res.info.ok==true){
                        if(res.data.imgList && res.data.imgList.length){
                            var html=[];
                            $.each(res.data.imgList,function(i,item){
                                html.push('<div class="swiper-slide"><a href="'+ item.goodsUrl +'" class="external auto-img"><img src="'+ item.imageUrl +'"></a></div>');
                            });
                            
                            self._dialog(html.join(''));
                            window.sessionStorage.getDialog='false';
                        }
                    }else{
                        alert(res.info.message);
                    }
                },
                beforeSend:function(){
                    // $.showIndicator();
                },
                complete:function(){
                    // $.hideIndicator();
                },
                error:function(){
                    // alert('error');
                }
            });
        },
        _dialog:function(data){
            var modal = $.modal({
              afterText:  '<div class="swiper-container">'+
                            '<div class="swiper-pagination"></div>'+
                            '<div class="swiper-wrapper">'+ data +'</div>'+
                          '</div>',
              buttons: [
                {
                  text: '<i class="iconfont fz26 color-white">&#xe681;</i>'
                }
              ]
            })
            $.swiper($(modal).find('.swiper-container'), {
                pagination: '.swiper-pagination',
                effect : 'coverflow',
                loop : true,
                autoHeight: true,
                autoplay: 3000
            });
        },
        _event:function(){
            var self=this;
            /*如果是在我们app里面打开则去掉首页的关闭按钮,如果不是在webview里面打开也去掉*/
            if(window.fancyLoginUser && window.fancyLoginUser.loginType && window.fancyLoginUser.loginType==2){
                $('#shut-fmall-btn').show();
            }
            /*app自动登录*/
            /*首页显示个人昵称*/
            if(window.fancyLoginUser){
                var name=window.fancyLoginUser.nickname || window.fancyLoginUser.mobile || '游客';
                $('.me span').text(name);
            }else{
                $('.me span').text('游客');
                /*如果在app访问则自动登录*/
                var isios=G._navigator().ios;
                var isAndroid=G._navigator.android;
                if(isAndroid && window.mall && window.mall.getToken){
                    var appUser=window.mall.getToken();
                    var appUser=eval('(' + appUser + ')');
                    var token=appUser.token;
                    var fancyId=appUser.fid;
                    var firstLogin=appUser.firstLogin;
                    var mobile=appUser.mobile;
                    if(firstLogin){
                        self._appLogin({
                            token:token,
                            fancyId:fancyId,
                            mobile:mobile
                        });
                    }
                }else if(isios){
                    

                    G.connectWebViewJavascriptBridge(function(bridge) {

                        bridge.init(function(data) {
                            self._appLogin({
                                token:data.token,
                                fancyId:data.fid,
                                mobile:data.mobile
                            });
                        });

                    });
                };
                    
            };
            /*关闭商城*/
            $('#shut-fmall-btn').bind('click',function(){
                if(G._navigator().ios){
                    $('body').append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=close" ></iframe>');
                }else if(G._navigator().android){
                    window.mall.h5Finish();
                };
            });
            /*扫码*/
            $('#barcode').bind('click',function(){
                if(G._navigator().ios){
                    $('body').append('<iframe src="fancymall://mall.fancyedu.com/app/action.json?m=barcode" ></iframe>');
                }else if(G._navigator().android){
                    window.mall.barcode();
                };
            });
        },
        _appLogin:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/login/appAutoLogin.do',
                data:data,
                success:function(res){
                    if(res.info.ok==true){
                        if(res.data.isLogin==true){
                            var name=res.data.loginUser.nickname || res.data.loginUser.mobile || '游客';
                            $('.me span').text(name);
                        }
                    }else{
                        alert(res.info.message);
                    }

                },
                beforeSend:function(){
                    $.showIndicator();
                },
                complete:function(){
                    $.hideIndicator();
                },
                error:function(){
                    alert('error');
                }
            });
        }
	};
	G._getLoginUser(main.init);
});