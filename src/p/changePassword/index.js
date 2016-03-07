define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var encode64=require('../../c/js/base64').encode64;
    var md5=require('../../c/js/md5').md5;
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
            /*当有了手机号码才可以下一步*/
            // $('#J-phonenumber').html(userMess.mobile || '<a class="external" href="/login/register.do?target=/customer/customerMsg.html">还没有手机信息，请填写></a>');
            // if(!userMess.mobile){
            //     $('#J-register-code-box a').attr('href','/login/register.do');
            //     $('#J-next').attr('href','/login/register.do');
            //     return;
            // };

            /*验证输入的是否是手机号码*/
            // $('#J-next').unbind('click').bind('click',function(){
            //     if(!codeInput.val().length){
            //         alert('请输入验证码');
            //         return;
            //     }else{
            //         $.router.loadPage('#next-page')
            //         clearInterval(timer);
            //         $('#J-register-code-box a').html('获取验证码');
            //     }
            // });
            /*获取验证码*/
            // $('#J-register-code-box a').unbind('click').bind('click',function(){
            //     var $this=$(this);
            //     var time=60;
            //     $.ajax({
            //         type:'get',
            //         cach:false,
            //         url:'/login/jsonGetVerifyCode.do',
            //         data:{
            //             mobile:mobileInput.text()
            //         },
            //         success:function(res){
            //             if(res.info.ok==true){
            //                 $this.text('剩余'+time+'秒');
            //                 clearInterval(timer);
            //                 timer=setInterval(function(){
            //                     if(time<=0){
            //                         $this.text('重新获取');
            //                         clearInterval(timer);
            //                     }else{
            //                         time--;
            //                         $this.text('剩余'+time+'秒');
            //                     }
            //                 },1000);
            //             }else{
            //                 alert(res.info.message);
            //             }
            //         },
            //         beforeSend:function(){
            //             $.showIndicator();
            //         },
            //         complete:function(){
            //             $.hideIndicator();
            //         },
            //         error:function(){
            //             // alert('error');
            //         }
            //     });
            // });
            /*确定修改*/
            $('#J-confirm').unbind('click').bind('click',function(){
                var oldPas=$('#J-old-pas').val();
                var newPas=$('#J-new-pas').val();
                if(!oldPas.length){
                    alert('请输入旧密码');
                    return;
                };
                if(!newPas.length){
                    alert('请输入新密码');
                    return;
                };

                // oldPas=md5(self.loginToken+md5(oldPas));
                oldPas=encode64(self.loginToken+oldPas);
                newPas=encode64(self.loginToken+newPas);
                self._confirm({
                    customerId:userMess.customerId,
                    password:oldPas,
                    newPassword:newPas
                });
            });
        },
        _confirm:function(data) {
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/login/changePwd.json',
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