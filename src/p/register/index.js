define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var encode64=require('../../c/js/base64').encode64;
    var main = {
        init:function(){ 
            var self=this;
            self.loginToken=$('#J-loginToken').val();
            self._event();

            /*替换url，后面带上target*/
            self.target=G._getUrlParam('target')|| '';
            $('a.add-target').each(function(){
                var url=$(this).attr('href')+'?target='+self.target;
                $(this).attr('href',url);
            });
        },
        _event:function(){
            var timer;
            var self=this;
            var mobileInput=$('#J-phonenumber');
            var codeInput=$('#J-register-code');
            var passwordInput=$('#J-register-password');
            var passwordAgainInput=$('#J-register-password-again');
            var mobileReg=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
            /*当输入了手机号码才可以下一步*/
            mobileInput.unbind('keyup').bind('keyup',function(){
                if(mobileReg.test(mobileInput.val())){
                    $('#J-next').attr('href','#next-page').removeClass('external');
                }else{
                    $('#J-next').attr('href','javascript:').addClass('external');
                };
            });
            /*验证输入的是否是手机号码*/
            $('#J-next').unbind('click').bind('click',function(){
                if($(this).hasClass('external')){
                    alert('请输入正确的手机号码'); 
                }else{
                    clearInterval(timer);
                    $('#J-register-code-box a').html('获取验证码');
                }
            });
            /*获取验证码*/
            $('#J-register-code-box a').unbind('click').bind('click',function(){
                var $this=$(this);
                var time=60;

                $.ajax({
                    type:'get',
                    cach:false,
                    url:'/login/ucSendRegisterVerifyCode.do',
                    data:{
                        mobile:mobileInput.val()
                    },
                    success:function(res){
                        if(res.info.ok==true){
                            $this.text('剩余'+time+'秒');
                            clearInterval(timer);
                            timer=setInterval(function(){
                                if(time<=0){
                                    $this.text('重新获取');
                                    clearInterval(timer);
                                }else{
                                    time--;
                                    $this.text('剩余'+time+'秒');
                                }
                            },1000);
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

                
            });
            /*点击注册按钮*/
            $('#J-register-btn').unbind('click').bind('click',function(){
                var mobile=$('#J-phonenumber').val();
                var code=$('#J-register-code').val();
                var password=$('#J-register-password').val();
                var passwordAgain=$('#J-register-password-again').val();
                /*没有输入验证码*/
                if(!code.length){
                    alert('请输入验证码');
                    return;
                }
                /*没有输入密码*/
                if(!password.length){
                    alert('请输入密码');
                    return;
                }else if(password.length<6){
                    alert('密码长度不能少于6位');
                    return;
                }
                /*没有确认密码*/
                if(!passwordAgain.length){
                    alert('请确认密码');
                    return;
                }
                /*密码不一致*/
                if(password!=passwordAgain){
                    alert('两次输入密码不一致');
                    return;
                };
                password=self.loginToken+password;
                password=encode64(password);
                self._register({
                    mobile:mobile,
                    vCode:code,
                    password:password
                });
            });
        },
        _register:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/login/jsonRegister.do',
                data:data,
                success:function(res){
                    var url="/index.html";
                    if(window.fancyLoginUser){
                        url=G._getUrlParam('target') || "/index.html";
                    }else{
                        url="/login.do?target="+G._getUrlParam('target');
                    };
                    if(res.info.ok==true){
                        location.href=url;
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