define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var encode64=require('../../c/js/base64').encode64;
    var main = {
        init:function(){ 
            var self=this;
            self.loginToken=$('#J-loginToken').val();
            G._getLoginUser(self._event);
            /*替换url，后面带上target*/
            self.target=G._getUrlParam('target')|| '';
            $('a.add-target').each(function(){
                var url=$(this).attr('href')+'?target='+self.target;
                $(this).attr('href',url);
            });
        },
        _event:function(userMess){
            var self=main;
            var timer;
            var mobileInput=$('#J-phonenumber');
            var codeInput=$('#J-register-code');
            var mobileReg=/^1[3|4|5|8][0-9]\d{4,8}$/;
            /*当输入了手机号码才可以下一步*/
            mobileInput.unbind('keyup').bind('keyup',function(){
                if(mobileReg.test(mobileInput.val())){
                    $('#J-next').removeClass('external');
                }else{
                    $('#J-next').addClass('external');
                };
            });

            /*验证输入的是否是手机号码*/
            $('#J-next').unbind('click').bind('click',function(){
                if($(this).hasClass('external')){
                    alert('请输入正确的手机号码'); 
                }else if(!codeInput.val().length){
                    alert('请输入验证码');
                }else{
                    $.router.loadPage('#next-page')
                    clearInterval(timer);
                    $('#J-register-code-box a').html('获取验证码');
                }
            });
            /*获取验证码*/
            $('#J-register-code-box a').unbind('click').bind('click',function(){
                var $this=$(this);
                var time=60;

                if(!mobileReg.test(mobileInput.val())){
                    alert('请输入正确的手机号码');
                    return;
                }

                $.ajax({
                    type:'get',
                    cach:false,
                    url:'/login/ucSendResetPwdVerifyCode.do',
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
            /*确定*/
            $('#J-confirm').unbind('click').bind('click',function(){
                var newPas=$('#J-new-password').val();
                var newAgain=$('#J-new-again').val();
                if(!newPas.length){
                    alert('请输入新密码');
                    return;
                };
                if(!newAgain.length){
                    alert('请确认新密码');
                    return;
                };
                if(newPas!=newAgain){
                    alert('两次输入密码不一致');
                    return;
                };

                newPas=encode64(self.loginToken+newPas);

                self._confirm({
                    mobile:mobileInput.val(),
                    vCode:codeInput.val(),
                    newPassword:newPas
                });
            });
        },
        _confirm:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/login/findPwd.json',
                data:data,
                success:function(res){
                    var url="/index.html";
                    if(window.fancyLoginUser){
                        url=G._getUrlParam('target') || "/index.html";
                    }else{
                        url="/login.do"
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