var FullDate= (function(){
  var public = {};
  var _d = new Date();
  var date_today= _d.getDate();
      data_today = ('0' + date_today).slice(-2);
  var month_today = _d.getMonth() + 1;
      month_today = ('0' + month_today).slice(-2);
  var year_today = '2016';
  public.today_mmddyyyy = month_today + '/' + date_today + '/' + year_today;
  //expose FullDate.today_mmddyyyy
  return public;
})();

module.exports = FullDate;
