define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var main = {
        init:function(){ 
            var self=this;
            self._event();
            self._getMes();
            
        },
        _event:function(){
            var self=this;
            /*特殊字符，数字，字母，下划线和中文，但不以下划线开头和结尾*/
            var RegEx=/^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
            /*邮箱*/
            var RegEmail=/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
            /*退出登陆*/
            $('#J-login-out').click(function(){
                $.ajax({
                    type:'get',
                    cach:false,
                    url:'/logout.do',
                    success:function(res){
                        if(res.info.ok==true){
                            /*app自动登录如果退出告诉app删除token*/
                            var isios=G._navigator().ios;
                            var isAndroid=G._navigator.android;
                            if(isAndroid && window.mall && window.mall.removeToken){
                                window.mall.removeToken();
                            }else if(isios){
                                
                                G.connectWebViewJavascriptBridge(function(bridge) {
                                    
                                    bridge.send({
                                        logout:true,
                                        globale:'logout'
                                    });

                                });
                                
                            };
                            
                            location.href="/index.html";
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
            /*修改登陆名*/
            $('#save-loginid').unbind('click').bind('click',function(){
                var loginId=$('#loginid-input').val();
                if(!RegEx.test(loginId)){
                    $.alert('输入不合法');
                    return;
                };
                self._edit({
                    loginId:loginId
                });
                $.router.back('/customer/userMessage.html');
            });
            /*修改昵称*/
            $('#save-nick-name').unbind('click').bind('click',function(){
                var name=$('#nick-name-input').val();
                if(!RegEx.test(name)){
                    $.alert('输入不合法');
                    return;
                };
                self._edit({
                    nickname:name
                });
                $.router.back('/customer/userMessage.html');
            });
            /*修改邮箱*/
            $('#save-email').unbind('click').bind('click',function(){
                var email=$('#email-input').val();
                if(!RegEmail.test(email)){
                    $.alert('邮箱不合法');
                    return;
                };
                self._edit({
                    email:email
                });
                $.router.back('/customer/userMessage.html');
            });
            /*修改生日*/
            $("#datetime-picker").calendar({
                inputReadOnly:true,
                onClose:function(){
                    var birth=$("#datetime-picker").val();
                    self._edit({
                        birthdayWeb:birth
                    });
                }
            });
            
            /*修改性别*/
            $('#edit-male').unbind().bind('click', function () {
              var buttons1 = [
                {
                  text: '请选择',
                  label: true
                },
                {
                  text: '男',
                  color: 'warning',
                  onClick: function() {
                    $('#edit-male .item-after').text('男');
                    self._edit({
                        sex:1
                    });
                  }
                },
                {
                  text: '女',
                  onClick: function() {
                    $('#edit-male .item-after').text('女');
                    self._edit({
                        sex:2
                    });
                  }
                }
              ];
              var buttons2 = [
                {
                  text: '取消',
                  bg: 'danger'
                }
              ];
              var groups = [buttons1, buttons2];
              $.actions(groups);
          });
        },
        _getMes:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/customer/getCustomer.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        // $('#mes-box').html(Tmes(res.data.customer));
                        self._setMes(res.data.customer);
                        self.token=res.data.token;
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
        },
        _setMes:function(res){
            var self=this;
            var loginId=res.loginId || '';
            var nickname=res.nickname || '';
            var sex=res.sex ==1 ? '男' : '女' || '';
            var mobile=res.mobile || '<a class="external" href="/login/register.do?target=/customer/customerMsg.html">还没有手机信息，请填写></a>';
            var birthday=res.birthdayWeb || '';
            var email=res.email || '';
            $('#mobile').html(mobile);
            $('#loginId').text(loginId);
            $('#loginid-input').val(loginId);
            $('#nickname').text(nickname);
            $('#nick-name-input').val(nickname);
            $('#email').text(email);
            $('#email-input').val(email);
            $('#sex').text(sex);
            $('#datetime-picker').val(birthday);

            self.customerId=res.customerId;

        },
        _edit:function(data){
            var self=this;
            data=$.extend(data,{
                customerId:self.customerId,
                token:self.token
            });
            $.ajax({
                type:'get',
                cach:false,
                url:'/customer/updateCustomer.json',
                data:data,
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getMes();
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