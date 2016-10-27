(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
//Our dependencies
var Blazy = require('Blazy');
var fastdom = require('fastdom');
var promise = require('es6-promise');
var RSVP = require('rsvp');
//var axios = require('axios');
var MobPlatform_M = require('./modules/MobPlatform_M');
var socialShareX_Module = require('./modules/socialShareX_Module');

var getJSON = function(url) {
  var promise = new RSVP.Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

    function handler() {
      if (this.readyState === this.DONE) {
        if (this.status === 200) { resolve(this.response); }
        else { reject(this); }
      }
    }
  });
  return promise;
};


// +++++ BrowserDetection +++++ //
//UC Browser
var isUCBrowserX99 = navigator.userAgent.indexOf('UCBrowser') > 0;
var userAgentX99 = navigator.userAgent;

//Internet Explorer
function isIE_Browser_fn() {
    var sAgent = window.navigator.userAgent;
    var Idx = sAgent.indexOf("MSIE");
    // If IE, return version number.
    if (Idx > 0) return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
    // If IE 11 then look for Updated user agent string.
    else if (!!navigator.userAgent.match(/Trident\/7\./)) return 11;
    else return 0; //It is not IE
}
var isIE_mobileBrowser = navigator.userAgent.indexOf('Windows Phone 8.1') > 0;
var isIE_Browser = isIE_Browser_fn();
function isWindowsPhone_fn() {
  if(navigator.userAgent.match(/Windows Phone/i)){
    return true;
  }

  if(navigator.userAgent.match(/iemobile/i)){
    return true;
  }

  if(navigator.userAgent.match(/WPDesktop/i)){
    return true;
  }
}

var isWindowsPhone = isWindowsPhone_fn();

//android < 5
function getAndroidVersionX99(ua) {
    ua = (ua || navigator.userAgent).toLowerCase();
    var match = ua.match(/android\s([0-9\.]*)/);
    return match ? match[1] : false;
}
function getAndroidV4_ifTrueUSE_nonPromise(ua){
 var _getAndroidVersionX99 = getAndroidVersionX99(ua);
 var version0;
 //if android
 if(_getAndroidVersionX99){
  version0 = parseInt(_getAndroidVersionX99, 10);
  if(version0 < 5){
   console.log('use non-promise based method');
   return true;
  }
  else {
   console.log('use promise based method');
   return false;
  }
 }
 //not android return
 else {
  console.log('not android');
  return false;
 }
}

var AndroidV4_ua = 'Mozilla/5.0 (Linux; Android 4.4; Nexus 4 Build/KRT16E) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/30.0.1599.105 Mobile Safari';
var isAndroidV4 = getAndroidV4_ifTrueUSE_nonPromise();
console.log('isAndroidV4: ', isAndroidV4);

//androidLogs
/*
var isAndroid = document.getElementById('isAndroid');
if(isAndroidV4){
    isAndroid.innerHTML = 'isAndroidV4';
}
*/

// +++++ mozilla +++++ //
function isMozillaAndroid_fn() {
  var is_firefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
  var is_android = navigator.platform.toLowerCase().indexOf("android") > -1;
  if(is_firefox && is_android){
    return true;
  }
  else {
    return false;
  }
}
var isMozillaAndroid = isMozillaAndroid_fn();
// +++++ /mozilla +++++ //

//is mobile screen < 640
function isMobile_Screen_fn() {
  var width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
  if(width < 980){
    return true;
  }
  else {
    return false;
  }
}
var isISMobile_Screen = isMobile_Screen_fn ();
console.log('isISMobile_Screen: ' , isISMobile_Screen);

//console.log('isIE_mobileBrowser: ', isIE_mobileBrowser);
//console.log('isIE_Browser: ', isIE_Browser);
// +++++ /BrowserDetection +++++ //

var usejQuery = false;
var usePromises = false;
var useRawXHR = false;

// +++++ nonPromiseXHR Module +++++ //
//var use_nonPromiseXHR = false;
var nonPromise = false;
var count = 0;
var len_offerData;
var firstData_arr = [];
var secondData_arr = [];
var dataContainerForRender = [];
var nonPromise_firstHTMLContent_arr = [];
var finalHTMLContent_arr = [];
var nonPromiseXHR = (function(){
    var public = {};
    public.get = function(url, callback){
      var request = new XMLHttpRequest();
          request.onreadystatechange = function(){
            if(request.readyState === 4){
              if(request.status === 200){
                console.log('nonPromiseXHR.get is running!');
                callback(request.responseText);
              }
            }
          };
      request.open('GET', url);
      request.send();
    };
    return public;
})();
// +++++ /nonPromiseXHR Module +++++ //

// +++++ jQuery Ajax Module +++++ //
var jQuery_Ajax = (function(){
    var public = {};
    public.get = function(url, callback){
      console.log('running jQuery_Ajax');
      $.ajax({
        url: url,
        type: "GET",
        dataType: 'json',
        success: function(data) {
          callback(data);
          console.log('jQuery_Ajax success!');
        },
        error: function(req, txt, err) {
          var errObj = JSON.parse(req.responseText);
          console.log(errObj.message);
        }
      });
    };
    return public;
})();
// +++++ jQuery Ajax Module +++++ //

//if not UCBrowser only then define myFastdom
//else render fails in UCBrowser
if(!isUCBrowserX99){
  //console.log('navigator.userAgent: ', navigator.userAgent);
  var myFastdom = fastdom.extend(fastdomPromised);
}

var Query_dom_categoryNames = (function(){
  var public = {};
  public.parentWrapper_id = 'mainWrapperX_newX999';
   //get dom_categoryNames_arr
  public.dom_categoryNames_arr = function get_dom_categoryNames_arr(){
    var parentWrapper = document.getElementById(public.parentWrapper_id);
    var dom_categoryNames_arr = [];
    var offers_WrapperX99 = parentWrapper.getElementsByClassName('offers_WrapperX99');
    for(var i=0; i<offers_WrapperX99.length; i++){
      dom_categoryNames_arr.push(offers_WrapperX99[i].getAttribute('id'));
    }
    return dom_categoryNames_arr;
  };
  return public;
  //Query_dom_categoryNames.dom_categoryNames_arr();
})();
//important ~ queries dom for .offers_WrapperX99 IDs GLOBAL
var dom_targetIds_arr = Query_dom_categoryNames.dom_categoryNames_arr();

var GetInner_ = (function(){
  var public = {};
  public.priceRange_domID = null;
  public.firstURL = null;
  public.priceRange_domID_setfn = function(priceRange_domID){
    public.priceRange_domID = priceRange_domID;
  };
  public.firstURL_setfn = function(url){
    public.firstURL = url;
  };
  return public;
})();
//expose n use GetInner_.priceRange_domID;
//expose n use GetInner_.firstURL;

//globalVars
var pogIdList_arr = [];
var secondReqData_arr = [];
var showSoldOut_g;

//returns Query_dom_categoryNames.dom_categoryNames_arr
var AjaxPageApp = (function(){
    //check if mobileSite running
    var mobileSite_TrueX999_var = MobPlatform_M.mobileSite_TrueX999();
        console.log('mobileSite_running: ' + mobileSite_TrueX999_var);

      //default options for filterBy:'categoryNames' & setToEachID:true
      var default_opts = {
        url: '',//always define
        parentWrapper_id: Query_dom_categoryNames.parentWrapper_id,//always define
        filterBy:'categoryNames',//'categoryNames' or 'price'
        setToEachID: true,//set to ids in dom ~ matching with categoryNames
        sortOrder: null,//categoryNames n their sequence: setToEachID:false
        priceRange_domID: null,
        TimerOffer: false,//check if TimerOffer
        showDiscount: false
      };

    //global inside AjaxPageApp
    var parentWrapper_id = default_opts.parentWrapper_id;
    var mainArray_X = [];
    var htmlContent_arr= [];
    var unique_categoryNames;
    var dom_categoryNames_arr = Query_dom_categoryNames.dom_categoryNames_arr();
    var setToEachID;
    var filterBy;
    var priceRange_domID;
    var sortOrder;
    var TimerOffer;
    var showDiscount;
    //public obj to be returned
    var public = {};
    public.get_priceRange_domID = null;
    public.init = function(options){
      if(!options){
          options = {};
      }
        //internal options caching and conditions
        var url = options.url ? options.url:default_opts.url;
            filterBy = options.filterBy ? options.filterBy:default_opts.filterBy;
            sortOrder = options.sortOrder ? options.sortOrder:default_opts.sortOrder;
            setToEachID = options.setToEachID ? options.setToEachID:default_opts.setToEachID;
            priceRange_domID = options.priceRange_domID ? options.priceRange_domID:default_opts.priceRange_domID;
            TimerOffer = options.TimerOffer ? options.TimerOffer:default_opts.TimerOffer;
            showDiscount = options.showDiscount ? options.showDiscount:default_opts.showDiscount;


        //update showSoldOut_g
        showSoldOut_g = showDiscount;
        if(showSoldOut_g === true){
          console.log('showing soldOut');
        }

        //if TimerOffer == true
        if(TimerOffer !== false) {

          ///NoTimer ~ comment out if Timer is no reqd reKt
            //window.TimerX99 = require('./modules/TimerX99');
            //window.FullDate = require('./modules/FullDate');
            if(!window.TimerX99 || window.TimerX99 === null){
                console.error('TimerOffers: true, require TimerX99 & FullDate Modules');
            }
        }
        else {
            console.log('TimerOffers: false, TimerX99 & FullDate Modules not reqd!');
        }
        //E X P O S I N G   priceRange_domID
        GetInner_.priceRange_domID_setfn(priceRange_domID);
        //E X P O S I N G  firstURL
        GetInner_.firstURL_setfn(url);
        //if filterByCategoryNames
        if(setToEachID === false){
          if(typeof filterBy == 'undefined'){
            console.log('please define filterBy Options');
          }
          if(typeof sortOrder == 'undefined'){
              console.log('please define sortOrder Options');
          }
          if(filterBy == 'categoryNames'){
            if(sortOrder === null){
              console.log('please define sortOrder Options');
            }
          }
          if(filterBy == 'price'){
              console.log('setToEachID must be true for filterBy Price');
              return;
          }
        }
        //if we want to append to predefined domIDs
        else {
          sortOrder = null;//set to null
          //console.log('setToEachID is true, sortOrder was set to null!');

          if(filterBy == 'price'){
            if(setToEachID === false){
              console.log('setToEachID must be true for filterBy Price');
            }
            if(priceRange_domID === null)
            console.log('please define priceRange_domID Options');
          }
        }
        //globalNonPromise TESTING ONLY
        //console.log('nonPromise before uA check: ', nonPromise);
        //nonPromise = true;

        //REAL USE CASE
        //use nonPromiseBased API
        //if UCBrowserTrueX99
        //if Internet Explorer below 11

        /*
        if(isAndroidV4){
          use_nonPromiseXHR = true;
        }

        if(isUCBrowserX99 || (isIE_Browser < 11 && isIE_Browser > 0) || (isIE_mobileBrowser)){
          nonPromise = true;
        }
        else {
          nonPromise = false;
        }
        */
        useAPI_userAgentCheck();
        function useAPI_userAgentCheck() {
          if(isUCBrowserX99 || (isIE_Browser < 11 && isIE_Browser > 0) || (isIE_mobileBrowser) || (isWindowsPhone) || isAndroidV4){
              useRawXHR = true;
          }
          else {
              usePromises = true;
          }
        }
        //conditionsF
        //useRawXHR = true;
        //usejQuery = true;
        //usePromises = true;

        for(var j=0; j<dom_targetIds_arr.length; j++){
            dataContainerForRender.push([]);
            finalHTMLContent_arr.push([]);
        }

        if(usejQuery === true){
          nonPromise = true;
          console.log('usejQuery: ', usejQuery);
          jQuery_Ajax.get(url, XHR_useFirstData);
        }
        // +++++ jQuery Require Query +++++ //
        if(useRawXHR === true){
          nonPromise = true;
          console.log('useRawXHR: ', useRawXHR);
          nonPromiseXHR.get(url, XHR_useFirstData);
        }

        if(usePromises === true){
          console.log('usePromises: ', usePromises);
          promiseXHRfirst_start(url);
        }

        console.log('finalHTMLContent_arr.len', finalHTMLContent_arr.length);
      //end of init
      };
    //expose AjaxPageApp.setData_var = false;
    //globalQuery var
    return public;

    // +++++ commonUtil XHR fns +++++ //

    function firstXHR_startReqRenderAndProceed(url_f){
      //console.log('dom_targetIds_arr: ', dom_targetIds_arr);
      //console.log('finalHTMLContent_arr inside firstXHR: ', finalHTMLContent_arr);
      if(useRawXHR === true){
          console.log('running useRawXHR.get');
          nonPromiseXHR.get(url_f, XHR_useFirstData);
      }

      if(usejQuery === true){
        //console.log('define nonPromise xhr method');
        console.log('running jQuery_Ajax');
        jQuery_Ajax.get(url_f, XHR_useFirstData);
      }

      if(usePromises=== true){
          promiseXHRfirst_start(url);
      }
    }


    function promiseXHRfirst_start(url) {
      //use rsvp
      console.log('running promise based first xhr');
      getJSON(url)
      //axios.get(url)
      .then(function(json) {
        //console.log('rsvp data: ', json);
        XHR_useFirstData(json);
      })
      .catch(function(error) {
        console.log('error in promiseXHRfirst_start: ', error);
      });
    }

    function XHR_useFirstData(response){
      var data = response;
      console.log(typeof data);
      if(useRawXHR === true || (isIE_Browser && isIE_Browser > 0) || isWindowsPhone || isAndroidV4){
          data = JSON.parse(response);
      }
      //console.log('data firstData: ', data);
      len_offerData = data.length;
      //console.log('len_offerData wtf: ', len_offerData);
      var firstData_arr_injected = inject_dataContainer(data, firstData_arr);

      //send secondRequest

      if (pogIdList_arr.length < 1) {
        console.log('no pogIds found, let us run render');
        //createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
        inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, firstData_arr, dataContainerForRender);
        checkResolved_Run_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
        return;

      } else {
        //codepenUrl
        var Url_secondRequest = getUrl_secondRequest();
        //jQueryAjax
        if(usejQuery === true){
          console.log('running jQuery_Ajax');
          //nonPromiseXHR.get(Url_secondRequest, nonPromiseXHR_useSecondData);
          jQuery_Ajax.get(Url_secondRequest, nonPromiseXHR_useSecondData);
        }
        //PromiseRender Method
        if(usePromises === true){
          inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, firstData_arr, dataContainerForRender);
          checkResolved_Run_multiRender_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
        }
        //rawXHR
        if(useRawXHR === true){
          console.log('running nonPromiseXHR.get');
          nonPromiseXHR.get(Url_secondRequest, nonPromiseXHR_useSecondData);
        }

      }


    }

    function inject_dataContainer(data, dataContainer){
        //console.log(typeof data);
        //console.log('data inside inject_dataContainer len: ', data.length);
        data.forEach(function (item) {
          //update nonPromise_firstHTMLContent_arr to use nonPromise_firstHTMLContent_arr.length
          for(var i=0; i< dom_targetIds_arr.length; i++){
            if(item.categoryName == dom_targetIds_arr[i]){
              nonPromise_firstHTMLContent_arr.push(i);
            }
          }
          //update pogIdList_arr
          _update_pogIdList_arr(item, pogIdList_arr);

          //createTimerOptions
          checkCreateAllTimerOptions(data);
          dataContainer.push(item);
        });

        /*
        if(dataContainer.length == len_offerData){
          return true;
        }
        else {
          setTimeout(function () {
            console.log('keep pushing');
              inject_dataContainer(data, dataContainer);
          }, 10);
        }
        */
    }

    function promiseXHRsecond_start(url) {
      //use rsvp
      console.log('running promise based second xhr');
      //axios.get(url)
      getJSON(url)
      .then(function(json) {
        //console.log('rsvp second data: ', json);
        nonPromiseXHR_useSecondData(json);
      })
      .catch(function(error) {
        console.log('error in promiseXHRsecond_start');
      });
    }

    function nonPromiseXHR_useSecondData(response){
      //var data = (response.data);
      //console.log('nonPromiseXHR_useSecondData wtf running!');
      var data = (response);
      /*
      if(nonPromise === true || (isIE_Browser && isIE_Browser > 0)){
          data = JSON.parse(response);
      }
      */
      if(useRawXHR === true || (isIE_Browser && isIE_Browser > 0) || isWindowsPhone || isAndroidV4){
          data = JSON.parse(response);
          console.log('data2 type: ', typeof data);
          //androidLogs
          //isAndroid_data01.innerHTML = 'data2 type: ' + (typeof data);
      }
      //console.log('inside nonPromiseXHR_useSecondData: ', typeof data);
      //console.log('data from nonPromiseXHR_useSecondData: ', data);
      update_injectedfirstData_arr(data, firstData_arr, secondData_arr);

      checkResolved_Run_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
    }

    function update_injectedfirstData_arr(data, firstData_arr, secondData_arr) {
          secondData_arr = firstData_arr;
          data.forEach(function (item) {

            //console.log('item.id: ', item.id);
            for(var i =0; i< secondData_arr.length; i++){
              if(item.id == secondData_arr[i].pogId){
                var this_pogId_item = secondData_arr[i];
                //cache secondReq data
                var displayPrice = item.displayPrice;
                var price = item.price;
                var avgRating = item.avgRating;
                var noOfRatings = item.noOfRatings;
                var discount = item.discount;
                var labelUrl = item.labelUrl;
                var sdGold = item.sdGold;
                var soldOut = item.soldOut;

                this_pogId_item.displayPrice = displayPrice;
                this_pogId_item.price = price;
                this_pogId_item.avgRating = avgRating;
                this_pogId_item.noOfRatings = noOfRatings;
                this_pogId_item.discount = discount;
                this_pogId_item.labelUrl = labelUrl;
                this_pogId_item.sdGold = sdGold;
                this_pogId_item.soldOut = soldOut;
                //console.log('matching this_pogId_item: ', this_pogId_item);
              }
            }
          });
          //console.log('dom_targetIds_arr: ', dom_targetIds_arr);
          inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, secondData_arr, dataContainerForRender);
    }

    function inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, secondData_arr, dataContainerForRender) {
      //console.log('inject_dataContainerForRender_by_categoryNames running');
      secondData_arr.forEach(function (item) {
            //console.log('item: ', item);
            for(var i=0; i<dom_targetIds_arr.length; i++){
              var this_categoryName = dom_targetIds_arr[i];
              if(item.categoryName == this_categoryName){
                  dataContainerForRender[i].push(item);
              }
            }
      });
    }

    function checkResolved_Run_createTemplatesSetHTML_byCategoryNames(){
      if(Resolved_inject_dataContainerForRender_by_categoryNames(dataContainerForRender)){
          console.log('Resolved');
          //console.log('updated secondData_arr: ', secondData_arr);
          //console.log('dataContainerForRender: ', dataContainerForRender);
          //console.log('finalHTMLContent_arr inside checkResolved: ', finalHTMLContent_arr);
          createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
      }
    }

    function checkResolved_Run_multiRender_createTemplatesSetHTML_byCategoryNames(){
      if(Resolved_inject_dataContainerForRender_by_categoryNames(dataContainerForRender)){
          console.log('Resolved');
          multiRender_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
      }
    }

    function Resolved_inject_dataContainerForRender_by_categoryNames(dataContainerForRender){
      return function checkResolve_dataInjection(dataContainerForRender) {
        dataContainerForRender.forEach(function(inner_arr, index, arr){
          //console.log('inner_arr: ', inner_arr);
          if(count == nonPromise_firstHTMLContent_arr.length){
            return true;
          }
          else {
            for(var i=0; i< inner_arr.length; i++){
              count++;
              console.log('increasing count: ', count);
            }
          }
        });
      };
    }

    function _update_pogIdList_arr(item, pogIdList_arr) {
        if(item.pogId){
          pogIdList_arr.push(item.pogId);
        }
      }

    function checkCreateAllTimerOptions(data){
      //console.log('checkCreateAllTimerOptions running!');
      if(TimerOffer !== false) {
          console.log('TimerOffers true');
          TimerX99.create_all_timerOptions(data);
      }
    }

    function createTemplatesSetHTML_byCategoryNames(dataContainerForRender) {
      //console.log('createTemplatesSetHTML_byCategoryNames running!!!');
      //console.log('dataContainerForRender inside setHTML: ', dataContainerForRender);
      //console.log('finalHTMLContent_arr before: ', finalHTMLContent_arr);

      dataContainerForRender.forEach(function (this_innerArr, index, arr) {
        //console.log('this_innerArr: ', this_innerArr);
        if (!this_innerArr[0]) {
          console.log('this_innerArr[] ' + index + ' is undefined || not found in data');
          return false;
        }
        var categoryName = this_innerArr[0].categoryName;
        this_innerArr[0].categoryName = this_innerArr[0].categoryName ? this_innerArr[0].categoryName : 'undefined';

        //unit_htmlContent for a categoryName
        var unit_htmlContentBy_categoryName = this_innerArr.map(function(item) {

          //if soldOut
          if(item.soldOut === true){
            if(showSoldOut_g !== true){
              console.log(item.pogId, ' was soldOut, do not render ~ let us return!');
              return ;
            }
          }

          //console.log('item inside unit_htmlContentBy_categoryName: ', item[0]);
          // +++++ templateConditionsX99 +++++ //

            // +++++ DOD templates +++++ //
              if (categoryName.indexOf('BannerX99') > -1) {
                //console.log('Banner_item: ', item);
                return setHTML_BannerX99(item);
              }

              else if (categoryName.indexOf('superDod') > -1) {
                return setHTML_superDod(item);
              }
              else if (categoryName.indexOf('reason') > -1) {
                return setHTML_reason(item);
              }

            // +++++ /DOD templates +++++ //

            // +++++ Additional+timer+quickLinks templates +++++ //

              else if (categoryName.indexOf('liveTimerOffer') > -1) {
                return setHTML_liveTimerOffer(item);
              }
              else if (categoryName.indexOf('upcomingOffer') > -1) {
                return setHTML_upcomingOffer(item);
              }
              else if (categoryName.indexOf('featureDeals') > -1) {
                return setHTML_featureDeals(item);
              }
              else if (categoryName.indexOf('bestOfBrands') > -1) {
                return setHTML_bestOfBrands(item);
              }
              else if (categoryName.indexOf('quickLinksWithTagline') > -1) {
                return setHTML_quickLinksWithTagline(item);
              }
              else if (categoryName.indexOf('quickLinksImages') > -1) {
                return setHTML_quickLinksImages(item);
              }

            // +++++ /Additional+timer+quickLinks templates +++++ //

            // +++++ Filter Based templates +++++ //

              else if (categoryName.indexOf('filterX99') > -1) {
                return setHTML_filterX99(item);
              }

            // +++++ Filter Based templates +++++ //

          else if (categoryName.indexOf('vwAll') > -1) {
            return setHTML_vwAll(item);
          }
          else {
              return setHTML_defaultOfferLiUnit(item);
          }
        // +++++ /templateConditionsX99 +++++ //
        }).join('');

        finalHTMLContent_arr[index].push(unit_htmlContentBy_categoryName);

      });

      //console.log('finalHTMLContent_arr after: ', finalHTMLContent_arr);
      if(nonPromise === true){
        for (var i = 0; i < finalHTMLContent_arr.length; i++) {
          var wrapper_dom = document.getElementById(dom_categoryNames_arr[i]);
          wrapper_dom.innerHTML = finalHTMLContent_arr[i].join('');
        }
      }
      else {
        console.log('run fastdom setHTML');
        fastdom.mutate(function() {
         for (var i = 0; i < finalHTMLContent_arr.length; i++) {
           var wrapper_dom = document.getElementById(dom_categoryNames_arr[i]);
           wrapper_dom.innerHTML = finalHTMLContent_arr[i].join('');
         }
       });
      }
    }

    function multiRender_createTemplatesSetHTML_byCategoryNames(dataContainerForRender) {
      //console.log('first multiRender_createTemplatesSetHTML_byCategoryNames running!!!');
      console.log('dataContainerForRender inside setHTML: ', dataContainerForRender);
      dataContainerForRender.forEach(function (this_innerArr, index, arr) {
        if (!this_innerArr[0]) {
          console.log('this_innerArr[] ' + index + ' is undefined || not found in data');
          return false;
        }
        var categoryName = this_innerArr[0].categoryName;
        this_innerArr[0].categoryName = this_innerArr[0].categoryName ? this_innerArr[0].categoryName : 'undefined';

        //unit_htmlContent for a categoryName
        var unit_htmlContentBy_categoryName = this_innerArr.map(function(item) {

          //console.log('item inside unit_htmlContentBy_categoryName: ', item[0]);
          // +++++ templateConditionsX99 +++++ //

            // +++++ DOD templates +++++ //
              if (categoryName.indexOf('BannerX99') > -1) {
                //console.log('Banner_item: ', item);
                return setHTML_BannerX99(item);
              }

              else if (categoryName.indexOf('superDod') > -1) {
                return setHTML_superDod(item);
              }
              else if (categoryName.indexOf('reason') > -1) {
                return setHTML_reason(item);
              }

            // +++++ /DOD templates +++++ //

            // +++++ Additional+timer+quickLinks templates +++++ //

              else if (categoryName.indexOf('liveTimerOffer') > -1) {
                return setHTML_liveTimerOffer(item);
              }
              else if (categoryName.indexOf('upcomingOffer') > -1) {
                return setHTML_upcomingOffer(item);
              }
              else if (categoryName.indexOf('featureDeals') > -1) {
                return setHTML_featureDeals(item);
              }
              else if (categoryName.indexOf('bestOfBrands') > -1) {
                return setHTML_bestOfBrands(item);
              }
              else if (categoryName.indexOf('quickLinksWithTagline') > -1) {
                return setHTML_quickLinksWithTagline(item);
              }
              else if (categoryName.indexOf('quickLinksImages') > -1) {
                return setHTML_quickLinksImages(item);
              }

            // +++++ /Additional+timer+quickLinks templates +++++ //

            // +++++ Filter Based templates +++++ //

              else if (categoryName.indexOf('filterX99') > -1) {
                return setHTML_filterX99(item);
              }

            // +++++ Filter Based templates +++++ //

          else if (categoryName.indexOf('vwAll') > -1) {
            return setHTML_vwAll(item);
          }
          else {
              return setHTML_defaultOfferLiUnit(item);
          }
        // +++++ /templateConditionsX99 +++++ //
        }).join('');

      finalHTMLContent_arr[index].push(unit_htmlContentBy_categoryName);

      //myFastdom_setHTML_MultipleRender();
      });

      //console.log('finalHTMLContent_arr: ', finalHTMLContent_arr);

      XHR_fastDomPromiseReqRender();

        function XHR_fastDomPromiseReqRender() {
              console.log('XHR_fastDomPromiseReqRender running');
              //setFirstRender
              myFastdom.mutate(function() {
                for (var i = 0; i < finalHTMLContent_arr.length; i++) {
                  var wrapper_dom = document.getElementById(dom_categoryNames_arr[i]);
                  wrapper_dom.innerHTML = finalHTMLContent_arr[i].join('');
                }
              })
              //first then ~ fastdom
              .then(function() {
                console.log('first fastdom.mutate setHTML completed!');
                //init blazy
                var blazy = new Blazy({
                  loadInvisible: true
                });


                if (pogIdList_arr.length < 1) {
                  console.log('no pogIds found!');
                  return;
                } else {
                  var Url_secondRequest = getUrl_secondRequest();
                  //return axios.get(Url_secondRequest);
                  return getJSON(Url_secondRequest);
                }
              })
              //second then ~ fastdom
              .then(function(second_response) {
                //var second_data = second_response.data;
                var second_data = second_response;
                //console.log('data from second req re: ', second_data);
                //console.log('typeof second_data: ', typeof second_data);
                if((isIE_Browser && isIE_Browser > 0) || isWindowsPhone || isAndroidV4){
                    second_data = JSON.parse(second_response);
                }
                //console.log('typeof second_data: ', typeof second_data);

                second_data.forEach(function(item) {
                  var pogId = item.id;
                  var append_target = 'i_' + pogId;
                  setHTMLContentAll_fastdomPromised(append_target, item);
                });

              })
              //third then ~ fastdom
              .then(function(second_data) {
                console.log('second fastdom.mutate setHTML completed!');
              })
              .catch(function(err) {
                console.log('error in fastdom setHTML: ', err);
              });
            }
    }
    // +++++ /commonUtil XHR fns +++++ //

  //end of AjaxPageApp
})();

// +++++ setTemplatesByIds +++++ //
//BannerX99
function setHTML_BannerX99(item) {
  return ('<li class="BannerX99_unit responsiveFontSizeX99 pad06_vertical ">' +
            setHTML_offerUnit_href(item) +
              setHTML_offerUnit_imgWrapOnly(item) +
            setHTML_offerUnit_href_closing(item) +
          '</li>');
}
//superDod
function setHTML_superDod(item) {
  return ('<div class="dodSuperDeal_unit   ' + setClassName_categoryName(item) + '"' + setID_pogId(item) + '>' +
    setHTML_offerUnit_innerContWrap(item) +
      set_SoldOUt_ModuleX99_mod(item) +
      setHTML_offerUnit_href(item) +
      setHTML_offerUnit_href_afterWrap() +
          setHTML_offerUnit_nonImgContWrap() +
            setHTML_wrapCenterCont() +
              setHTML_centeredContX() +
                setHTML_offerUnit_discountWrap(item) +
                setHTML_offerUnit_title(item) +
                setHTML_offerUnit_ratingWrap(item) +
                setHTML_offerUnit_priceTaglineWrap_rel_mod(item) +
              setHTML_centeredContX_closing() +
            setHTML_wrapCenterCont_closing() +
          setHTML_offerUnit_nonImgContWrap_closing() +
          setHTML_offerUnit_offerImageOnly(item) +
      setHTML_offerUnit_href_afterWrap_closing() +
      setHTML_offerUnit_href_closing(item) +
    setHTML_offerUnit_innerContWrap_closing() +
       '</div>');
}
//reason
function setHTML_reason(item) {
  //console.log('setHTML_reason running!');
  return ('<li class="reason_unit responsiveFontSizeX99 ' + setClassName_categoryName(item) + '">' +
    setHTML_reasonsToBuy_tagline(item) +
  '</li>');
}
//defaultOfferLiUnit
function setHTML_defaultOfferLiUnit(item) {
  //console.log('setHTML_defaultOfferLiUnit running!');
  return ('<li class=" OffersContentBoxLi ' + setClassName_categoryName(item) + ' ' + setClassName_filterTag(item) + '"' + setID_pogId(item) +'>' +
    setHTML_offerUnit_innerContWrap(item) +
      set_SoldOUt_ModuleX99_mod(item) +
      setHTML_offerUnit_href(item) +
        setHTML_offerUnit_href_afterWrap() +
          setHTML_offerUnit_offerImageOnly(item) +
            setHTML_offerUnit_nonImgContWrap() +
                  setHTML_offerUnit_title(item) +
                  setHTML_offerUnit_priceTaglineDiscountWrap_rel(item) +
                  setHTML_offerUnit_ratingWrap(item) +
                  //saveAmt
                  setHTML_wrap_saveAmt(item) +
                setHTML_offerUnit_nonImgContWrap_closing() +
        setHTML_offerUnit_href_afterWrap_closing() +
      setHTML_offerUnit_href_closing(item) +
    setHTML_offerUnit_innerContWrap_closing() +
    '</li>');
}

// +++++ new Additions +++++ //

//liveTimerOffer
function setHTML_liveTimerOffer(item) {
  return ('<div class="liveTimerOffers responsiveFontSizeX99 ' + setClassName_categoryName(item) + '"' +'>' +
             setHTML_offerUnit_innerContWrap(item) +
              set_SoldOUt_ModuleX99_mod(item) +
              setHTML_offerUnit_href(item) +
                setHTML_offerUnit_href_afterWrap() +
                  setHTML_offerUnit_offerImageOnly(item) +
                    setHTML_offerUnit_nonImgContWrap() +
                          setHTML_offerUnit_title(item) +
                          setHTML_offerUnit_priceTaglineDiscountWrap_rel(item) +
                          setHTML_offerUnit_ratingWrap(item) +
                          //saveAmt
                          setHTML_wrap_saveAmt(item) +
                        setHTML_offerUnit_nonImgContWrap_closing() +
                setHTML_offerUnit_href_afterWrap_closing() +
              setHTML_offerUnit_href_closing(item) +
            setHTML_offerUnit_innerContWrap_closing() +
             '</div>');
}

//upcomingOffer
function setHTML_upcomingOffer(item) {
  return ('<div class="offerUnit_offerWrap responsiveFontSizeX99 ' + setClassName_categoryName(item) + '"' +'>' +
                  setHTML_offerUnit_href_afterWrap() +
                    setHTML_offerUnit_offerImageOnly(item) +
                    setHTML_offerUnit_nonImgContWrap() +
                      setHTML_offerUpcoming_upcoming() +
                      setHTML_offerUnit_title(item) +
                    setHTML_offerUnit_nonImgContWrap_closing() +
                  setHTML_offerUnit_href_afterWrap_closing() +
         '</div>');
}

//featureDeals
function setHTML_featureDeals(item) {
  return ('<div class="liveTimerOffers responsiveFontSizeX99 ' + setClassName_categoryName(item) + '"' +'>' +
          setHTML_offerUnit_innerContWrap(item) +
            set_SoldOUt_ModuleX99_mod(item) +
            setHTML_offerUnit_href(item) +
                setHTML_offerUnit_offerImageOnly(item) +
                setHTML_offerUnit_nonImgContWrap() +
                  setHTML_offerUnit_discountWrap_mod(item) +
                  setHTML_offerUnit_title(item) +
                  setHTML_offerUnit_ratingWrap_mod(item) +
                  setHTML_offerUnit_priceTaglineWrap_rel_mod(item) +
                setHTML_offerUnit_nonImgContWrap_closing() +
            setHTML_offerUnit_href_closing(item) +
          setHTML_offerUnit_innerContWrap_closing() +
           '</div>');
}

//bestOfBrands
function setHTML_bestOfBrands(item) {
  return ('<li class="offerUnits_4_2 offerUnit_normalOffer hoverStyleX99 responsiveFontSizeX99 ' + setClassName_categoryName(item) + '"' +'>' +
          setHTML_offerUnit_innerContWrap(item) +
              set_SoldOUt_ModuleX99_mod(item) +
                setHTML_offerUnit_href(item) +
                  setHTML_offerUnit_href_afterWrap()+
                    setHTML_offerUnit_offerImageOnly(item) +
                    setHTML_offerUnit_nonImgContWrap() +
                          setHTML_offerUnit_priceTaglineWrap_rel(item) +
                    setHTML_offerUnit_nonImgContWrap_closing() +
                  setHTML_offerUnit_href_afterWrap_closing() +
                setHTML_offerUnit_href_closing(item) +
            setHTML_offerUnit_innerContWrap_closing() +
             '</li>');
}

//quickLinks
function setHTML_quickLinksWithTagline(item) {
  return ('<li class="offerUnits_4_2 offerUnit_normalOffer responsiveFontSizeX99 hoverStyleX99 ' + setClassName_categoryName(item) + '"' +'>' +
              setHTML_offerUnit_href(item) +
                        setHTML_QuickLinkOffers_tagline(item)+
              setHTML_offerUnit_href_closing(item) +
           '</li>');
}

//quickLinksImages
function setHTML_quickLinksImages(item) {
  return ('<li class="offerUnits_4_2 offerUnit_normalOffer responsiveFontSizeX99 hoverStyleX99 ' + setClassName_categoryName(item) + '"' +'>' +
              setHTML_offerUnit_href(item) +
                        //setHTML_offerUnit_offerImageOnly(item) +
                        setHTML_offerUnit_nonFixed_offerImageOnly(item) +
              setHTML_offerUnit_href_closing(item) +
           '</li>');
}

//vwAll
function setHTML_vwAll(item) {
  return ('<div class="offerUnit_vwAll_abs  ' + setClassName_categoryName(item) + '"' + '>' +
              setHTML_offerUnit_href(item) +
                "View All" +
              setHTML_offerUnit_href_closing(item) +
          '</div>');
}

//filterX99
function setHTML_filterX99(item) {
  //console.log('setHTML_filterX99 running');
  return ('<li class=" OffersContentBoxLi ' + setClassName_categoryName(item) + ' ' + setClassName_filterTag(item) + '"' + setID_pogId(item) +'>' +
              setHTML_offerUnit_innerContWrap(item) +
                set_SoldOUt_ModuleX99_mod(item) +
                setHTML_offerUnit_href(item) +
                  setHTML_offerUnit_href_afterWrap() +
                    setHTML_offerUnit_offerImageOnly(item) +
                      setHTML_offerUnit_nonImgContWrap() +
                            setHTML_offerUnit_title(item) +
                            setHTML_offerUnit_priceTaglineDiscountWrap_rel(item) +
                            setHTML_offerUnit_ratingWrap(item) +
                            //saveAmt
                            setHTML_wrap_saveAmt(item) +
                          setHTML_offerUnit_nonImgContWrap_closing() +
                  setHTML_offerUnit_href_afterWrap_closing() +
                setHTML_offerUnit_href_closing(item) +
              setHTML_offerUnit_innerContWrap_closing() +
          '</li>');
}

// +++++ /setTemplatesByIds +++++ //


// +++++ setHTMLContent +++++ //
function setHTML_fastdom(target, htmlContent){
  if(!target){
    console.log('setHTML_fastdom method: target not found or undefined!');
    return;
  }
  fastdom.mutate(function() {
      target.innerHTML = htmlContent;
    });
}

//price
function setHTMLContent_price(DOM_append_target, item) {
      //data
      var displayPrice = item.displayPrice;
      var price = item.price;
      //dom selectors
      var dom_offerUnit_price =  DOM_append_target.querySelector('.offerUnit_price');
      var dom_offerUnit_displayPrice = DOM_append_target.querySelector('.offerUnit_displayPrice');

      //functions
      var price_html = set_Rs_Price(item);
      var displayPrice_html = set_Rs_displayPrice(item);

      //console.log('item.price: ', item.price);
      //console.log('item.displayPrice: ', item.price);
      //console.log('dom_offerUnit_price: ', dom_offerUnit_price);


      setHTML_fastdom(dom_offerUnit_price, price_html);
      setHTML_fastdom(dom_offerUnit_displayPrice, displayPrice_html);


      if(price == displayPrice || price < displayPrice ){
        if(dom_offerUnit_price){
            dom_offerUnit_price.style.display = 'none';
        }
        if(dom_offerUnit_displayPrice){
            dom_offerUnit_displayPrice.style.float = 'left';
        }
      }

  }

//discount
function setHTMLContent_discount(DOM_append_target, item) {
      //console.log('setHTMLContent_discount running!');
      //data
      var discount = item.discount;
      var item_priceSlab;
      var dom_offerUnit_discountWrap = DOM_append_target.querySelector('.offerUnit_discountWrap');
      //console.log('dom_offerUnit_discountWrap: ', dom_offerUnit_discountWrap);

      if(item.priceSlab){
        item_priceSlab = item.priceSlab.toLowerCase();
      }
      if (!discount || discount === null || discount === 0) {
      return  ;
      }
      else {
        var offerUnit_discount = '<div class="offerUnit_discount">' + discount + '% Off </div>';

        if(discount < 10){
           if(updateDiscount_IfMatchX(item) || item_priceSlab=="true"){
              setHTML_fastdom(dom_offerUnit_discountWrap, offerUnit_discount);
           }
           else {
             return ;
           }
         }

         else {
           setHTML_fastdom(dom_offerUnit_discountWrap, offerUnit_discount);
         }
      }

  }

//rating
function setHTMLContent_rating(DOM_append_target, item) {
      //console.log('setHTMLContent_price running!');
      //data
      var rating = item.avgRating;
      var noOfRatingsOrReviews = '';
      if(rating === 0){
        //console.log('avgRating was 0 for: ' + item.id);
        return;
      }
      if(item.noOfReviews){
          noOfRatingsOrReviews = item.noOfReviews;
      }
      else if(item.noOfRatings){
          noOfRatingsOrReviews = item.noOfRatings;
      }

      //dom selectors
      var dom_offerUnit_ratingWrap = DOM_append_target.querySelector('.offerUnit_ratingWrap');

      //functions
      function setRating(item) {
          if (item.avgRating) {
              var val = item.avgRating,
                  val_Stringed = val.toString(),
                  widthFactor = 0,
                  width = 70;
              if (val < 1 || val > 5) {
                  return false;
              }
              widthFactor = ((((val_Stringed / 5) * 100) / 100) * width);
              widthFactor = Math.round(widthFactor * 10) / 10;
              return widthFactor;
          } else {
              return;
          }
      }
      //set data
      var setRating_V = setRating(item);
      //console.log('setRating_V: ', setRating_V);
      var ratingFragments = '<div class="offerUnit_rating_rel"><div class="ratingBG_disabled"></div>' + '<div class="ratingBG_active" style="width:' + setRating_V + 'px;"></div></div>';
      var reviewsFragments = '<span class="numberRevsX">(' + noOfRatingsOrReviews + ')</span>';

      if(rating > 0 || rating !== null){
        if(noOfRatingsOrReviews > 0 || noOfRatingsOrReviews!== null || noOfRatingsOrReviews!==''){
            var rating_reviews_html = ratingFragments + reviewsFragments;
            setHTML_fastdom(dom_offerUnit_ratingWrap, rating_reviews_html);
        }
        else {
            setHTML_fastdom(dom_offerUnit_ratingWrap, ratingFragments);
        }
      }
  }

//saveAmt
function setHTMLContent_saveAmt(DOM_append_target, item) {
    //console.log('setHTMLContent_saveAmt is running!');
    var dom_offerUnit_discountWrap = DOM_append_target.querySelector('.wrap_saveAmt');

    if(item.price && item.displayPrice){
        var saveAmt = item.price - item.displayPrice;
        var saveAmt_html = 'You save Rs. ' + '<span>' + saveAmt + '</span>';
        if(saveAmt > 0){
          setHTML_fastdom(dom_offerUnit_discountWrap, saveAmt_html);
        }
        else {
          return;
        }
    }
    else {
      return;
    }

}

//sdGold
function setHTMLContent_sdGold(DOM_append_target, item) {
    //console.log('setHTMLContent_sdGold is running!');
    var dom_offerUnit_imgWrap_sdPlusInc_rel = DOM_append_target.querySelector('.offerUnit_imgWrap_sdPlusInc_rel');
    //console.log('dom_offerUnit_imgWrap_sdPlusInc_rel: ', dom_offerUnit_imgWrap_sdPlusInc_rel);

    if(item.sdGold === true){
      //console.log('sdGold is true for: ', item.id);
      var sdElem = document.createElement('div');
          sdElem.setAttribute('class', 'offerUnit_sdPlusWrap_abs');
          dom_offerUnit_imgWrap_sdPlusInc_rel.appendChild(sdElem);
    }
    else {
      return;
    }

}

//ignore JSHint Error
function setHTMLContent_soldOut(DOM_append_target, item) {
  //console.log('showSoldOut_g inside setHTMLContent_soldOut: ', showSoldOut_g);
  var dom_offerUnit_Soldout = DOM_append_target.querySelector('.offerUnit_Soldout');
  var dom_offerUnit_href = DOM_append_target.querySelector('offerUnit_href');
  var id_parent_offerUnit = item.id;
  var dom_id_parent_offerUnit = document.getElementById(id_parent_offerUnit);

  if(showSoldOut_g === true){
    // +++++ show soldOut if soldOut +++++ //
    if(item.soldOut === true){
      //disable hoverStyleX99 && set soldOutX99
      if(dom_id_parent_offerUnit){
        dom_id_parent_offerUnit.classList.remove('hoverStyleX99');
        dom_id_parent_offerUnit.classList.add('soldOutX99');
      }
      //show soldOut
      if(dom_offerUnit_Soldout){
          dom_offerUnit_Soldout.style.display = 'block';
      }
      else {
        console.log('.offerUnit_Soldout not found for ' + item.id);
      }
    }
    // +++++ /show soldOut if soldOut +++++ //
  }
  else {
    if (item.soldOut === true) {
      // +++++ removeSoldOutParentUnit +++++ //
      if (dom_id_parent_offerUnit) {
        dom_id_parent_offerUnit.parentNode.removeChild(dom_id_parent_offerUnit);
      }
      //console.log(item.id + ' was sold out');
      //if dod
      if (document.getElementsByClassName('superDeals_centered')) {
          var dom_superDeals_centered = document.getElementsByClassName('superDeals_centered');
          for (var i = 0; i < dom_superDeals_centered.length; i++) {
              var this_dom_superDeals_centered = dom_superDeals_centered[i];
              //element.children.length > 0
              if (this_dom_superDeals_centered.children.length < 1) {
                  console.log('no child elements found!');
                  //var parentOfThisEmptyOne = this_dom_superDeals_centered
                  var parentOfThisEmptyOne = getClick_targetClass_elem(this_dom_superDeals_centered, 'dodSuperDealUnit_ev');
                  //console.log('parentOfThisEmptyOne was found and removed: ', parentOfThisEmptyOne);
                  parentOfThisEmptyOne.parentNode.removeChild(parentOfThisEmptyOne);
                  if (!parentOfThisEmptyOne || parentOfThisEmptyOne === null) {
                      console.log('parentOfThisEmptyOne not found: ', parentOfThisEmptyOne);
                      return;
                  }
              }
          }
      }
      // +++++ /removeSoldOutParentUnit +++++ //
    }
  }


}

function setHTMLContentAll_fastdomPromised(append_target, item) {
  //console.log('setHTMLContentAll_fastdomPromised running!');
  var DOM_append_target = document.getElementById(append_target);

  //console.log('DOM_append_target: ', DOM_append_target);
  if(!DOM_append_target || DOM_append_target == 'null'){
    console.log('DOM_append_target was not found, check to ensure templates are correctly defined!');
    return;
  }
    //settingRender
    setHTMLContent_price(DOM_append_target, item);
    setHTMLContent_discount(DOM_append_target, item);
    setHTMLContent_rating(DOM_append_target, item);
    setHTMLContent_saveAmt(DOM_append_target, item);
    setHTMLContent_sdGold(DOM_append_target, item);
    setHTMLContent_soldOut(DOM_append_target, item);
}
// +++++ /setHTMLContent +++++ //


/// +++++ start csv fragmentTemplates utilities csvFragX99 +++++ ///

function getClick_targetClass_elem(elem, targetClass) {
      if (elem.classList.contains(targetClass)) {
          return elem;
      } else {
          return findParentWithClassX99(elem, targetClass);
      }
  }

function findParentWithClassX99(el, cls) {
  while ((el = el.parentElement) && !el.classList.contains(cls));
  return el;
}

function getUrl_secondRequest(){
  // +++ create the url
    if(GetInner_.firstURL.indexOf('.json') < 0)
    {
      //push an extry empty string to ensure last pogId is ALWAYS rendered
      //console.log('live');
      pogIdList_arr.push(' ');
    }
    //join all pogIds
    var all_pogIds = pogIdList_arr.join(',');
    //second request Url
    var url;
    // if not local
    if(GetInner_.firstURL.indexOf('.json') < 0){
        //old
        //url = (window.admin && window.admin == 'true' ? '/admin' : '') + '/json/getProductById?pogIds=' + all_pogIds;
        url = (window.admin && window.admin == 'true' ? '/admin' : '') + '/acors/json/getProductById?pogIds=' + all_pogIds;
    }
    //if local
    else {
        var preventCache = Date.now();
        url = "../csvData_2_" + pogIdList_arr + ".json" + '?queryTime=' + preventCache;
    }
  /// +++ /create the url
  return url;
}

//ignore JSHint Error
function setHTML_offerUnit_innerContWrap(item) {
  //console.log('setHTML_offerUnit_innerContWrap is running!');
  if(item.pogId && item.pogId != ''|| item.pogId !== null && item.pogId != ''){
    //set i_pogId as id
    var i_pogId = 'i_' + item.pogId;
    return '<div class="offerUnit_innerContWrap" id="' + i_pogId + '">';
  }
  else {
    //console.log('not pogId');
    return '<div class="offerUnit_innerContWrap ">';
  }
}

function setHTML_offerUnit_innerContWrap_closing() {
  return '</div>';
}

function setClassName_categoryName(item) {
 if(item.categoryName){
    return item.categoryName;
  }
  else {
    return '';
  }
}

function setClassName_filterTag(item) {
 if(item.highlights){
    return item.highlights;
  }
  else {
    return '';
  }
}

function setID_pogId(item) {
  //console.log('setID_pogId running');
  if(item.pogId === null || !item.pogId){
    //console.log('pogId not found, do not run setID_pogId!');
    return '';
  }
  else if(item.pogId){
    //console.log('running setID_pogId');
    //console.log('item.pogId: ', item.pogId);
    return ('id="' + item.pogId + '"');
  }
  else {
    return '';
  }
}

function setHTML_offerUpcoming_upcoming() {
    return ('<div class="offerUpcoming_upcoming"> upcoming deal </div>');
}
//setHTML_reasonsToBuy_tagline
function setHTML_reasonsToBuy_tagline(item) {
    return '<div class="reasonsToBuy_tagline">' + item.tagLine + '</div>';
}
//setHTML_QuickLinkOffers_tagline
function setHTML_QuickLinkOffers_tagline(item) {
    return '<div class="QuickLinkOffers_tagline">' + item.tagLine + '</div>';
}
//*taglineRating Module
function setHTML_offerUnit_priceTaglineWrap_rel_mod(item) {
    //console.log('setHTML_offerUnit_priceTaglineWrap_rel_mod for dod is running!');
    var offerUnit_priceTaglineWrap_rel = '<div class="offerUnit_priceTaglineWrap_rel">';
    var tagLineFragments = '<div class="offerUnit_taglineWrap"><div class="offerUnit_tagline">' + item.tagLine + '</div></div>';
    /*var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll">Rs.' + '<span class="offerUnit_price">' + item._price + '</span>&nbsp; &nbsp;</span>' + '<span class="offerUnit_displayPrice"><span>Rs.&nbsp;</span>' + item._displayPrice + '</span>' + '</div>';*/
    var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_price">' + set_Rs_Price(item) + '</span>' + '<span class="offerUnit_displayPrice">' + set_Rs_displayPrice(item) + '</span></span>' + '</div>';
    var displayPriceOnlyFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_displayPrice">' + set_Rs_displayPrice(item) + '</span></span>' + '</div>';

    function priceOrTagline_dom(item) {
        if(!item.pogId){
          //console.log('pogId not defined!');
          if(item.tagLine){
            return (offerUnit_priceTaglineWrap_rel + tagLineFragments + '</div>');
          }
          else {
            return (offerUnit_priceTaglineWrap_rel + '</div>');
          }
        }
        else {
          return (offerUnit_priceTaglineWrap_rel + priceContXFragments + '</div>');
        }
    }
    return priceOrTagline_dom(item); //
}

function set_Rs_Price(item) {
  //console.log('set_Rs_Price running!');
    if(!item){
      return '';
    }
    if(item.price){
      //console.log('item.price: ', item.price);
      if(item.price === 'null'){
        console.log(item.pogId, ': has price as null');
        return '';
      }

      return  'Rs. ' + item.price;
    }
    else {
      return '';
    }
}

function set_Rs_displayPrice(item) {
  //console.log('set_Rs_displayPrice running!');
    if(!item){
      return '';
    }
    if(item.displayPrice){
      //console.log('item.displayPrice: ', item.displayPrice);
      if(item.displayPrice === 'null'){
        console.log(item.pogId, ': has price as null');
        return '';
      }

      return  'Rs. ' + item.displayPrice;
    }
    else {
      return '';
    }
}


//this is faulty fuck
function setHTML_offerUnit_priceTaglineDiscountWrap_rel_mod(item) {
  //console.log('setHTML_offerUnit_priceTaglineWrap_rel_mod is running!');
    var OfferDiscount_Wrap = '<div class="offerUnit_discountWrap"></div>';
    var offerUnit_priceTaglineWrap_rel = '<div class="offerUnit_priceTaglineWrap_rel">';
    var tagLineFragments = '<div class="offerUnit_taglineWrap"><div class="offerUnit_tagline">' + item.tagLine + '</div></div>';
    /*var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll">Rs.' + '<span class="offerUnit_price">' + item._price + '</span>&nbsp; &nbsp;</span>' + '<span class="offerUnit_displayPrice"><span>Rs.&nbsp;</span>' + item._displayPrice + '</span>' + '</div>';*/
    var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_price">' + '</span>' + '<span class="offerUnit_displayPrice">' +'</span></span>' + '</div>';
    var displayPriceOnlyFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_displayPrice">' + '</span></span>' + '</div>';

    function priceOrTagline_dom(item) {
        if(!item.pogId){
          //console.log('pogId not defined!');
          if(item.tagLine){
            return (offerUnit_priceTaglineWrap_rel + tagLineFragments + '</div>');
          }
          else {
            return (offerUnit_priceTaglineWrap_rel + '</div>');
          }
        }
        else {
          return (offerUnit_priceTaglineWrap_rel + priceContXFragments + OfferDiscount_Wrap + '</div>');
        }
    }
    return priceOrTagline_dom(item); //
}

function setHTML_offerUnit_priceTaglineDiscountWrap_rel(item) {
  //console.log('setHTML_offerUnit_priceTaglineDiscountWrap_rel is running!');
    var OfferDiscount_Wrap = '<div class="offerUnit_discountWrap">' + setHTMLContent_offerUnit_discount_nonPromise(item) + '</div>';
    var offerUnit_priceTaglineWrap_rel = '<div class="offerUnit_priceTaglineWrap_rel">';
    var tagLineFragments = '<div class="offerUnit_taglineWrap"><div class="offerUnit_tagline">' + item.tagLine + '</div></div>';
    var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_price">' + set_Rs_Price(item) + '</span>' + '<span class="offerUnit_displayPrice">' + set_Rs_displayPrice(item) + '</span></span>' + '</div>';
    var displayPriceOnlyFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_displayPrice">' + set_Rs_displayPrice(item) + '</span></span>' + '</div>';

    var _priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_price">' + '</span>' + '<span class="offerUnit_displayPrice">' +'</span></span>' + '</div>';
    var _displayPriceOnlyFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_displayPrice">' + '</span></span>' + '</div>';
    var  _OfferDiscount_Wrap = '<div class="offerUnit_discountWrap">' + '</div>';

    function setHTMLContent_offerUnit_discount_nonPromise(item) {
      var discount = item.discount;
      var item_priceSlab;

      if(item.priceSlab){
        item_priceSlab = item.priceSlab.toLowerCase();
      }
      if (!discount || discount === null || discount === 0) {
        return  ;
      }
        else {
          var offerUnit_discount = '<div class="offerUnit_discount">' + discount + '% Off </div>';

          if(discount < 10){
             if(updateDiscount_IfMatchX(item) || item_priceSlab=="true"){
                return offerUnit_discount;
             }
             else {
               return '';
             }
           }

           else {
             return offerUnit_discount;
           }
        }

    }

    function priceOrTagline_dom(item) {
        if(!item.pogId){
          //console.log('pogId not defined!');
          if(item.tagLine){
            return (offerUnit_priceTaglineWrap_rel + tagLineFragments + '</div>');
          }
          else {
            return (offerUnit_priceTaglineWrap_rel + '</div>');
          }
        }
        else {
          return (offerUnit_priceTaglineWrap_rel + priceContXFragments + OfferDiscount_Wrap + '</div>');
        }
    }

    function _priceOrTagline_dom(item) {
        if(!item.pogId){
          //console.log('pogId not defined!');
          if(item.tagLine){
            return (offerUnit_priceTaglineWrap_rel + tagLineFragments + '</div>');
          }
          else {
            return (offerUnit_priceTaglineWrap_rel + '</div>');
          }
        }
        else {
          return (offerUnit_priceTaglineWrap_rel + _priceContXFragments + _OfferDiscount_Wrap + '</div>');
        }
    }

    if(nonPromise === true){
        return priceOrTagline_dom(item);
    }
    else {
      return _priceOrTagline_dom(item);
    }

}

//setHTML_wrap_saveAmt
function setHTML_wrap_saveAmt_mod() {
    var wrap_saveAmt = '<div class="wrap_saveAmt"></div>';
    return wrap_saveAmt;
}

function setHTML_wrap_saveAmt(item) {
    var wrap_saveAmt = '<div class="wrap_saveAmt">';
    var wrap_saveAmt_closing = '</div>';
    if (item.displayPrice < item.price) {
        var saveAmt = item.price - item.displayPrice;
        return (wrap_saveAmt + 'You save Rs. ' + '<span>' + saveAmt + '</span>' + wrap_saveAmt_closing);
    } else {
        return (wrap_saveAmt + wrap_saveAmt_closing);
    }
}

function setHTML_offerUnit_href_afterWrap() {
    return '<div class="offerUnit_href_afterWrap">';
}

function setHTML_offerUnit_href_afterWrap_closing() {
    return '</div>';
}

function setHTML_offerUnit_nonImgContWrap() {
    return '<div class="offerUnit_nonImgContWrap">';
}

function setHTML_offerUnit_nonImgContWrap_closing() {
    return '</div>';
}

function setHTML_wrapCenterCont() {
    return '<div class="wrapCenterCont">';
}

function setHTML_wrapCenterCont_closing() {
    return '</div>';
}

function setHTML_centeredContX() {
    return '<div class="centeredContX">';
}

function setHTML_centeredContX_closing() {
    return '</div>';
}
//setImage
function setHTML_offerUnit_offerImageOnly(item) {

    if (!item.offerName || item.offerName === null) {
        item.offerName = '';
    }

    var sdPlusLogo = '<div class="offerUnit_sdPlusWrap_abs"></div>';
    var blazy_img = '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' ;
    var nonLazy_img =  '<img class="offerUnit_img nonLazyX99 OfferImg"' +  'src="'+item.offerImageUrl +'" ' +  'alt="' + item.offerName + '" />';

    if(nonPromise === true){
      if(item.sdGold === true){
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + sdPlusLogo + nonLazy_img + '</div>');
      }
      else {
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + nonLazy_img + '</div>');
      }

      //return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
    }

    else {
      if(item.sdGold === true){
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + sdPlusLogo + blazy_img + '</div>');
      }
      else {
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + blazy_img + '</div>');
      }
    }
}

function setHTML_offerUnit_nonFixed_offerImageOnly(item) {

    if (!item.offerName || item.offerName === null) {
        item.offerName = '';
    }

    var sdPlusLogo = '<div class="offerUnit_sdPlusWrap_abs"></div>';
    var blazy_img = '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />';
    var nonLazy_img = '<img class="offerUnit_img nonLazyX99 OfferImg"' +  'src="'+item.offerImageUrl +'" ' +  'alt="' + item.offerName + '" />';

    if(nonPromise === true){
      if(item.sdGold === true){
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + sdPlusLogo + nonLazy_img + '</div>');
      }
      else {
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + nonLazy_img + '</div>');
      }

      //return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
    }

    else {
      if(item.sdGold === true){
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + sdPlusLogo + blazy_img + '</div>');
      }
      else {
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + blazy_img + '</div>');
      }
    }
}

function setHTML_offerUnit_imgWrap_sdPlusInc_rel(item) {
    if (!item.offerName || item.offerName === null) {
        item.offerName = '';
    }
    if (item._sdGold === true) {
        console.log();
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel"><div class="offerUnit_sdPlusWrap_abs"></div>' + '<img class="offerUnit_img b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
    } else {
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
    }
}

function setHTML_offerUnit_imgWrapOnly(item) {
    if (!item.offerName || item.offerName === null) {
        item.offerName = 'Image';
    }
    if(nonPromise === true){
        return ('<div class="offerUnit_imgWrapOnly">' + '<img class="offerUnit_img nonLazyX99 OfferImg" src="' + item.offerImageUrl + '" alt="' + item.offerName + '" />' + '</div>');
    }
    else {
      return ('<div class="offerUnit_imgWrapOnly">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
    }

}

function setHTML_offerUnit_imgWrapOnly_nonLazy(item) {
    if (!item.offerName || item.offerName === null) {
        item.offerName = 'Image';
    }
    return ('<div class="offerUnit_imgWrapOnly">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
}
//*aLink Module
function setHTML_offerUnit_href(item) {
    if (!item) {
        return;
    }
    var aLink_Wrap = '<a target="_blank" href="' + item.offerPageUrl + '" class="offerUnit_href">';
    if (item.offerPageUrl) {
        return aLink_Wrap;
    } else {
        return '';
    }
}

function setHTML_offerUnit_href_closing(item) {
    if (item.offerPageUrl) {
        return '</a>';
    } else {
        return '';
    }
}
//**title
function setHTML_offerUnit_title(item) {
    return '<div class="offerUnit_title twoLine_TitleX99">' + item.offerName + '</div>';
}
//**rating
function setHTML_offerUnit_ratingWrap_mod() {
    var rating_Wrap = '<div class="offerUnit_ratingWrap"></div>';

    return rating_Wrap; //
    //set_StarRatings_and_Reviews_ModuleX99
}

function setHTML_offerUnit_ratingWrap(item) {
    //console.log('setHTML_offerUnit_ratingWrap running!');
    var ifRatingDefined_dom_V = ifRatingDefined_dom(item);
    var setRating_V = setRating(item);
    var rating_Wrap = '<div class="offerUnit_ratingWrap">';
    var ratingFragments = '<div class="offerUnit_rating_rel"><div class="ratingBG_disabled"></div>' + '<div class="ratingBG_active" style="width:' + setRating_V + 'px;"></div></div>';
    var reviewsFragments = '<span class="numberRevsX">(' + item._noOfReviews + ')</span>';

    function ifRatingDefined_dom(item) {
        if (item.avgRating) {
            //console.log('item.avgRating: ', item.avgRating);
            if (item._noOfReviews) {
                ratingFragments += reviewsFragments;
            }
            return (rating_Wrap + ratingFragments + '</div>');
        } else {
            return (rating_Wrap + '</div>');
        }
    }

    function setRating(item) {
        if (item.avgRating) {
            var val = item.avgRating,
                val_Stringed = val.toString(),
                widthFactor = 0,
                width = 70;
            if (val < 1 || val > 5) {
                return false;
            }
            widthFactor = ((((val_Stringed / 5) * 100) / 100) * width);
            widthFactor = Math.round(widthFactor * 10) / 10;
            return widthFactor;
        } else {
            return;
        }
    }
    if(nonPromise === true){
        return ifRatingDefined_dom(item);
    }
    else {
        return rating_Wrap + '</div>';
    }

     //
    //set_StarRatings_and_Reviews_ModuleX99
}
//**discount
function setHTML_offerUnit_discountWrap_mod() {
    var OfferDiscount_Wrap = '<div class="offerUnit_discountWrap"></div>';
    return OfferDiscount_Wrap;
}

function setHTML_offerUnit_discountWrap(item) {
    var discount = item.discount;
    var OfferDiscount_Wrap = '<div class="offerUnit_discountWrap">';
    var OfferDiscount_Discount_Wrap = '<div class="offerUnit_discount">' + discount + '% Off </div>';
    if (!discount || discount === null) {
        return _hideDiscount();
    }

    function _showDiscount() {
        return (OfferDiscount_Wrap + OfferDiscount_Discount_Wrap + '</div>');
    }

    function _hideDiscount() {
        return (OfferDiscount_Wrap + '</div>');
    }

    function showDiscountUnless0_dom(item) {
        if (discount === 0) {
            return _hideDiscount();
        } else {
            //dod conditional
            return _showDiscount();
        }
    }
    //If labelUrl matches refurbished/mobiles/tablets
    //Or if item.priceSlab == "true"
    function dod_showDiscountUnless0_dom(item) {
        var item_priceSlab = item.priceSlab.toLowerCase();
        if (discount === 0) {
            return _hideDiscount();
        }
        if (discount < 10) {
            if (updateDiscount_IfMatchX(item) || item_priceSlab == "true") {
                return _showDiscount();
            } else {
                return _hideDiscount();
            }
        } else {
            return _showDiscount();
        }
    }

    if(nonPromise=== true){
        return dod_showDiscountUnless0_dom(item);
    }
    else {
        return OfferDiscount_Wrap;
    }
}

function setWrap_offerUnit_discountWrap() {
    var OfferDiscount_Wrapper = '<div class="offerUnit_discountWrap"></div>';
    return OfferDiscount_Wrapper;
}

function updateDiscount_IfMatchX(item) {
    if (!item) {
        return false;
    }
    var labelUrl = item._labelUrl;
    if (!labelUrl) {
        return false;
    }
    if (labelUrl.match(/refurbished|mobiles-mobile-phones|mobiles-tablets/g)) {
        //console.log('found');
        //console.log('labelUrl: ', labelUrl);
        return true;
    } else {
        //console.log('not found!');
    }
}

//**if soldOut

function set_SoldOUt_ModuleX99_mod(item) {
    var soldOut_Wrap = '<div class="offerUnit_Soldout"><div class="offerUnit_Soldout_btn">SOLD OUT</div></div>';
    var soldOut_Wrap_displayOn = '<div class="offerUnit_Soldout" style="display: block;"><div class="offerUnit_Soldout_btn">SOLD OUT</div></div>';
    if(item.pogId){

        if(nonPromise === true){
            if(item.soldOut === true){
              console.log('soldOut item.pogId: ', item.pogId);
              var id_parent_offerUnit = item.pogId;
              var dom_id_parent_offerUnit = document.getElementById(id_parent_offerUnit);
              //console.log('dom_id_parent_offerUnit: ', dom_id_parent_offerUnit);

              if(showSoldOut_g === true){
                  return soldOut_Wrap_displayOn;
              }
              else {
                  //do not render soldOut
                  return '';
              }
            }

            else {
              return '';
            }
        }

        else {
            return soldOut_Wrap;
        }
    }
    else {
      return '';
    }
}
///* * * end csv fragmentTemplates utilities
//end of rest of utilities

// +++++ init ajaxApp +++++ //
/* exposing to Global for inPage use */

window.AjaxPageApp = AjaxPageApp;

},{"./modules/MobPlatform_M":2,"./modules/socialShareX_Module":3,"Blazy":4,"es6-promise":5,"fastdom":6,"rsvp":8}],2:[function(require,module,exports){
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

},{}],3:[function(require,module,exports){
var MobPlatform_M = require('./MobPlatform_M');

var socialShareX_Module = (function() {
    var mainWrapperX99 = document.getElementsByClassName('shareX99_wrapper')[0];
    if(!mainWrapperX99){console.log('.shareX99_wrapper not found'); return ;}
    var ele = mainWrapperX99.querySelectorAll('.shareIconX_icoWrapper li');
    if(!ele){console.log('.shareIconX_icoWrapper not found'); return ;}
    var whatsappX = mainWrapperX99.querySelector('li.whatsappX');
    //check if mobile and show/hide whatsapp
    var mobileSite_TrueX999_var = MobPlatform_M.mobileSite_TrueX999();
    //console.log('mobileSite_running: ' + mobileSite_TrueX999_var);
    if (mobileSite_TrueX999_var) {
        //console.log('mobile site running, show whatsapp');
        if (whatsappX) {
            whatsappX.style.display = 'block';
        }
    } else {
        if (whatsappX) {
            whatsappX.style.display = 'none';
        }
    }
    //var links
    var currURLX = window.location.href;
    var preURLs = {
        'facebookX': 'https://www.facebook.com/sharer.php?u=',
        'twitterX': 'https://twitter.com/intent/tweet?url=',
        'googleplusX': 'https://plus.google.com/share?url=',
        'pinterestX': 'https://pinterest.com/pin/create/bookmarklet/?url=',
        'whatsappX': 'whatsapp://send?text='
    };
    var finalURL = '';
    var data_hashtag = 'data-hashtag';
    var class_unit_socialX99 = 'unit_socialX99';
    //click events
    for (var i = 0; i < ele.length; i++) {
        ele[i].addEventListener('click', function(e) {
            e.preventDefault();
            var finalURL = '',
                ele = e.target;
            ele = getClick_targetClass_elem(e.target, class_unit_socialX99);
            if (!ele || ele === null) {
                console.log('clicked_targetClass_elem not found!');
                return;
            }
            var twHastag = ele.getAttribute(data_hashtag);
            if (ele.classList.contains('facebookX')) {
                finalURL = preURLs.facebookX + currURLX;
            } else if (ele.classList.contains('twitterX')) {
                if (twHastag) {
                    finalURL = preURLs.twitterX + currURLX + '&hashtags=' + twHastag;
                } else {
                    finalURL = preURLs.twitterX + currURLX;
                }
            } else if (ele.classList.contains('googleplusX')) {
                finalURL = preURLs.googleplusX + currURLX;
            } else if (ele.classList.contains('pinterestX')) {
                finalURL = preURLs.pinterestX + currURLX;
            } else if (ele.classList.contains('whatsappX')) {
                finalURL = preURLs.whatsappX + currURLX;
            }
            console.log('finalURL: ', finalURL);
            var W_width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
            var W_height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
            window.open(finalURL, 'shareWindow', 'height=450, width=550, top=' + (W_height / 2 - 275) + ', left=' + (W_width / 2 - 225) + ', toolbar=0, location=0, menubar=0, directories=0, scrollbars=0');
            //end of click event
        });
        //end of for loop
        //utils
    }

    function getClick_targetClass_elem(elem, targetClass) {
        if (elem.classList.contains(targetClass)) {
            return elem;
        } else {
            return findParentWithClassX99(elem, targetClass);
        }
    }

    function findParentWithClassX99(el, cls) {
        while ((el = el.parentElement) && !el.classList.contains(cls));
        return el;
    }

})();
module.exports = socialShareX_Module;

},{"./MobPlatform_M":2}],4:[function(require,module,exports){
/*!
  hey, [be]Lazy.js - v1.8.0 - 2016.10.16
  A fast, small and dependency free lazy load script (https://github.com/dinbror/blazy)
  (c) Bjoern Klinggaard - @bklinggaard - http://dinbror.dk/blazy
*/
;
(function(root, blazy) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register bLazy as an anonymous module
        define(blazy);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = blazy();
    } else {
        // Browser globals. Register bLazy on window
        root.Blazy = blazy();
    }
})(this, function() {
    'use strict';

    //private vars
    var _source, _viewport, _isRetina, _attrSrc = 'src',
        _attrSrcset = 'srcset';

    // constructor
    return function Blazy(options) {
        //IE7- fallback for missing querySelectorAll support
        if (!document.querySelectorAll) {
            var s = document.createStyleSheet();
            document.querySelectorAll = function(r, c, i, j, a) {
                a = document.all, c = [], r = r.replace(/\[for\b/gi, '[htmlFor').split(',');
                for (i = r.length; i--;) {
                    s.addRule(r[i], 'k:v');
                    for (j = a.length; j--;) a[j].currentStyle.k && c.push(a[j]);
                    s.removeRule(0);
                }
                return c;
            };
        }

        //options and helper vars
        var scope = this;
        var util = scope._util = {};
        util.elements = [];
        util.destroyed = true;
        scope.options = options || {};
        scope.options.error = scope.options.error || false;
        scope.options.offset = scope.options.offset || 100;
        scope.options.root = scope.options.root || document;
        scope.options.success = scope.options.success || false;
        scope.options.selector = scope.options.selector || '.b-lazy';
        scope.options.separator = scope.options.separator || '|';
        scope.options.containerClass = scope.options.container;
        scope.options.container = scope.options.containerClass ? document.querySelectorAll(scope.options.containerClass) : false;
        scope.options.errorClass = scope.options.errorClass || 'b-error';
        scope.options.breakpoints = scope.options.breakpoints || false;
        scope.options.loadInvisible = scope.options.loadInvisible || false;
        scope.options.successClass = scope.options.successClass || 'b-loaded';
        scope.options.validateDelay = scope.options.validateDelay || 25;
        scope.options.saveViewportOffsetDelay = scope.options.saveViewportOffsetDelay || 50;
        scope.options.srcset = scope.options.srcset || 'data-srcset';
        scope.options.src = _source = scope.options.src || 'data-src';
        _isRetina = window.devicePixelRatio > 1;
        _viewport = {};
        _viewport.top = 0 - scope.options.offset;
        _viewport.left = 0 - scope.options.offset;


        /* public functions
         ************************************/
        scope.revalidate = function() {
            initialize(this);
        };
        scope.load = function(elements, force) {
            var opt = this.options;
            if (elements.length === undefined) {
                loadElement(elements, force, opt);
            } else {
                each(elements, function(element) {
                    loadElement(element, force, opt);
                });
            }
        };
        scope.destroy = function() {
            var self = this;
            var util = self._util;
            if (self.options.container) {
                each(self.options.container, function(object) {
                    unbindEvent(object, 'scroll', util.validateT);
                });
            }
            unbindEvent(window, 'scroll', util.validateT);
            unbindEvent(window, 'resize', util.validateT);
            unbindEvent(window, 'resize', util.saveViewportOffsetT);
            util.count = 0;
            util.elements.length = 0;
            util.destroyed = true;
        };

        //throttle, ensures that we don't call the functions too often
        util.validateT = throttle(function() {
            validate(scope);
        }, scope.options.validateDelay, scope);
        util.saveViewportOffsetT = throttle(function() {
            saveViewportOffset(scope.options.offset);
        }, scope.options.saveViewportOffsetDelay, scope);
        saveViewportOffset(scope.options.offset);

        //handle multi-served image src (obsolete)
        each(scope.options.breakpoints, function(object) {
            if (object.width >= window.screen.width) {
                _source = object.src;
                return false;
            }
        });

        // start lazy load
        setTimeout(function() {
            initialize(scope);
        }); // "dom ready" fix

    };


    /* Private helper functions
     ************************************/
    function initialize(self) {
        var util = self._util;
        // First we create an array of elements to lazy load
        util.elements = toArray(self.options);
        util.count = util.elements.length;
        // Then we bind resize and scroll events if not already binded
        if (util.destroyed) {
            util.destroyed = false;
            if (self.options.container) {
                each(self.options.container, function(object) {
                    bindEvent(object, 'scroll', util.validateT);
                });
            }
            bindEvent(window, 'resize', util.saveViewportOffsetT);
            bindEvent(window, 'resize', util.validateT);
            bindEvent(window, 'scroll', util.validateT);
        }
        // And finally, we start to lazy load.
        validate(self);
    }

    function validate(self) {
        var util = self._util;
        for (var i = 0; i < util.count; i++) {
            var element = util.elements[i];
            if (elementInView(element, self.options) || hasClass(element, self.options.successClass)) {
                self.load(element);
                util.elements.splice(i, 1);
                util.count--;
                i--;
            }
        }
        if (util.count === 0) {
            self.destroy();
        }
    }

    function elementInView(ele, options) {
        var rect = ele.getBoundingClientRect();

        if(options.container){
            // Is element inside a container?
            var elementContainer = ele.closest(options.containerClass);
            if(elementContainer){
                var containerRect = elementContainer.getBoundingClientRect();
                // Is container in view?
                if(inView(containerRect, _viewport)){
                    var containerRectWithOffset = {
                        top: containerRect.top - options.offset,
                        right: containerRect.right + options.offset,
                        bottom: containerRect.bottom + options.offset,
                        left: containerRect.left - options.offset
                    };
                    // Is element in view of container?
                    return inView(rect, containerRectWithOffset);
                } else {
                    return false;
                }
            }
        }      
        return inView(rect, _viewport);
    }

    function inView(rect, viewport){
        // Intersection
        return rect.right >= viewport.left &&
               rect.bottom >= viewport.top && 
               rect.left <= viewport.right && 
               rect.top <= viewport.bottom;
    }

    function loadElement(ele, force, options) {
        // if element is visible, not loaded or forced
        if (!hasClass(ele, options.successClass) && (force || options.loadInvisible || (ele.offsetWidth > 0 && ele.offsetHeight > 0))) {
            var dataSrc = getAttr(ele, _source) || getAttr(ele, options.src); // fallback to default 'data-src'
            if (dataSrc) {
                var dataSrcSplitted = dataSrc.split(options.separator);
                var src = dataSrcSplitted[_isRetina && dataSrcSplitted.length > 1 ? 1 : 0];
                var srcset = getAttr(ele, options.srcset);
                var isImage = equal(ele, 'img');
                var parent = ele.parentNode;
                var isPicture = parent && equal(parent, 'picture');
                // Image or background image
                if (isImage || ele.src === undefined) {
                    var img = new Image();
                    // using EventListener instead of onerror and onload
                    // due to bug introduced in chrome v50 
                    // (https://productforums.google.com/forum/#!topic/chrome/p51Lk7vnP2o)
                    var onErrorHandler = function() {
                        if (options.error) options.error(ele, "invalid");
                        addClass(ele, options.errorClass);
                        unbindEvent(img, 'error', onErrorHandler);
                        unbindEvent(img, 'load', onLoadHandler);
                    };
                    var onLoadHandler = function() {
                        // Is element an image
                        if (isImage) {
                            if(!isPicture) {
                                handleSources(ele, src, srcset);
                            }
                        // or background-image
                        } else {
                            ele.style.backgroundImage = 'url("' + src + '")';
                        }
                        itemLoaded(ele, options);
                        unbindEvent(img, 'load', onLoadHandler);
                        unbindEvent(img, 'error', onErrorHandler);
                    };
                    
                    // Picture element
                    if (isPicture) {
                        img = ele; // Image tag inside picture element wont get preloaded
                        each(parent.getElementsByTagName('source'), function(source) {
                            handleSource(source, _attrSrcset, options.srcset);
                        });
                    }
                    bindEvent(img, 'error', onErrorHandler);
                    bindEvent(img, 'load', onLoadHandler);
                    handleSources(img, src, srcset); // Preload

                } else { // An item with src like iframe, unity games, simpel video etc
                    ele.src = src;
                    itemLoaded(ele, options);
                }
            } else {
                // video with child source
                if (equal(ele, 'video')) {
                    each(ele.getElementsByTagName('source'), function(source) {
                        handleSource(source, _attrSrc, options.src);
                    });
                    ele.load();
                    itemLoaded(ele, options);
                } else {
                    if (options.error) options.error(ele, "missing");
                    addClass(ele, options.errorClass);
                }
            }
        }
    }

    function itemLoaded(ele, options) {
        addClass(ele, options.successClass);
        if (options.success) options.success(ele);
        // cleanup markup, remove data source attributes
        removeAttr(ele, options.src);
        removeAttr(ele, options.srcset);
        each(options.breakpoints, function(object) {
            removeAttr(ele, object.src);
        });
    }

    function handleSource(ele, attr, dataAttr) {
        var dataSrc = getAttr(ele, dataAttr);
        if (dataSrc) {
            setAttr(ele, attr, dataSrc);
            removeAttr(ele, dataAttr);
        }
    }

    function handleSources(ele, src, srcset){
        if(srcset) {
            setAttr(ele, _attrSrcset, srcset); //srcset
        }
        ele.src = src; //src 
    }

    function setAttr(ele, attr, value){
        ele.setAttribute(attr, value);
    }

    function getAttr(ele, attr) {
        return ele.getAttribute(attr);
    }

    function removeAttr(ele, attr){
        ele.removeAttribute(attr); 
    }

    function equal(ele, str) {
        return ele.nodeName.toLowerCase() === str;
    }

    function hasClass(ele, className) {
        return (' ' + ele.className + ' ').indexOf(' ' + className + ' ') !== -1;
    }

    function addClass(ele, className) {
        if (!hasClass(ele, className)) {
            ele.className += ' ' + className;
        }
    }

    function toArray(options) {
        var array = [];
        var nodelist = (options.root).querySelectorAll(options.selector);
        for (var i = nodelist.length; i--; array.unshift(nodelist[i])) {}
        return array;
    }

    function saveViewportOffset(offset) {
        _viewport.bottom = (window.innerHeight || document.documentElement.clientHeight) + offset;
        _viewport.right = (window.innerWidth || document.documentElement.clientWidth) + offset;
    }

    function bindEvent(ele, type, fn) {
        if (ele.attachEvent) {
            ele.attachEvent && ele.attachEvent('on' + type, fn);
        } else {
            ele.addEventListener(type, fn, { capture: false, passive: true });
        }
    }

    function unbindEvent(ele, type, fn) {
        if (ele.detachEvent) {
            ele.detachEvent && ele.detachEvent('on' + type, fn);
        } else {
            ele.removeEventListener(type, fn, { capture: false, passive: true });
        }
    }

    function each(object, fn) {
        if (object && fn) {
            var l = object.length;
            for (var i = 0; i < l && fn(object[i], i) !== false; i++) {}
        }
    }

    function throttle(fn, minDelay, scope) {
        var lastCall = 0;
        return function() {
            var now = +new Date();
            if (now - lastCall < minDelay) {
                return;
            }
            lastCall = now;
            fn.apply(scope, arguments);
        };
    }
});
},{}],5:[function(require,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.0.5
 */

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  _resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        _resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      _reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      _reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    _reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return _resolve(promise, value);
    }, function (reason) {
      return _reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && maybeThenable.constructor.resolve === resolve) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      _reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function _resolve(promise, value) {
  if (promise === value) {
    _reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function _reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      _reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      _resolve(promise, value);
    } else if (failed) {
      _reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      _reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      _resolve(promise, value);
    }, function rejectPromise(reason) {
      _reject(promise, reason);
    });
  } catch (e) {
    _reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    _reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var _input = this._input;

  for (var i = 0; this._state === PENDING && i < length; i++) {
    this._eachEntry(_input[i], i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$ = c.resolve;

  if (resolve$$ === resolve) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$) {
        return resolve$$(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$(entry), i);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      _reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries) {
  return new Enumerator(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  _reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.all = all;
Promise.race = race;
Promise.resolve = resolve;
Promise.reject = reject;
Promise._setScheduler = setScheduler;
Promise._setAsap = setAsap;
Promise._asap = asap;

Promise.prototype = {
  constructor: Promise,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

function polyfill() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise;
}

// Strange compat..
Promise.polyfill = polyfill;
Promise.Promise = Promise;

return Promise;

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":7}],6:[function(require,module,exports){
!(function(win) {

/**
 * FastDom
 *
 * Eliminates layout thrashing
 * by batching DOM read/write
 * interactions.
 *
 * @author Wilson Page <wilsonpage@me.com>
 * @author Kornel Lesinski <kornel.lesinski@ft.com>
 */

'use strict';

/**
 * Mini logger
 *
 * @return {Function}
 */
var debug = 0 ? console.log.bind(console, '[fastdom]') : function() {};

/**
 * Normalized rAF
 *
 * @type {Function}
 */
var raf = win.requestAnimationFrame
  || win.webkitRequestAnimationFrame
  || win.mozRequestAnimationFrame
  || win.msRequestAnimationFrame
  || function(cb) { return setTimeout(cb, 16); };

/**
 * Initialize a `FastDom`.
 *
 * @constructor
 */
function FastDom() {
  var self = this;
  self.reads = [];
  self.writes = [];
  self.raf = raf.bind(win); // test hook
  debug('initialized', self);
}

FastDom.prototype = {
  constructor: FastDom,

  /**
   * Adds a job to the read batch and
   * schedules a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  measure: function(fn, ctx) {
    debug('measure');
    var task = !ctx ? fn : fn.bind(ctx);
    this.reads.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Adds a job to the
   * write batch and schedules
   * a new frame if need be.
   *
   * @param  {Function} fn
   * @public
   */
  mutate: function(fn, ctx) {
    debug('mutate');
    var task = !ctx ? fn : fn.bind(ctx);
    this.writes.push(task);
    scheduleFlush(this);
    return task;
  },

  /**
   * Clears a scheduled 'read' or 'write' task.
   *
   * @param {Object} task
   * @return {Boolean} success
   * @public
   */
  clear: function(task) {
    debug('clear', task);
    return remove(this.reads, task) || remove(this.writes, task);
  },

  /**
   * Extend this FastDom with some
   * custom functionality.
   *
   * Because fastdom must *always* be a
   * singleton, we're actually extending
   * the fastdom instance. This means tasks
   * scheduled by an extension still enter
   * fastdom's global task queue.
   *
   * The 'super' instance can be accessed
   * from `this.fastdom`.
   *
   * @example
   *
   * var myFastdom = fastdom.extend({
   *   initialize: function() {
   *     // runs on creation
   *   },
   *
   *   // override a method
   *   measure: function(fn) {
   *     // do extra stuff ...
   *
   *     // then call the original
   *     return this.fastdom.measure(fn);
   *   },
   *
   *   ...
   * });
   *
   * @param  {Object} props  properties to mixin
   * @return {FastDom}
   */
  extend: function(props) {
    debug('extend', props);
    if (typeof props != 'object') throw new Error('expected object');

    var child = Object.create(this);
    mixin(child, props);
    child.fastdom = this;

    // run optional creation hook
    if (child.initialize) child.initialize();

    return child;
  },

  // override this with a function
  // to prevent Errors in console
  // when tasks throw
  catch: null
};

/**
 * Schedules a new read/write
 * batch if one isn't pending.
 *
 * @private
 */
function scheduleFlush(fastdom) {
  if (!fastdom.scheduled) {
    fastdom.scheduled = true;
    fastdom.raf(flush.bind(null, fastdom));
    debug('flush scheduled');
  }
}

/**
 * Runs queued `read` and `write` tasks.
 *
 * Errors are caught and thrown by default.
 * If a `.catch` function has been defined
 * it is called instead.
 *
 * @private
 */
function flush(fastdom) {
  debug('flush');

  var writes = fastdom.writes;
  var reads = fastdom.reads;
  var error;

  try {
    debug('flushing reads', reads.length);
    runTasks(reads);
    debug('flushing writes', writes.length);
    runTasks(writes);
  } catch (e) { error = e; }

  fastdom.scheduled = false;

  // If the batch errored we may still have tasks queued
  if (reads.length || writes.length) scheduleFlush(fastdom);

  if (error) {
    debug('task errored', error.message);
    if (fastdom.catch) fastdom.catch(error);
    else throw error;
  }
}

/**
 * We run this inside a try catch
 * so that if any jobs error, we
 * are able to recover and continue
 * to flush the batch until it's empty.
 *
 * @private
 */
function runTasks(tasks) {
  debug('run tasks');
  var task; while (task = tasks.shift()) task();
}

/**
 * Remove an item from an Array.
 *
 * @param  {Array} array
 * @param  {*} item
 * @return {Boolean}
 */
function remove(array, item) {
  var index = array.indexOf(item);
  return !!~index && !!array.splice(index, 1);
}

/**
 * Mixin own properties of source
 * object into the target.
 *
 * @param  {Object} target
 * @param  {Object} source
 */
function mixin(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key];
  }
}

// There should never be more than
// one instance of `FastDom` in an app
var exports = win.fastdom = (win.fastdom || new FastDom()); // jshint ignore:line

// Expose to CJS & AMD
if ((typeof define)[0] == 'f') define(function() { return exports; });
else if ((typeof module)[0] == 'o') module.exports = exports;

})( typeof window !== 'undefined' ? window : this);

},{}],7:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],8:[function(require,module,exports){
(function (process,global){
/*!
 * @overview RSVP - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2016 Yehuda Katz, Tom Dale, Stefan Penner and contributors
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/tildeio/rsvp.js/master/LICENSE
 * @version   3.3.3
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.RSVP = global.RSVP || {})));
}(this, (function (exports) { 'use strict';

function indexOf(callbacks, callback) {
  for (var i = 0, l = callbacks.length; i < l; i++) {
    if (callbacks[i] === callback) {
      return i;
    }
  }

  return -1;
}

function callbacksFor(object) {
  var callbacks = object._promiseCallbacks;

  if (!callbacks) {
    callbacks = object._promiseCallbacks = {};
  }

  return callbacks;
}

/**
  @class RSVP.EventTarget
*/
var EventTarget = {

  /**
    `RSVP.EventTarget.mixin` extends an object with EventTarget methods. For
    Example:
     ```javascript
    let object = {};
     RSVP.EventTarget.mixin(object);
     object.on('finished', function(event) {
      // handle event
    });
     object.trigger('finished', { detail: value });
    ```
     `EventTarget.mixin` also works with prototypes:
     ```javascript
    let Person = function() {};
    RSVP.EventTarget.mixin(Person.prototype);
     let yehuda = new Person();
    let tom = new Person();
     yehuda.on('poke', function(event) {
      console.log('Yehuda says OW');
    });
     tom.on('poke', function(event) {
      console.log('Tom says OW');
    });
     yehuda.trigger('poke');
    tom.trigger('poke');
    ```
     @method mixin
    @for RSVP.EventTarget
    @private
    @param {Object} object object to extend with EventTarget methods
  */
  mixin: function mixin(object) {
    object['on'] = this['on'];
    object['off'] = this['off'];
    object['trigger'] = this['trigger'];
    object._promiseCallbacks = undefined;
    return object;
  },

  /**
    Registers a callback to be executed when `eventName` is triggered
     ```javascript
    object.on('event', function(eventInfo){
      // handle the event
    });
     object.trigger('event');
    ```
     @method on
    @for RSVP.EventTarget
    @private
    @param {String} eventName name of the event to listen for
    @param {Function} callback function to be called when the event is triggered.
  */
  on: function on(eventName, callback) {
    if (typeof callback !== 'function') {
      throw new TypeError('Callback must be a function');
    }

    var allCallbacks = callbacksFor(this),
        callbacks = undefined;

    callbacks = allCallbacks[eventName];

    if (!callbacks) {
      callbacks = allCallbacks[eventName] = [];
    }

    if (indexOf(callbacks, callback) === -1) {
      callbacks.push(callback);
    }
  },

  /**
    You can use `off` to stop firing a particular callback for an event:
     ```javascript
    function doStuff() { // do stuff! }
    object.on('stuff', doStuff);
     object.trigger('stuff'); // doStuff will be called
     // Unregister ONLY the doStuff callback
    object.off('stuff', doStuff);
    object.trigger('stuff'); // doStuff will NOT be called
    ```
     If you don't pass a `callback` argument to `off`, ALL callbacks for the
    event will not be executed when the event fires. For example:
     ```javascript
    let callback1 = function(){};
    let callback2 = function(){};
     object.on('stuff', callback1);
    object.on('stuff', callback2);
     object.trigger('stuff'); // callback1 and callback2 will be executed.
     object.off('stuff');
    object.trigger('stuff'); // callback1 and callback2 will not be executed!
    ```
     @method off
    @for RSVP.EventTarget
    @private
    @param {String} eventName event to stop listening to
    @param {Function} callback optional argument. If given, only the function
    given will be removed from the event's callback queue. If no `callback`
    argument is given, all callbacks will be removed from the event's callback
    queue.
  */
  off: function off(eventName, callback) {
    var allCallbacks = callbacksFor(this),
        callbacks = undefined,
        index = undefined;

    if (!callback) {
      allCallbacks[eventName] = [];
      return;
    }

    callbacks = allCallbacks[eventName];

    index = indexOf(callbacks, callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  },

  /**
    Use `trigger` to fire custom events. For example:
     ```javascript
    object.on('foo', function(){
      console.log('foo event happened!');
    });
    object.trigger('foo');
    // 'foo event happened!' logged to the console
    ```
     You can also pass a value as a second argument to `trigger` that will be
    passed as an argument to all event listeners for the event:
     ```javascript
    object.on('foo', function(value){
      console.log(value.name);
    });
     object.trigger('foo', { name: 'bar' });
    // 'bar' logged to the console
    ```
     @method trigger
    @for RSVP.EventTarget
    @private
    @param {String} eventName name of the event to be triggered
    @param {*} options optional value to be passed to any event handlers for
    the given `eventName`
  */
  trigger: function trigger(eventName, options, label) {
    var allCallbacks = callbacksFor(this),
        callbacks = undefined,
        callback = undefined;

    if (callbacks = allCallbacks[eventName]) {
      // Don't cache the callbacks.length since it may grow
      for (var i = 0; i < callbacks.length; i++) {
        callback = callbacks[i];

        callback(options, label);
      }
    }
  }
};

var config = {
  instrument: false
};

EventTarget['mixin'](config);

function configure(name, value) {
  if (name === 'onerror') {
    // handle for legacy users that expect the actual
    // error to be passed to their function added via
    // `RSVP.configure('onerror', someFunctionHere);`
    config['on']('error', value);
    return;
  }

  if (arguments.length === 2) {
    config[name] = value;
  } else {
    return config[name];
  }
}

function objectOrFunction(x) {
  return typeof x === 'function' || typeof x === 'object' && x !== null;
}

function isFunction(x) {
  return typeof x === 'function';
}

function isMaybeThenable(x) {
  return typeof x === 'object' && x !== null;
}

var _isArray = undefined;
if (!Array.isArray) {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
} else {
  _isArray = Array.isArray;
}

var isArray = _isArray;

// Date.now is not available in browsers < IE9
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/now#Compatibility
var now = Date.now || function () {
  return new Date().getTime();
};

function F() {}

var o_create = Object.create || function (o) {
  if (arguments.length > 1) {
    throw new Error('Second argument not supported');
  }
  if (typeof o !== 'object') {
    throw new TypeError('Argument must be an object');
  }
  F.prototype = o;
  return new F();
};

var queue = [];

function scheduleFlush() {
  setTimeout(function () {
    for (var i = 0; i < queue.length; i++) {
      var entry = queue[i];

      var payload = entry.payload;

      payload.guid = payload.key + payload.id;
      payload.childGuid = payload.key + payload.childId;
      if (payload.error) {
        payload.stack = payload.error.stack;
      }

      config['trigger'](entry.name, entry.payload);
    }
    queue.length = 0;
  }, 50);
}
function instrument(eventName, promise, child) {
  if (1 === queue.push({
    name: eventName,
    payload: {
      key: promise._guidKey,
      id: promise._id,
      eventName: eventName,
      detail: promise._result,
      childId: child && child._id,
      label: promise._label,
      timeStamp: now(),
      error: config["instrument-with-stack"] ? new Error(promise._label) : null
    } })) {
    scheduleFlush();
  }
}

/**
  `RSVP.Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new RSVP.Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = RSVP.Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {*} object value that the returned promise will be resolved with
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object, label) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop, label);
  resolve(promise, object);
  return promise;
}

function withOwnPromise() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then, value, fulfillmentHandler, rejectionHandler) {
  try {
    then.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then) {
  config.async(function (promise) {
    var sealed = false;
    var error = tryThen(then, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value, undefined);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    thenable._onError = null;
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      if (thenable !== value) {
        resolve(promise, value, undefined);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$) {
  if (maybeThenable.constructor === promise.constructor && then$$ === then && promise.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$ === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
    } else if (then$$ === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$)) {
      handleForeignThenable(promise, maybeThenable, then$$);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    fulfill(promise, value);
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onError) {
    promise._onError(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length === 0) {
    if (config.instrument) {
      instrument('fulfilled', promise);
    }
  } else {
    config.async(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;
  config.async(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var subscribers = parent._subscribers;
  var length = subscribers.length;

  parent._onError = null;

  subscribers[length] = child;
  subscribers[length + FULFILLED] = onFulfillment;
  subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    config.async(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (config.instrument) {
    instrument(settled === FULFILLED ? 'fulfilled' : 'rejected', promise);
  }

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, withOwnPromise());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  var resolved = false;
  try {
    resolver(function (value) {
      if (resolved) {
        return;
      }
      resolved = true;
      resolve(promise, value);
    }, function (reason) {
      if (resolved) {
        return;
      }
      resolved = true;
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

function then(onFulfillment, onRejection, label) {
  var _arguments = arguments;

  var parent = this;
  var state = parent._state;

  if (state === FULFILLED && !onFulfillment || state === REJECTED && !onRejection) {
    config.instrument && instrument('chained', parent, parent);
    return parent;
  }

  parent._onError = null;

  var child = new parent.constructor(noop, label);
  var result = parent._result;

  config.instrument && instrument('chained', parent, child);

  if (state) {
    (function () {
      var callback = _arguments[state - 1];
      config.async(function () {
        return invokeCallback(state, child, callback, result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

function makeSettledResult(state, position, value) {
  if (state === FULFILLED) {
    return {
      state: 'fulfilled',
      value: value
    };
  } else {
    return {
      state: 'rejected',
      reason: value
    };
  }
}

function Enumerator(Constructor, input, abortOnReject, label) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop, label);
  this._abortOnReject = abortOnReject;

  if (this._validateInput(input)) {
    this._input = input;
    this.length = input.length;
    this._remaining = input.length;

    this._init();

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate();
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, this._validationError());
  }
}

Enumerator.prototype._validateInput = function (input) {
  return isArray(input);
};

Enumerator.prototype._validationError = function () {
  return new Error('Array Methods must be provided an Array');
};

Enumerator.prototype._init = function () {
  this._result = new Array(this.length);
};

Enumerator.prototype._enumerate = function () {
  var length = this.length;
  var promise = this.promise;
  var input = this._input;

  for (var i = 0; promise._state === PENDING && i < length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator.prototype._settleMaybeThenable = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve = c.resolve;

  if (resolve === resolve$1) {
    var then$$ = getThen(entry);

    if (then$$ === then && entry._state !== PENDING) {
      entry._onError = null;
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof then$$ !== 'function') {
      this._remaining--;
      this._result[i] = this._makeResult(FULFILLED, i, entry);
    } else if (c === Promise) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, then$$);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve) {
        return resolve(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve(entry), i);
  }
};

Enumerator.prototype._eachEntry = function (entry, i) {
  if (isMaybeThenable(entry)) {
    this._settleMaybeThenable(entry, i);
  } else {
    this._remaining--;
    this._result[i] = this._makeResult(FULFILLED, i, entry);
  }
};

Enumerator.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (this._abortOnReject && state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = this._makeResult(state, i, value);
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator.prototype._makeResult = function (state, i, value) {
  return value;
};

Enumerator.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `RSVP.Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = RSVP.resolve(1);
  let promise2 = RSVP.resolve(2);
  let promise3 = RSVP.resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  RSVP.Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `RSVP.all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = RSVP.resolve(1);
  let promise2 = RSVP.reject(new Error("2"));
  let promise3 = RSVP.reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  RSVP.Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all(entries, label) {
  return new Enumerator(this, entries, true, /* abort on reject */label).promise;
}

/**
  `RSVP.Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  RSVP.Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `RSVP.Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new RSVP.Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  RSVP.Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  RSVP.Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} entries array of promises to observe
  @param {String} label optional string for describing the promise returned.
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race(entries, label) {
  /*jshint validthis:true */
  var Constructor = this;

  var promise = new Constructor(noop, label);

  if (!isArray(entries)) {
    reject(promise, new TypeError('You must pass an array to race.'));
    return promise;
  }

  for (var i = 0; promise._state === PENDING && i < entries.length; i++) {
    subscribe(Constructor.resolve(entries[i]), undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }

  return promise;
}

/**
  `RSVP.Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new RSVP.Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = RSVP.Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {*} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason, label) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop, label);
  reject(promise, reason);
  return promise;
}

var guidKey = 'rsvp_' + now() + '-';
var counter = 0;

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise’s eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class RSVP.Promise
  @param {function} resolver
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @constructor
*/
function Promise(resolver, label) {
  this._id = counter++;
  this._label = label;
  this._state = undefined;
  this._result = undefined;
  this._subscribers = [];

  config.instrument && instrument('created', this);

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise ? initializePromise(this, resolver) : needsNew();
  }
}

Promise.cast = resolve$1; // deprecated
Promise.all = all;
Promise.race = race;
Promise.resolve = resolve$1;
Promise.reject = reject$1;

Promise.prototype = {
  constructor: Promise,

  _guidKey: guidKey,

  _onError: function _onError(reason) {
    var promise = this;
    config.after(function () {
      if (promise._onError) {
        config['trigger']('error', reason, promise._label);
      }
    });
  },

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we\'re unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we\'re unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfillment
    @param {Function} onRejection
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn\'t find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection, label) {
    return this.then(undefined, onRejection, label);
  },

  /**
    `finally` will be invoked regardless of the promise's fate just as native
    try/catch/finally behaves
  
    Synchronous example:
  
    ```js
    findAuthor() {
      if (Math.random() > 0.5) {
        throw new Error();
      }
      return new Author();
    }
  
    try {
      return findAuthor(); // succeed or fail
    } catch(error) {
      return findOtherAuther();
    } finally {
      // always runs
      // doesn't affect the return value
    }
    ```
  
    Asynchronous example:
  
    ```js
    findAuthor().catch(function(reason){
      return findOtherAuther();
    }).finally(function(){
      // author was either found, or not
    });
    ```
  
    @method finally
    @param {Function} callback
    @param {String} label optional string for labeling the promise.
    Useful for tooling.
    @return {Promise}
  */
  'finally': function _finally(callback, label) {
    var promise = this;
    var constructor = promise.constructor;

    return promise.then(function (value) {
      return constructor.resolve(callback()).then(function () {
        return value;
      });
    }, function (reason) {
      return constructor.resolve(callback()).then(function () {
        throw reason;
      });
    }, label);
  }
};

function Result() {
  this.value = undefined;
}

var ERROR = new Result();
var GET_THEN_ERROR$1 = new Result();

function getThen$1(obj) {
  try {
    return obj.then;
  } catch (error) {
    ERROR.value = error;
    return ERROR;
  }
}

function tryApply(f, s, a) {
  try {
    f.apply(s, a);
  } catch (error) {
    ERROR.value = error;
    return ERROR;
  }
}

function makeObject(_, argumentNames) {
  var obj = {};
  var length = _.length;
  var args = new Array(length);

  for (var x = 0; x < length; x++) {
    args[x] = _[x];
  }

  for (var i = 0; i < argumentNames.length; i++) {
    var _name = argumentNames[i];
    obj[_name] = args[i + 1];
  }

  return obj;
}

function arrayResult(_) {
  var length = _.length;
  var args = new Array(length - 1);

  for (var i = 1; i < length; i++) {
    args[i - 1] = _[i];
  }

  return args;
}

function wrapThenable(_then, promise) {
  return {
    then: function then(onFulFillment, onRejection) {
      return _then.call(promise, onFulFillment, onRejection);
    }
  };
}

/**
  `RSVP.denodeify` takes a 'node-style' function and returns a function that
  will return an `RSVP.Promise`. You can use `denodeify` in Node.js or the
  browser when you'd prefer to use promises over using callbacks. For example,
  `denodeify` transforms the following:

  ```javascript
  let fs = require('fs');

  fs.readFile('myfile.txt', function(err, data){
    if (err) return handleError(err);
    handleData(data);
  });
  ```

  into:

  ```javascript
  let fs = require('fs');
  let readFile = RSVP.denodeify(fs.readFile);

  readFile('myfile.txt').then(handleData, handleError);
  ```

  If the node function has multiple success parameters, then `denodeify`
  just returns the first one:

  ```javascript
  let request = RSVP.denodeify(require('request'));

  request('http://example.com').then(function(res) {
    // ...
  });
  ```

  However, if you need all success parameters, setting `denodeify`'s
  second parameter to `true` causes it to return all success parameters
  as an array:

  ```javascript
  let request = RSVP.denodeify(require('request'), true);

  request('http://example.com').then(function(result) {
    // result[0] -> res
    // result[1] -> body
  });
  ```

  Or if you pass it an array with names it returns the parameters as a hash:

  ```javascript
  let request = RSVP.denodeify(require('request'), ['res', 'body']);

  request('http://example.com').then(function(result) {
    // result.res
    // result.body
  });
  ```

  Sometimes you need to retain the `this`:

  ```javascript
  let app = require('express')();
  let render = RSVP.denodeify(app.render.bind(app));
  ```

  The denodified function inherits from the original function. It works in all
  environments, except IE 10 and below. Consequently all properties of the original
  function are available to you. However, any properties you change on the
  denodeified function won't be changed on the original function. Example:

  ```javascript
  let request = RSVP.denodeify(require('request')),
      cookieJar = request.jar(); // <- Inheritance is used here

  request('http://example.com', {jar: cookieJar}).then(function(res) {
    // cookieJar.cookies holds now the cookies returned by example.com
  });
  ```

  Using `denodeify` makes it easier to compose asynchronous operations instead
  of using callbacks. For example, instead of:

  ```javascript
  let fs = require('fs');

  fs.readFile('myfile.txt', function(err, data){
    if (err) { ... } // Handle error
    fs.writeFile('myfile2.txt', data, function(err){
      if (err) { ... } // Handle error
      console.log('done')
    });
  });
  ```

  you can chain the operations together using `then` from the returned promise:

  ```javascript
  let fs = require('fs');
  let readFile = RSVP.denodeify(fs.readFile);
  let writeFile = RSVP.denodeify(fs.writeFile);

  readFile('myfile.txt').then(function(data){
    return writeFile('myfile2.txt', data);
  }).then(function(){
    console.log('done')
  }).catch(function(error){
    // Handle error
  });
  ```

  @method denodeify
  @static
  @for RSVP
  @param {Function} nodeFunc a 'node-style' function that takes a callback as
  its last argument. The callback expects an error to be passed as its first
  argument (if an error occurred, otherwise null), and the value from the
  operation as its second argument ('function(err, value){ }').
  @param {Boolean|Array} [options] An optional paramter that if set
  to `true` causes the promise to fulfill with the callback's success arguments
  as an array. This is useful if the node function has multiple success
  paramters. If you set this paramter to an array with names, the promise will
  fulfill with a hash with these names as keys and the success parameters as
  values.
  @return {Function} a function that wraps `nodeFunc` to return an
  `RSVP.Promise`
  @static
*/
function denodeify(nodeFunc, options) {
  var fn = function fn() {
    var self = this;
    var l = arguments.length;
    var args = new Array(l + 1);
    var promiseInput = false;

    for (var i = 0; i < l; ++i) {
      var arg = arguments[i];

      if (!promiseInput) {
        // TODO: clean this up
        promiseInput = needsPromiseInput(arg);
        if (promiseInput === GET_THEN_ERROR$1) {
          var p = new Promise(noop);
          reject(p, GET_THEN_ERROR$1.value);
          return p;
        } else if (promiseInput && promiseInput !== true) {
          arg = wrapThenable(promiseInput, arg);
        }
      }
      args[i] = arg;
    }

    var promise = new Promise(noop);

    args[l] = function (err, val) {
      if (err) reject(promise, err);else if (options === undefined) resolve(promise, val);else if (options === true) resolve(promise, arrayResult(arguments));else if (isArray(options)) resolve(promise, makeObject(arguments, options));else resolve(promise, val);
    };

    if (promiseInput) {
      return handlePromiseInput(promise, args, nodeFunc, self);
    } else {
      return handleValueInput(promise, args, nodeFunc, self);
    }
  };

  fn.__proto__ = nodeFunc;

  return fn;
}

function handleValueInput(promise, args, nodeFunc, self) {
  var result = tryApply(nodeFunc, self, args);
  if (result === ERROR) {
    reject(promise, result.value);
  }
  return promise;
}

function handlePromiseInput(promise, args, nodeFunc, self) {
  return Promise.all(args).then(function (args) {
    var result = tryApply(nodeFunc, self, args);
    if (result === ERROR) {
      reject(promise, result.value);
    }
    return promise;
  });
}

function needsPromiseInput(arg) {
  if (arg && typeof arg === 'object') {
    if (arg.constructor === Promise) {
      return true;
    } else {
      return getThen$1(arg);
    }
  } else {
    return false;
  }
}

/**
  This is a convenient alias for `RSVP.Promise.all`.

  @method all
  @static
  @for RSVP
  @param {Array} array Array of promises.
  @param {String} label An optional label. This is useful
  for tooling.
*/
function all$1(array, label) {
  return Promise.all(array, label);
}

function AllSettled(Constructor, entries, label) {
  this._superConstructor(Constructor, entries, false, /* don't abort on reject */label);
}

AllSettled.prototype = o_create(Enumerator.prototype);
AllSettled.prototype._superConstructor = Enumerator;
AllSettled.prototype._makeResult = makeSettledResult;
AllSettled.prototype._validationError = function () {
  return new Error('allSettled must be called with an array');
};

/**
  `RSVP.allSettled` is similar to `RSVP.all`, but instead of implementing
  a fail-fast method, it waits until all the promises have returned and
  shows you all the results. This is useful if you want to handle multiple
  promises' failure states together as a set.

  Returns a promise that is fulfilled when all the given promises have been
  settled. The return promise is fulfilled with an array of the states of
  the promises passed into the `promises` array argument.

  Each state object will either indicate fulfillment or rejection, and
  provide the corresponding value or reason. The states will take one of
  the following formats:

  ```javascript
  { state: 'fulfilled', value: value }
    or
  { state: 'rejected', reason: reason }
  ```

  Example:

  ```javascript
  let promise1 = RSVP.Promise.resolve(1);
  let promise2 = RSVP.Promise.reject(new Error('2'));
  let promise3 = RSVP.Promise.reject(new Error('3'));
  let promises = [ promise1, promise2, promise3 ];

  RSVP.allSettled(promises).then(function(array){
    // array == [
    //   { state: 'fulfilled', value: 1 },
    //   { state: 'rejected', reason: Error },
    //   { state: 'rejected', reason: Error }
    // ]
    // Note that for the second item, reason.message will be '2', and for the
    // third item, reason.message will be '3'.
  }, function(error) {
    // Not run. (This block would only be called if allSettled had failed,
    // for instance if passed an incorrect argument type.)
  });
  ```

  @method allSettled
  @static
  @for RSVP
  @param {Array} entries
  @param {String} label - optional string that describes the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled with an array of the settled
  states of the constituent promises.
*/
function allSettled(entries, label) {
  return new AllSettled(Promise, entries, label).promise;
}

/**
  This is a convenient alias for `RSVP.Promise.race`.

  @method race
  @static
  @for RSVP
  @param {Array} array Array of promises.
  @param {String} label An optional label. This is useful
  for tooling.
 */
function race$1(array, label) {
  return Promise.race(array, label);
}

function PromiseHash(Constructor, object, label) {
  this._superConstructor(Constructor, object, true, label);
}

PromiseHash.prototype = o_create(Enumerator.prototype);
PromiseHash.prototype._superConstructor = Enumerator;
PromiseHash.prototype._init = function () {
  this._result = {};
};

PromiseHash.prototype._validateInput = function (input) {
  return input && typeof input === 'object';
};

PromiseHash.prototype._validationError = function () {
  return new Error('Promise.hash must be called with an object');
};

PromiseHash.prototype._enumerate = function () {
  var enumerator = this;
  var promise = enumerator.promise;
  var input = enumerator._input;
  var results = [];

  for (var key in input) {
    if (promise._state === PENDING && Object.prototype.hasOwnProperty.call(input, key)) {
      results.push({
        position: key,
        entry: input[key]
      });
    }
  }

  var length = results.length;
  enumerator._remaining = length;
  var result = undefined;

  for (var i = 0; promise._state === PENDING && i < length; i++) {
    result = results[i];
    enumerator._eachEntry(result.entry, result.position);
  }
};

/**
  `RSVP.hash` is similar to `RSVP.all`, but takes an object instead of an array
  for its `promises` argument.

  Returns a promise that is fulfilled when all the given promises have been
  fulfilled, or rejected if any of them become rejected. The returned promise
  is fulfilled with a hash that has the same key names as the `promises` object
  argument. If any of the values in the object are not promises, they will
  simply be copied over to the fulfilled object.

  Example:

  ```javascript
  let promises = {
    myPromise: RSVP.resolve(1),
    yourPromise: RSVP.resolve(2),
    theirPromise: RSVP.resolve(3),
    notAPromise: 4
  };

  RSVP.hash(promises).then(function(hash){
    // hash here is an object that looks like:
    // {
    //   myPromise: 1,
    //   yourPromise: 2,
    //   theirPromise: 3,
    //   notAPromise: 4
    // }
  });
  ````

  If any of the `promises` given to `RSVP.hash` are rejected, the first promise
  that is rejected will be given as the reason to the rejection handler.

  Example:

  ```javascript
  let promises = {
    myPromise: RSVP.resolve(1),
    rejectedPromise: RSVP.reject(new Error('rejectedPromise')),
    anotherRejectedPromise: RSVP.reject(new Error('anotherRejectedPromise')),
  };

  RSVP.hash(promises).then(function(hash){
    // Code here never runs because there are rejected promises!
  }, function(reason) {
    // reason.message === 'rejectedPromise'
  });
  ```

  An important note: `RSVP.hash` is intended for plain JavaScript objects that
  are just a set of keys and values. `RSVP.hash` will NOT preserve prototype
  chains.

  Example:

  ```javascript
  function MyConstructor(){
    this.example = RSVP.resolve('Example');
  }

  MyConstructor.prototype = {
    protoProperty: RSVP.resolve('Proto Property')
  };

  let myObject = new MyConstructor();

  RSVP.hash(myObject).then(function(hash){
    // protoProperty will not be present, instead you will just have an
    // object that looks like:
    // {
    //   example: 'Example'
    // }
    //
    // hash.hasOwnProperty('protoProperty'); // false
    // 'undefined' === typeof hash.protoProperty
  });
  ```

  @method hash
  @static
  @for RSVP
  @param {Object} object
  @param {String} label optional string that describes the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all properties of `promises`
  have been fulfilled, or rejected if any of them become rejected.
*/
function hash(object, label) {
  return new PromiseHash(Promise, object, label).promise;
}

function HashSettled(Constructor, object, label) {
  this._superConstructor(Constructor, object, false, label);
}

HashSettled.prototype = o_create(PromiseHash.prototype);
HashSettled.prototype._superConstructor = Enumerator;
HashSettled.prototype._makeResult = makeSettledResult;

HashSettled.prototype._validationError = function () {
  return new Error('hashSettled must be called with an object');
};

/**
  `RSVP.hashSettled` is similar to `RSVP.allSettled`, but takes an object
  instead of an array for its `promises` argument.

  Unlike `RSVP.all` or `RSVP.hash`, which implement a fail-fast method,
  but like `RSVP.allSettled`, `hashSettled` waits until all the
  constituent promises have returned and then shows you all the results
  with their states and values/reasons. This is useful if you want to
  handle multiple promises' failure states together as a set.

  Returns a promise that is fulfilled when all the given promises have been
  settled, or rejected if the passed parameters are invalid.

  The returned promise is fulfilled with a hash that has the same key names as
  the `promises` object argument. If any of the values in the object are not
  promises, they will be copied over to the fulfilled object and marked with state
  'fulfilled'.

  Example:

  ```javascript
  let promises = {
    myPromise: RSVP.Promise.resolve(1),
    yourPromise: RSVP.Promise.resolve(2),
    theirPromise: RSVP.Promise.resolve(3),
    notAPromise: 4
  };

  RSVP.hashSettled(promises).then(function(hash){
    // hash here is an object that looks like:
    // {
    //   myPromise: { state: 'fulfilled', value: 1 },
    //   yourPromise: { state: 'fulfilled', value: 2 },
    //   theirPromise: { state: 'fulfilled', value: 3 },
    //   notAPromise: { state: 'fulfilled', value: 4 }
    // }
  });
  ```

  If any of the `promises` given to `RSVP.hash` are rejected, the state will
  be set to 'rejected' and the reason for rejection provided.

  Example:

  ```javascript
  let promises = {
    myPromise: RSVP.Promise.resolve(1),
    rejectedPromise: RSVP.Promise.reject(new Error('rejection')),
    anotherRejectedPromise: RSVP.Promise.reject(new Error('more rejection')),
  };

  RSVP.hashSettled(promises).then(function(hash){
    // hash here is an object that looks like:
    // {
    //   myPromise:              { state: 'fulfilled', value: 1 },
    //   rejectedPromise:        { state: 'rejected', reason: Error },
    //   anotherRejectedPromise: { state: 'rejected', reason: Error },
    // }
    // Note that for rejectedPromise, reason.message == 'rejection',
    // and for anotherRejectedPromise, reason.message == 'more rejection'.
  });
  ```

  An important note: `RSVP.hashSettled` is intended for plain JavaScript objects that
  are just a set of keys and values. `RSVP.hashSettled` will NOT preserve prototype
  chains.

  Example:

  ```javascript
  function MyConstructor(){
    this.example = RSVP.Promise.resolve('Example');
  }

  MyConstructor.prototype = {
    protoProperty: RSVP.Promise.resolve('Proto Property')
  };

  let myObject = new MyConstructor();

  RSVP.hashSettled(myObject).then(function(hash){
    // protoProperty will not be present, instead you will just have an
    // object that looks like:
    // {
    //   example: { state: 'fulfilled', value: 'Example' }
    // }
    //
    // hash.hasOwnProperty('protoProperty'); // false
    // 'undefined' === typeof hash.protoProperty
  });
  ```

  @method hashSettled
  @for RSVP
  @param {Object} object
  @param {String} label optional string that describes the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when when all properties of `promises`
  have been settled.
  @static
*/
function hashSettled(object, label) {
  return new HashSettled(Promise, object, label).promise;
}

function rethrow(reason) {
  setTimeout(function () {
    throw reason;
  });
  throw reason;
}

/**
  `RSVP.defer` returns an object similar to jQuery's `$.Deferred`.
  `RSVP.defer` should be used when porting over code reliant on `$.Deferred`'s
  interface. New code should use the `RSVP.Promise` constructor instead.

  The object returned from `RSVP.defer` is a plain object with three properties:

  * promise - an `RSVP.Promise`.
  * reject - a function that causes the `promise` property on this object to
    become rejected
  * resolve - a function that causes the `promise` property on this object to
    become fulfilled.

  Example:

   ```javascript
   let deferred = RSVP.defer();

   deferred.resolve("Success!");

   deferred.promise.then(function(value){
     // value here is "Success!"
   });
   ```

  @method defer
  @static
  @for RSVP
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Object}
 */
function defer(label) {
  var deferred = { resolve: undefined, reject: undefined };

  deferred.promise = new Promise(function (resolve, reject) {
    deferred.resolve = resolve;
    deferred.reject = reject;
  }, label);

  return deferred;
}

/**
 `RSVP.map` is similar to JavaScript's native `map` method, except that it
  waits for all promises to become fulfilled before running the `mapFn` on
  each item in given to `promises`. `RSVP.map` returns a promise that will
  become fulfilled with the result of running `mapFn` on the values the promises
  become fulfilled with.

  For example:

  ```javascript

  let promise1 = RSVP.resolve(1);
  let promise2 = RSVP.resolve(2);
  let promise3 = RSVP.resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  let mapFn = function(item){
    return item + 1;
  };

  RSVP.map(promises, mapFn).then(function(result){
    // result is [ 2, 3, 4 ]
  });
  ```

  If any of the `promises` given to `RSVP.map` are rejected, the first promise
  that is rejected will be given as an argument to the returned promise's
  rejection handler. For example:

  ```javascript
  let promise1 = RSVP.resolve(1);
  let promise2 = RSVP.reject(new Error('2'));
  let promise3 = RSVP.reject(new Error('3'));
  let promises = [ promise1, promise2, promise3 ];

  let mapFn = function(item){
    return item + 1;
  };

  RSVP.map(promises, mapFn).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(reason) {
    // reason.message === '2'
  });
  ```

  `RSVP.map` will also wait if a promise is returned from `mapFn`. For example,
  say you want to get all comments from a set of blog posts, but you need
  the blog posts first because they contain a url to those comments.

  ```javscript

  let mapFn = function(blogPost){
    // getComments does some ajax and returns an RSVP.Promise that is fulfilled
    // with some comments data
    return getComments(blogPost.comments_url);
  };

  // getBlogPosts does some ajax and returns an RSVP.Promise that is fulfilled
  // with some blog post data
  RSVP.map(getBlogPosts(), mapFn).then(function(comments){
    // comments is the result of asking the server for the comments
    // of all blog posts returned from getBlogPosts()
  });
  ```

  @method map
  @static
  @for RSVP
  @param {Array} promises
  @param {Function} mapFn function to be called on each fulfilled promise.
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled with the result of calling
  `mapFn` on each fulfilled promise or value when they become fulfilled.
   The promise will be rejected if any of the given `promises` become rejected.
  @static
*/
function map(promises, mapFn, label) {
  return Promise.all(promises, label).then(function (values) {
    if (!isFunction(mapFn)) {
      throw new TypeError("You must pass a function as map's second argument.");
    }

    var length = values.length;
    var results = new Array(length);

    for (var i = 0; i < length; i++) {
      results[i] = mapFn(values[i]);
    }

    return Promise.all(results, label);
  });
}

/**
  This is a convenient alias for `RSVP.Promise.resolve`.

  @method resolve
  @static
  @for RSVP
  @param {*} value value that the returned promise will be resolved with
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$2(value, label) {
  return Promise.resolve(value, label);
}

/**
  This is a convenient alias for `RSVP.Promise.reject`.

  @method reject
  @static
  @for RSVP
  @param {*} reason value that the returned promise will be rejected with.
  @param {String} label optional string for identifying the returned promise.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$2(reason, label) {
  return Promise.reject(reason, label);
}

/**
 `RSVP.filter` is similar to JavaScript's native `filter` method, except that it
  waits for all promises to become fulfilled before running the `filterFn` on
  each item in given to `promises`. `RSVP.filter` returns a promise that will
  become fulfilled with the result of running `filterFn` on the values the
  promises become fulfilled with.

  For example:

  ```javascript

  let promise1 = RSVP.resolve(1);
  let promise2 = RSVP.resolve(2);
  let promise3 = RSVP.resolve(3);

  let promises = [promise1, promise2, promise3];

  let filterFn = function(item){
    return item > 1;
  };

  RSVP.filter(promises, filterFn).then(function(result){
    // result is [ 2, 3 ]
  });
  ```

  If any of the `promises` given to `RSVP.filter` are rejected, the first promise
  that is rejected will be given as an argument to the returned promise's
  rejection handler. For example:

  ```javascript
  let promise1 = RSVP.resolve(1);
  let promise2 = RSVP.reject(new Error('2'));
  let promise3 = RSVP.reject(new Error('3'));
  let promises = [ promise1, promise2, promise3 ];

  let filterFn = function(item){
    return item > 1;
  };

  RSVP.filter(promises, filterFn).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(reason) {
    // reason.message === '2'
  });
  ```

  `RSVP.filter` will also wait for any promises returned from `filterFn`.
  For instance, you may want to fetch a list of users then return a subset
  of those users based on some asynchronous operation:

  ```javascript

  let alice = { name: 'alice' };
  let bob   = { name: 'bob' };
  let users = [ alice, bob ];

  let promises = users.map(function(user){
    return RSVP.resolve(user);
  });

  let filterFn = function(user){
    // Here, Alice has permissions to create a blog post, but Bob does not.
    return getPrivilegesForUser(user).then(function(privs){
      return privs.can_create_blog_post === true;
    });
  };
  RSVP.filter(promises, filterFn).then(function(users){
    // true, because the server told us only Alice can create a blog post.
    users.length === 1;
    // false, because Alice is the only user present in `users`
    users[0] === bob;
  });
  ```

  @method filter
  @static
  @for RSVP
  @param {Array} promises
  @param {Function} filterFn - function to be called on each resolved value to
  filter the final results.
  @param {String} label optional string describing the promise. Useful for
  tooling.
  @return {Promise}
*/

function resolveAll(promises, label) {
  return Promise.all(promises, label);
}

function resolveSingle(promise, label) {
  return Promise.resolve(promise, label).then(function (promises) {
    return resolveAll(promises, label);
  });
}
function filter(promises, filterFn, label) {
  var promise = isArray(promises) ? resolveAll(promises, label) : resolveSingle(promises, label);
  return promise.then(function (values) {
    if (!isFunction(filterFn)) {
      throw new TypeError("You must pass a function as filter's second argument.");
    }

    var length = values.length;
    var filtered = new Array(length);

    for (var i = 0; i < length; i++) {
      filtered[i] = filterFn(values[i]);
    }

    return resolveAll(filtered, label).then(function (filtered) {
      var results = new Array(length);
      var newLength = 0;

      for (var i = 0; i < length; i++) {
        if (filtered[i]) {
          results[newLength] = values[i];
          newLength++;
        }
      }

      results.length = newLength;

      return results;
    });
  });
}

var len = 0;
var vertxNext = undefined;
function asap(callback, arg) {
  queue$1[len] = callback;
  queue$1[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 1, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    scheduleFlush$1();
  }
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  var nextTick = process.nextTick;
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // setImmediate should be used instead instead
  var version = process.versions.node.match(/^(?:(\d+)\.)?(?:(\d+)\.)?(\*|\d+)$/);
  if (Array.isArray(version) && version[1] === '0' && version[2] === '10') {
    nextTick = setImmediate;
  }
  return function () {
    return nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }
  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    return node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  return function () {
    return setTimeout(flush, 1);
  };
}

var queue$1 = new Array(1000);

function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue$1[i];
    var arg = queue$1[i + 1];

    callback(arg);

    queue$1[i] = undefined;
    queue$1[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertex() {
  try {
    var r = require;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush$1 = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush$1 = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush$1 = useMutationObserver();
} else if (isWorker) {
  scheduleFlush$1 = useMessageChannel();
} else if (browserWindow === undefined && typeof require === 'function') {
  scheduleFlush$1 = attemptVertex();
} else {
  scheduleFlush$1 = useSetTimeout();
}

var platform = undefined;

/* global self */
if (typeof self === 'object') {
  platform = self;

  /* global global */
} else if (typeof global === 'object') {
    platform = global;
  } else {
    throw new Error('no global: `self` or `global` found');
  }

var _async$filter;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// defaults

// the default export here is for backwards compat:
//   https://github.com/tildeio/rsvp.js/issues/434
config.async = asap;
config.after = function (cb) {
  return setTimeout(cb, 0);
};
var cast = resolve$2;

var async = function async(callback, arg) {
  return config.async(callback, arg);
};

function on() {
  config['on'].apply(config, arguments);
}

function off() {
  config['off'].apply(config, arguments);
}

// Set up instrumentation through `window.__PROMISE_INTRUMENTATION__`
if (typeof window !== 'undefined' && typeof window['__PROMISE_INSTRUMENTATION__'] === 'object') {
  var callbacks = window['__PROMISE_INSTRUMENTATION__'];
  configure('instrument', true);
  for (var eventName in callbacks) {
    if (callbacks.hasOwnProperty(eventName)) {
      on(eventName, callbacks[eventName]);
    }
  }
}var rsvp = (_async$filter = {
  cast: cast,
  Promise: Promise,
  EventTarget: EventTarget,
  all: all$1,
  allSettled: allSettled,
  race: race$1,
  hash: hash,
  hashSettled: hashSettled,
  rethrow: rethrow,
  defer: defer,
  denodeify: denodeify,
  configure: configure,
  on: on,
  off: off,
  resolve: resolve$2,
  reject: reject$2,
  map: map
}, _defineProperty(_async$filter, 'async', async), _defineProperty(_async$filter, 'filter', // babel seems to error if async isn't a computed prop here...
filter), _async$filter);

exports['default'] = rsvp;
exports.cast = cast;
exports.Promise = Promise;
exports.EventTarget = EventTarget;
exports.all = all$1;
exports.allSettled = allSettled;
exports.race = race$1;
exports.hash = hash;
exports.hashSettled = hashSettled;
exports.rethrow = rethrow;
exports.defer = defer;
exports.denodeify = denodeify;
exports.configure = configure;
exports.on = on;
exports.off = off;
exports.resolve = resolve$2;
exports.reject = reject$2;
exports.map = map;
exports.async = async;
exports.filter = filter;

Object.defineProperty(exports, '__esModule', { value: true });

})));

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":7}]},{},[1]);
