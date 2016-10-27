var MobPlatform_M = (function(){
    var public = {};
    public.mobileSite_running = false;
    public.mobileSite_TrueX999 = function(){
        var currURLX = window.location;
        var mob_preURL_str = 'm.snapdeal.com';
        currURLX = String(currURLX);
        public.mobileSite_running = (currURLX.indexOf(mob_preURL_str) > 0)? true: false;
        return public.mobileSite_running;
    };
    return public;
})();

module.exports = MobPlatform_M;
