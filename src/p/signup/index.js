define(function(require, exports, module){
    var G=require('../../c/js/globale');
        require('../../c/js/registerHelper');
    var ping=require('../../c/js/pingPay-activity');
    var Tparticipator=require('./participator.handlebars');
    var main = {
        code:false,
        init:function(){ 
            var self=main;
            self.activityId=G._getUrlParam('id');
            /*查询已存在的人*/
            self._getParticipator();
            /*获取售卖信息*/
            self._getSalMes();

            self._event();

            /*返回上一页面时候去获取价格*/
            $(document).on("pageReinit", function(e, pageId, $page) {
                if(pageId=='current-page'){
                    self._getPrice();
                };
            });
            /*获取邀请码*/
            $('#getCode').on('click',function(){
                self._getCode();
            });
            /*自动填写手机号*/
            if(window.fancyLoginUser && window.fancyLoginUser.mobile){
                $('#sign-phone').val(window.fancyLoginUser.mobile);
            }
        },
        _getCode:function(){
            var self=this;
            var code=$('#invitationCode').val();
            if(!code){
                $.alert('请输入邀请码');
                return;
            }else{
                self.inviteCode=code;
            };

            $.ajax({
                type:'get',
                cach:false,
                data:{
                    inviteCode:code,
                    activityId:self.activityId
                },
                url:'/activity/verifyInviteCode.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        // window.location.href="/activity/myActivity.html";
                        $('.nav1').hide();
                        $('.nav2').show();
                        
                        self.code=true;
                        $('#getCode').hide();
                        $.alert('成功！请添加活动成员');
                    }else{
                        $.alert(res.info.message);
                    };
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
        _event:function(){
            var self=this;
            /*立即支付*/
            $('.J-confirm-pay').off().on('click',function(){
                var param=self._param();
                if(param){
                    self._sign(param);
                }else{
                    return;
                };
            });
            
            /*新增成员*/
            $('#add-save').off().on('click',function(){
                self._addPeople();
            });
            /*添加已存在人员*/
            $('#history-people li').off().on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                var checkBox=$(this).find('input[type="checkbox"]');
                var isChecked=checkBox.is(':checked');
                var id=$(this).attr('data-id');
                if(!isChecked){//添加
                    self._addToJoin({
                        checkbox:this
                    });
                }else{//从已选择中删除
                    $('#join-people li[data-id="'+ id +'"]').remove();
                    $('#history-people li[data-id="'+ id +'"]').find('input[type="checkbox"]').prop('checked',false);
                }
            });
            /*删除常用联系人*/
            $('#history-people li i[rel="delete"]').off().on('click',function(e){
                e.stopPropagation();
                e.preventDefault();
                var id=$(this).parents('li').attr('data-id');
                $.confirm('确定删除吗?', function () {
                    self._delete(id);
                });
            });
            /*是否保险*/
            $('#sign-safe').parent().off().on('click',function(){
                self._getPrice();
            });
            /*是否有邀请码*/
            $('#sign-code').parent().off().on('click',function(){
                var flag=$(this).find('input[type="checkbox"]').is(':checked');
                if(flag){
                    $('.yaoqingCode').show();
                }else{
                    $('.yaoqingCode').hide();

                };
            });
        },
        _getSalMes:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                data:{
                    activityId:self.activityId
                },
                url:'/activity/getSellInfo.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        var data=res.data.sellInfo;
                        var transportationType=data.transportationType || '';
                        var isInsurance=data.isInsurance || '';
                        var insurancePrice=data.insurancePrice || 0;
                        if(transportationType==1){
                            $('.transportationType').removeClass('hide');
                        };
                        if(isInsurance==1){
                            $('#sign-safe').parents('.item-input').append('<span class="price">￥<i class="insurancePrice">'+ insurancePrice +'</i></span>');
                            $('.isInsurance').removeClass('hide');
                        }
                    };
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
        _getPrice:function(){
            var self=this;
            var ids=[];
            var data={
                activityId:self.activityId
            };
            var signSafe=$('#sign-safe').is(':checked') ? 1 : 0;//是否保险
            if(signSafe=='1'){
                data.isInsurance=signSafe;//是否参加保险
                data.insurancePrice=$('.insurancePrice').text();
            };
            /*参加人信息*/
            var jpBox=$('#join-people');
            jpBox.find('li').each(function(){
                ids.push($(this).attr('data-id'));
            });

            if(ids.length<=0){
                $('#J-totalPrice').html(' ');
                return;
            }else{
                data.participatorIds=ids.join(',');
            };
            $.ajax({
                type:'get',
                cach:false,
                data:data,
                url:'/activity/getPrice.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        var price=res.data.price;
                        $('#J-totalPrice').html('合计￥:<span class="price">'+ price +'</span>');
                    };
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
        _getParticipator:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:'/activity/listParticipator.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        $('#history-people').html(Tparticipator(res.data.participatorList));

                        /*已选择的联系人置为选中状态*/
                        $('#join-people li').each(function(){
                            var id=$(this).attr('data-id');
                            var checkbox=$('#history-people li[data-id="'+ id +'"]').find('input[type="checkbox"]');
                            checkbox.prop('checked',true);
                        });

                        self._event();
                    };
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
        _addPeople:function(){
            var self=this;
            var mobileReg=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
            var addParam={};
            var addName=$('#add-name').val();
            var addPhone=$('#add-phone').val();
            var addAge=$('#add-age').val();
            var sex=$('#add-sex').val();
            
            if(!addName){
                $.alert('请填写参加人姓名');
                return;
            }else if(!addAge){
                $.alert('请填写年龄')
                return;
            };

            if(addPhone && !mobileReg.test(addPhone)){
                $.alert('手机号填写错误');
                return;
            };

            addParam={
                realName:addName,
                age:addAge,
                mobile:addPhone,
                sex:sex
            }

            self._canAdd(addParam);
        },
        _canAdd:function(data){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                data:data,
                url:'/activity/addParticipator.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getParticipator();
                        $.router.back();

                        $('#add-people input').val('');
                    };
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
        _delete:function(id){
            var self=this;
            $('#join-people li[data-id="'+ id +'"]').remove();

            $.ajax({
                type:'get',
                cach:false,
                data:{
                    participatorId:id
                },
                url:'/activity/delParticipator.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        self._getParticipator();
                    };
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
        _addToJoin:function(param){
            var self=this;
            var $li=$(param.checkbox);
            var name=$li.find('span[rel=name]').html();
            var phone=$li.find('div[rel=phone]').text();
            var id=$li.attr('data-id');

            $('#join-people ul').prepend('<li data-id="'+ id +'">\
                <a href="#" class="item-content">\
                  <div class="item-inner">\
                    <div class="item-title-row">\
                        <div class="item-title fz22"> '+ name +' </div>\
                    </div>\
                    <div class="color-gray">'+ phone +'</div>\
                  </div>\
                </a>\
              </li>');

            $('#history-people li[data-id="'+ id +'"]').find('input[type="checkbox"]').prop('checked',true);

            self._event();
        },
        _param:function(){
            var self=this;
            /*报名人信息*/
            var activityId=G._getUrlParam('id') || '';
            var mobileReg=/^1[3|4|5|7|8][0-9]\d{4,8}$/;
            var signParam={};
            var signName=$('#sign-name').val();
            var signPhone=$('#sign-phone').val();
            var signTraffick=$('#sign-traffick').val();//交通方式
            var signSafe=$('#sign-safe').is(':checked') ? 1 : 0;//是否保险
            var price=$('#J-totalPrice .price').text();
            var ids=[];
            if(!signName){
                $.alert('请填写报名人姓名');
                return;
            }else if(!mobileReg.test(signPhone)){
                $.alert('手机号填写错误');
                return;
            };
            /*参加人信息*/
            var jpBox=$('#join-people');
            jpBox.find('li').each(function(){
                ids.push($(this).attr('data-id'));
            });

            if(ids.length<=0){
                $.alert('请添加参与人');
                return;
            }else{
                ids=ids.join(',');
                signParam={
                    realName:signName,
                    mobile:signPhone,
                    price:price,
                    participatorIds:ids,
                    activityId:activityId
                };

                if(!$('.transportationType').hasClass('hide')){
                    signParam.transportationType=signTraffick;//交通方式
                }
                if(!$('.isInsurance').hasClass('hide')){
                    signParam.isInsurance=signSafe;//是否参加保险
                }
                if(signSafe=='1'){
                    signParam.insurancePrice=$('.insurancePrice').text();
                };
                return signParam;
            }
        },
        _sign:function(data){
            var self=this;
            if(self.code){
                data.isUseCode=1,
                data.inviteCode=self.inviteCode
            };
            $.ajax({
                type:'get',
                cach:false,
                data:data,
                url:'/activity/jsonSignup.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        if(self.code){
                            var from=$('#J-from').val();
                            var href="/activity/myActivity.html";
                            if(from=='fsl'){
                                href='/'+href;
                            };
                            window.location.href=href;
                        }else{
                            var orderNo=res.data.orderNo;
                            ping.init(orderNo,'acitvity');
                        }
                    };
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