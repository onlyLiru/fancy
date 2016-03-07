define("/WEB-UED/fancy/dist/c/js/pingPay-activity-debug", [], function(require, exports, module) {
    var main = {
        init: function(orderNo) {
            var self = this;
            var amount = $("#J-totalPrice .J-total").text() * 100 || "";
            var order_no = orderNo;
            var $openId = $("#J-openId");
            var openId = $openId.val();
            if (openId && !sessionStorage.openId) {
                sessionStorage.openId = openId
            }
            if (window.sessionStorage) {
                openId = openId || sessionStorage.openId
            }
            if (orderNo) {
                sessionStorage.orderNo = orderNo
            }
            var param = {
                openId: openId,
                orderNo: orderNo
            };
            pingpp_one.init({
                app_id: "app_arzrzD1SWX9CbzTO",
                amount: amount,
                channel: ["wx_pub", "alipay_wap"],
                charge_url: "/payment/getCharge.json",
                charge_param: param,
                open_id: openId,
                debug: false
            }, function(res) {
                if (res.debug && res.chargeUrlOutput) {
                    console.log(res.chargeUrlOutput)
                }
                if (!res.status) {
                    alert(res.msg)
                } else {
                    if (res.debug && !res.wxSuccess) {
                        if (confirm("当前为 debug 模式，是否继续支付？")) {
                            pingpp_one.resume()
                        }
                    } else pingpp_one.success(function(res) {
                        if (!res.status) {
                            alert(res.msg)
                        } else {}
                    }, function() {
                        window.location.href = "/activity/myActivity.html"
                    })
                }
            });
            var timer = setInterval(function() {
                if ($("body").hasClass("p_one_open")) {
                    clearInterval(timer);
                    $("body").removeClass("p_one_open")
                }
            }, 10)
        },
        randomString: function(len) {
            var self = this;
            len = len || 32;
            var chars = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678";
            var maxPos = chars.length;
            var pwd = "";
            for (i = 0; i < len; i++) {
                pwd += chars.charAt(Math.floor(Math.random() * maxPos))
            }
            return pwd
        }
    };
    module.exports = main
});