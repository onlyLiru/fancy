define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var md5=require('../../c/js/md5').md5;
    var encode64=require('../../c/js/base64').encode64;
    var main = {
        init:function(){ 
            var self=this;
            self.target=G._getUrlParam('target') || '';
            self.loginToken=$('#J-loginToken').val();
            
            /*如果是在幼儿园app，则拉起app登录页*/
            if(self.target.indexOf('fsl/')!= -1){
                var isios=G._navigator().ios;
                var isAndroid=G._navigator.android;
                if(isAndroid && window.mall && window.mall.fslLogin){
                    window.mall.fslLogin();
                }else if(isios){
                    G.connectWebViewJavascriptBridge(function(bridge) {
                        bridge.send({
                            globale:'fslLogin'
                        });
                    });
                };
            }else{
                $('.theme-pink').removeClass('hide');
            };
            
            self._login();
            self._event();

            /*替换url，后面带上target*/
            $('a.add-target').each(function(){
                var url=$(this).attr('href')+'?target='+self.target;
                $(this).attr('href',url);
            });
        },
        _event:function(){
            var self=this;
        },
        _login:function(){
            var self=this;
            var $nameInput=$('#J-login-name');
            var $passwordInput=$('#J-login-password');
            var $btn=$('#J-login-btn');
            var name,password;

            $passwordInput.bind('keyup',function(){
                var $this=$(this);
                if($this.val().length>=4 && $nameInput.val().length>0){
                    $btn.removeClass('color-gray');
                }else{
                    $btn.addClass('color-gray');
                }
            });

            $nameInput.bind('keyup',function(){
                $passwordInput.val('');
                $btn.addClass('color-gray');
            });

            $btn.unbind('click').bind('click',function(){
                var $this=$(this);
                var flag=$this.hasClass('color-gray');
                var mobileReg=/^1[3|4|5|8][0-9]\d{4,8}$/;
                    name=$nameInput.val();
                    password=$passwordInput.val();
                if(flag){
                    alert('请正确输入用户名，密码');
                }else{
                    password32=encode64(self.loginToken+password);
                    password=md5(self.loginToken+md5(password));
                    self._go({
                        mobile:name,
                        password:password,
                        password32:password32
                    });
                };
            });

        },
        _go:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/login/jsonLogin.do',
                data:data,
                success:function(res){
                    var url=G._getUrlParam('target') || "/index.html";
                    if(res.info.ok==true){
                        if(res.data.loginResult){
                            // console.log(res);
                            var fancyId=res.data.loginUser.fancyId || '';
                            var mobile=res.data.loginUser.mobile || '';
                            var token=res.data.loginUser.token || '';
                            /*APP自动登录*/
                            /*如果已经登录，把token传给app*/
                            var isios=G._navigator().ios;
                            var isAndroid=G._navigator.android;
                            if(isAndroid && window.mall && window.mall.setToken){
                                window.mall.setToken('{token:'+token+',fid:'+fancyId+',mobile:'+mobile +'}');
                            }else if(isios){
                                G.connectWebViewJavascriptBridge(function(bridge) {
                                    bridge.send({
                                        token:token,
                                        fid:fancyId,
                                        mobile:mobile,
                                        globale:'login'
                                    });
                                });
                            };
                            location.href=url;
                        }else{
                            self.loginToken=res.data.loginToken;
                            alert(res.data.errorMsg);
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
                    // alert('error');
                }
            });
        }
    };
    main.init();
});