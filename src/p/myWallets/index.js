define(function(require, exports, module){
    var G=require('../../c/js/globale');
    var main = {
        
        init:function(){ 
            var self=this;
            var from=$('#J-from').val();
            self.PREURL=from ? '/'+from : '';
            
            self._getRedPacket();
            
        },
        _getRedPacket:function(){
            var self=this;
            $.ajax({
                type:'get',
                cach:false,
                url:self.PREURL+'/activity/getRedPacket.json',
                success:function(res){
                    if(res=='noLogin'){
                        location.href='/login.do?target='+location.href;
                        return;
                    };
                    if(res.info.ok==true){
                        if(res.data.redPacket && res.data.redPacket.balance && res.data.redPacket.balance>0){
                            $('#J-red-packet').html('<i class="iconfont pointer fz20">&#xe680;</i>\
                            <p>'+ res.data.redPacket.balance +'</p>');
                        }else{
                            $('#J-red-packet').removeClass('red').addClass('gray').html('<i class="iconfont pointer fz20">&#xe680;</i>');
                        };
                        $('#tab1 > div').show();
                    }else{
                        alert(res.info.message);
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