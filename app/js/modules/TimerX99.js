/* start TimerX99 module and fn */
var TimerX99 = (function() {
    var priv8eMX99 = {};
    priv8eMX99._initCountDown = function(id, endTime, show) {
        _getRemainingTime = function(endTime) {
            var t = Date.parse(endTime) - Date.parse(new Date());
            var seconds = Math.floor((t / 1000) % 60);
            var minutes = Math.floor((t / 1000 / 60) % 60);
            var hours = Math.floor((t / (1000 * 60 * 60)) % 24);
            var days = Math.floor(t / (1000 * 60 * 60 * 24));
            return {
                'total': t,
                'days': days,
                'hours': hours,
                'minutes': minutes,
                'seconds': seconds
            };
        };
        if (!id || id === null) {
            console.log('ID not found in DOM!');
            return;
        }
        var timerDomEle = document.getElementById(id);

        if(!timerDomEle){
          console.log('TimerX99: element with targetID not found');
        }

        if(timerDomEle){
          if (show == 'false' || show === false) {
              timerDomEle.style.display = 'none';
          } else {

            timerDomEle.style.display = 'block';
            /* hide timerMainWrapperDOM */
            //var get_domTargetID = document.getElementById(domTargetID);
            var this_timerMainWrapperDOM = findParent_firstMatchClassName(timerDomEle, 'timerX99_UnitWrap_rel');
            if(this_timerMainWrapperDOM !== null){
              //console.log('this_timerMainWrapperDOM: ', this_timerMainWrapperDOM );
              this_timerMainWrapperDOM.style.opacity = 1;
            }
            /* /hide timerMainWrapperDOM */
          }

          var dayV_Wrap = timerDomEle.querySelector('.dayV_timerX');
          var hrV_Wrap = timerDomEle.querySelector('.hrV_timerX');
          var minV_Wrap = timerDomEle.querySelector('.minV_timerX');
          var secV_Wrap = timerDomEle.querySelector('.secV_timerX');

          updateClock();
          var timeInterval = setInterval(updateClock, 1000);

        }
        function updateClock() {
            var t = _getRemainingTime(endTime);
            dayV_Wrap.innerHTML = ('0' + t.days).slice(-2);
            hrV_Wrap.innerHTML = ('0' + t.hours).slice(-2);
            minV_Wrap.innerHTML = ('0' + t.minutes).slice(-2);
            secV_Wrap.innerHTML = ('0' + t.seconds).slice(-2);
            if (t.total <= 0) {
                clearInterval(timeInterval);
                if (timerDomEle) {
                    console.log('clearInterval TimerX99');
                    timerDomEle.style.display = 'none';
                } else {
                    console.log('ID not found in DOM!');
                }
                //console.log('timer completed');
                window.location.reload(true);
            }
        }

    };
    ///* * *public methods
    var publicMX99 = {};
    publicMX99.initCountDwnX99 = function(startEnd_TargetID_typeArr) {
        if (startEnd_TargetID_typeArr instanceof Array) {
            if (startEnd_TargetID_typeArr.length < 1) {
                console.log('define settings in arg Array');
            } else {
                for (var i = 0, len = startEnd_TargetID_typeArr.length; i < len; i++) {
                    var this_startEnd = startEnd_TargetID_typeArr[i];
                    var startDate = this_startEnd[0] + ' GMT+0530';
                    var endDate = this_startEnd[1] + ' GMT+0530';
                    var domTargetID = this_startEnd[2];
                    var callback = this_startEnd[3];
                    var show = this_startEnd[4];
                    if (!isValidDate(startDate)) {
                        console.log('invalid date format, it must be MM/DD/YYYY');
                        return;
                    }
                    if (!isValidDate(endDate)) {
                        console.log('invalid date format, it must be MM/DD/YYYY');
                        return;
                    }
                    if (callback === null) {
                        console.log('no callback defined');
                    }
                    if (show == 'false' || show === false) {
                        console.log('hide this timer');
                    } else if (!show || show.length < 1) {
                        //console.log('show undefined but show timer anyway');
                    } else {
                        console.log('show this timer');
                    }
                    var startDate_ms = new Date(startDate);
                    var endDate_ms = new Date(endDate);
                    var currDate_ms = new Date();
                    if (startDate_ms > endDate_ms) {
                        console.log('error in startDate, startDate is more than end Date');
                    }
                    if (startDate_ms < currDate_ms) {
                        //console.log('startDate: ' + startDate);
                    }
                    if (endDate_ms > currDate_ms && currDate_ms >= startDate_ms) {
                        priv8eMX99._initCountDown(domTargetID, endDate, show);
                        if (callback) {
                            if (!isFunction(callback)) {
                                console.log('callback must be a function expression like this:' + '\n' + 'function myCallback(){ //do something }');
                                return;
                            } else {
                                console.log('running callback:');
                                callback();
                            }
                        }
                    }
                }
            }
        } else {
            console.log('arg must be an Array');
        }
    };
    function isFunction(functionToCheck) {
        var getType = {};
        return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
    }
    function isValidDate(date) {
        var d = date;
        var i_fSpace = d.indexOf(' ');
        var data_str = d.substr(0, i_fSpace);
        var matches = /^(\d{1,2})[-\/](\d{1,2})[-\/](\d{4})$/.exec(data_str);
        if (matches === null) return false;
        var d_ = matches[2];
        var m = matches[1] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d_);
        return composedDate.getDate() == d_ && composedDate.getMonth() == m && composedDate.getFullYear() == y;
    }
    publicMX99.all_timerOptions_ajax = [];
    publicMX99.create_all_timerOptions = function (data){
      data.forEach(function(item){
      var this_targetTimerID = item.categoryName + '_timer';
      //categoryNames of TimerOffers MUST include the string 'TimerOffer'
      //example "liveTimerOffer_01"
      if(this_targetTimerID.indexOf('TimerOffer') < 0){
        //console.log('no timerOffers found!');
        return;
      }
      if(
          item.startTimeHrs === 0 &&
          item.startTimeMin === 0 &&
          item.endTimeHrs === 23 &&
          item.endTimeMin === 59
        ){
          console.log("don't run createTimerOptions, return");
          return;
        }

      var this_startTimeHrs = ('0' + item.startTimeHrs).slice(-2);
      var this_startTimeMin = ('0' + item.startTimeMin).slice(-2);
      var this_endTimeHrs = ('0' + item.endTimeHrs).slice(-2);
      var this_endTimeMin = ('0' + item.endTimeMin).slice(-2);
      var this_item_startTime = FullDate.today_mmddyyyy + ' ' + this_startTimeHrs + ':' + this_startTimeMin + ':00';
      var this_item_endTime = FullDate.today_mmddyyyy + ' ' + this_endTimeHrs + ':' + this_endTimeMin + ':00';
      var newArr_option = [];
      newArr_option.push(this_item_startTime, this_item_endTime, this_targetTimerID );
      if(!TimerX99.all_timerOptions_ajax || !TimerX99){
        console.log('TimerX99 Module missing!');
      }
      TimerX99.all_timerOptions_ajax.push(newArr_option);
      console.log('allTimerOptions: ', newArr_option);
    });
  };
    return publicMX99;
    //helper
    function findParent_firstMatchClassName(el, className) {
      while (el.parentNode) {
          el = el.parentNode;
          if (el.className === className)
                return el;
      }
      return null;
    }
})();
//TimerX99.initCountDwnX99(startEnd_TargetID_typeArr);

module.exports = TimerX99;
