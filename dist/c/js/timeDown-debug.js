define("/WEB-UED/fancy/dist/c/js/timeDown-debug", [], function(require, exports, module) {
    var main = {
        init: function(year, month, day, divname) {
            var self = this;
            var interval = 1e3;
            window.setInterval(function() {
                self.ShowCountDown(year, month, day, divname)
            }, interval)
        },
        ShowCountDown: function(year, month, day, divname) {
            var now = new Date;
            var endDate = new Date(year, month - 1, day);
            var leftTime = endDate.getTime() - now.getTime();
            var leftsecond = parseInt(leftTime / 1e3);
            var day1 = Math.floor(leftsecond / (60 * 60 * 24));
            var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
            var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
            var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);
            var cc = document.getElementById(divname);
            if (endDate < now) {
                return
            }
            cc.innerHTML = "距离还有:<span>" + day1 + "</span>天<span>" + hour + "</span>时<span>" + minute + "</span>分<span>" + second + "</span>秒"
        }
    };
    module.exports = main
});