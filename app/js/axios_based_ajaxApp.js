//Our dependencies
var Blazy = require('Blazy');
var fastdom = require('fastdom');
var promise = require('es6-promise');
//var RSVP = require('rsvp');
var axios = require('axios');
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

var isUCBrowserX99 = navigator.userAgent.indexOf('UCBrowser') > 0;
var userAgentX99 = navigator.userAgent;

// +++++ nonPromiseXHR Module +++++ //
var nonPromise = false;
var count = 0;
var len_offerData;
var firstData_arr = [];
var secondData_arr = [];
var dataContainerForRender = [];
var nonPromise_firstHTMLContent_arr = [];
var nonPromise_finalHTMLContent_arr = [];
var nonPromiseXHR = (function(){
    var public = {};
    public.get = function(url, callback){
      var request = new XMLHttpRequest();
          request.onreadystatechange = function(){
            if(request.readyState === 4){
              if(request.status === 200){
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

//if not UCBrowser only then define myFastdom
//else render fails in UCBrowser
if(!isUCBrowserX99){
  //console.log('navigator.userAgent: ', navigator.userAgent);
  var myFastdom = fastdom.extend(fastdomPromised);
}
/*
if(isUCBrowserX99){
  document.getElementById('UCBrowserTrue').style.color = "red";
  document.getElementById('UCBrowserTrue').innerHTML = '"' + userAgentX99 + '"';
}

else {
    document.getElementById('UCBrowserTrue').style.color = "green";
    document.getElementById('UCBrowserTrue').innerHTML = '"' + userAgentX99 + '"';
}
*/

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
        TimerOffer: false//check if TimerOffer
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
        if(filterBy){
          console.log('filterBy: ', filterBy);
        }
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

        //nonPromise global updated to true if UCBrowser
        if(isUCBrowserX99){
          nonPromise = true;
        }
        else {
          nonPromise = false;
        }
        console.log('nonPromise: ', nonPromise);
        //startXHR start
        firstXHR_start(url);
      //end of init
      };
    //expose AjaxPageApp.setData_var = false;
    //globalQuery var
    return public;

    // +++++ commonUtil XHR fns +++++ //
    function firstXHR_start(url_f){
      //console.log('test firstXHR_start first Url: ', url_f);
      firstXHR_startReqRenderAndProceed(url_f);
    }

    function firstXHR_startReqRenderAndProceed(url_f){
      //console.log('dom_targetIds_arr: ', dom_targetIds_arr);
      for(var i=0; i<dom_targetIds_arr.length; i++){
          dataContainerForRender.push([]);
          nonPromise_finalHTMLContent_arr.push([]);
      }

      if(nonPromise === true){
        //console.log('define nonPromise xhr method');
        console.log('running nonPromise based first xhr');
        nonPromiseXHR.get(url_f, XHR_useFirstData);
      }
      else {
          promiseXHRfirst_start(url);
      }
    }

    function promiseXHRfirst_start(url) {
      //use rsvp
      console.log('running promise based first xhr');
      //getJSON(url)
      axios.get(url)
      .then(function(json) {
        //console.log('rsvp data: ', json);
        XHR_useFirstData(json);
      })
      .catch(function(error) {
        console.log('error in promiseXHRfirst_start: ', error);
      });
    }

    function XHR_useFirstData(response){
      var data = (response.data);
      if(nonPromise === true){
          //data = JSON.parse(response);
      }
      //console.log('data from XHR_useFirstData: ', data);
      len_offerData = data.length;
      //console.log('len_offerData wtf: ', len_offerData);
      var firstData_arr_injected = inject_dataContainer(data, firstData_arr);
      //send secondRequest
      if(firstData_arr_injected){
          if (pogIdList_arr.length < 1) {
            console.log('no pogIds found, let us run render');
            //createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
            inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, firstData_arr, dataContainerForRender);
            checkResolved_Run_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);

            return;

          } else {
            //codepenUrl
            var Url_secondRequest = getUrl_secondRequest();
            //console.log('Url_secondRequest: ', Url_secondRequest);
            //nonPromiseRender Method
            if(nonPromise === true){
              console.log('running nonPromise based second xhr');
              nonPromiseXHR.get(Url_secondRequest, XHR_useSecondData);
            }
            //PromiseRender Method
            else {
                //console.log('firstData_arr: ', firstData_arr);
                //if promise === true
                //setFirstRender
                inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, firstData_arr, dataContainerForRender);

                checkResolved_Run_multiRender_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);

                //console.log('dataContainerForRender inside fastdom render: ', dataContainerForRender);

                //single render flow
                //promiseXHRsecond_start(Url_secondRequest);
            }
          }
      }
    }

    function inject_dataContainer(data, dataContainer){
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

        if(dataContainer.length == len_offerData){
          return true;
        }
        else {
          setTimeout(function () {
            console.log('keep pushing');
              inject_dataContainer(data, dataContainer);
          }, 10);
        }
    }

    function promiseXHRsecond_start(url) {
      //use rsvp
      console.log('running promise based second xhr');
      axios.get(url)
      //getJSON(url)
      .then(function(json) {
        //console.log('rsvp second data: ', json);
        XHR_useSecondData(json);
      })
      .catch(function(error) {
        console.log('error in promiseXHRsecond_start');
      });
    }

    function XHR_useSecondData(response){
      var data = (response.data);
      if(nonPromise === true){
          data = JSON.parse(response);
          //data = response.data;
      }
      console.log('data from XHR_useSecondData: ', data);
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
          console.log('dom_targetIds_arr: ', dom_targetIds_arr);
          inject_dataContainerForRender_by_categoryNames(dom_targetIds_arr, secondData_arr, dataContainerForRender);
          checkResolved_Run_createTemplatesSetHTML_byCategoryNames(dataContainerForRender);

          var blazy = new Blazy({
              loadInvisible: true
          });
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
          createTemplatesSetHTML_byCategoryNames(dataContainerForRender);
      }
    }

    function checkResolved_Run_multiRender_createTemplatesSetHTML_byCategoryNames(){
      //console.log('checkResolved_Run_multiRender_createTemplatesSetHTML_byCategoryNames running!');
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
      console.log('createTemplatesSetHTML_byCategoryNames running!!!');
      //console.log('dataContainerForRender inside setHTML: ', dataContainerForRender);
      dataContainerForRender.forEach(function (this_innerArr, index, arr) {
        if (!this_innerArr[0]) {
          console.log('this_innerArr[] ' + index + ' is undefined || not found in data');
          return false;
        }
        var categoryName = this_innerArr[0].categoryName;
        this_innerArr[0].categoryName = this_innerArr[0].categoryName ? this_innerArr[0].categoryName : 'undefined';

          //unit_htmlContent for a categoryName
          var unit_htmlContentBy_categoryName = this_innerArr.map(function(item) {
            var pogId = item.pogId;
            //console.log('pogId: ', pogId);
            var categoryName = item.categoryName;
            //console.log('categoryName: ', categoryName);
            //use highlights for defining filterTags
            var filterTag = item.highlights;
            //console.log('filterTag: ', filterTag);
            var catalogId;
            var supc;
            if (categoryName.indexOf('BannerX99') > -1) {
              return setHTML_BannerX99(item);
            }
            else if (categoryName.indexOf('superDod') > -1) {
              return setHTML_superDod(item);
            }
            else if (categoryName.indexOf('reason') > -1) {
              return setHTML_reason(item);
            }
            else {
                return setHTML_defaultOfferLiUnit(item);
            }
        }).join('');
      nonPromise_finalHTMLContent_arr[index].push(unit_htmlContentBy_categoryName);

      if(nonPromise === true){
        for (var i = 0; i < nonPromise_finalHTMLContent_arr.length; i++) {
          var wrapper_dom = document.getElementById(dom_categoryNames_arr[i]);
          wrapper_dom.innerHTML = nonPromise_finalHTMLContent_arr[i].join('');
        }
      }
      else {
        console.log('run fastdom setHTML');
        fastdom.mutate(function() {
         for (var i = 0; i < nonPromise_finalHTMLContent_arr.length; i++) {
           var wrapper_dom = document.getElementById(dom_categoryNames_arr[i]);
           wrapper_dom.innerHTML = nonPromise_finalHTMLContent_arr[i].join('');
         }
       });
      }

      });
    }

    function multiRender_createTemplatesSetHTML_byCategoryNames(dataContainerForRender) {
      //console.log('first multiRender_createTemplatesSetHTML_byCategoryNames running!!!');
      //console.log('dataContainerForRender inside setHTML: ', dataContainerForRender);
      dataContainerForRender.forEach(function (this_innerArr, index, arr) {
        if (!this_innerArr[0]) {
          console.log('this_innerArr[] ' + index + ' is undefined || not found in data');
          return false;
        }
        var categoryName = this_innerArr[0].categoryName;
        this_innerArr[0].categoryName = this_innerArr[0].categoryName ? this_innerArr[0].categoryName : 'undefined';

          //unit_htmlContent for a categoryName
          var unit_htmlContentBy_categoryName = this_innerArr.map(function(item) {
            var pogId = item.pogId;
            //console.log('pogId: ', pogId);
            var categoryName = item.categoryName;
            //console.log('categoryName: ', categoryName);
            //use highlights for defining filterTags
            var filterTag = item.highlights;
            //console.log('filterTag: ', filterTag);
            var catalogId;
            var supc;
            if (categoryName.indexOf('BannerX99') > -1) {
              return setHTML_BannerX99(item);
            }
            else if (categoryName.indexOf('superDod') > -1) {
              return setHTML_superDod(item);
            }
            else if (categoryName.indexOf('reason') > -1) {
              return setHTML_reason(item);
            }
            else {
                return setHTML_defaultOfferLiUnit(item);
            }
        }).join('');

      nonPromise_finalHTMLContent_arr[index].push(unit_htmlContentBy_categoryName);

      //myFastdom_setHTML_MultipleRender();
      });

      //console.log('nonPromise_finalHTMLContent_arr: ', nonPromise_finalHTMLContent_arr);

      XHR_fastDomPromiseReqRender();

        function XHR_fastDomPromiseReqRender() {
              console.log('XHR_fastDomPromiseReqRender running');
              //setFirstRender
              myFastdom.mutate(function() {
                for (var i = 0; i < nonPromise_finalHTMLContent_arr.length; i++) {
                  var wrapper_dom = document.getElementById(dom_categoryNames_arr[i]);
                  wrapper_dom.innerHTML = nonPromise_finalHTMLContent_arr[i].join('');
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
                  return axios.get(Url_secondRequest);
                }
              })
              //second then ~ fastdom
              .then(function(second_response) {
                var second_data = second_response.data;
                //console.log('data from second req re: ', second_data);

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
function setHTML_BannerX99(item) {
  return ('<li class="BannerX99_unit responsiveFontSizeX99 pad06_vertical ">' +
            setHTML_offerUnit_href(item) +
              setHTML_offerUnit_imgWrapOnly(item) +
            setHTML_offerUnit_href_closing(item) +
          '</li>');
}

function setHTML_superDod(item) {
  return ('<div class="dodSuperDeal_unit   ' + setClassName_categoryName(item) + '"' + setID_pogId(item) + '>' +
  set_SoldOUt_ModuleX99(item) +
    setHTML_offerUnit_innerContWrap(item) +
      set_SoldOUt_ModuleX99_mod(item) +
      setHTML_offerUnit_href(item) +
      setHTML_offerUnit_href_afterWrap() +
          setHTML_offerUnit_nonImgContWrap() +
            setHTML_wrapCenterCont() +
              setHTML_centeredContX() +
                setHTML_offerUnit_discountWrap_mod() +
                setHTML_offerUnit_title(item) +
                setHTML_offerUnit_ratingWrap_mod() +
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

function setHTML_reason(item) {
  //console.log('setHTML_reason running!');
  return ('<li class="reason_unit responsiveFontSizeX99 ' + setClassName_categoryName(item) + '">' +
    setHTML_reasonsToBuy_tagline(item) +
  '</li>');
}

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
      var price_html = 'Rs. ' + item.price;
      var displayPrice_html = 'Rs. ' + item.displayPrice;

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
  var dom_offerUnit_Soldout = DOM_append_target.querySelector('.offerUnit_Soldout');
  var dom_offerUnit_href = DOM_append_target.querySelector('offerUnit_href');
  /*
  //ignore JSHint Error
  // +++++ show soldOut if soldOut +++++ //
  if(item.soldOut == true){
    var id_parent_offerUnit = item.id;
    var dom_id_parent_offerUnit = document.getElementById(id_parent_offerUnit);

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

  // +++++ removeSoldOutParentUnit +++++ //
  */
  if(item.soldOut == true){
    //console.log('removeSoldOutParentUnit if soldout');
    var id_parent_offerUnit = item.id;
    var dom_id_parent_offerUnit = document.getElementById(id_parent_offerUnit);
    if(dom_id_parent_offerUnit){
        //console.log('parentNode error');
        dom_id_parent_offerUnit.parentNode.removeChild(dom_id_parent_offerUnit);
    }
    //console.log(item.id + ' was sold out');
    //if dod
    if(document.getElementsByClassName('superDeals_centered')){
      var dom_superDeals_centered = document.getElementsByClassName('superDeals_centered');
      for(var i=0; i< dom_superDeals_centered.length; i++){
        var this_dom_superDeals_centered = dom_superDeals_centered[i];
        //element.children.length > 0
        if(this_dom_superDeals_centered.children.length < 1){
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

  }
  // +++++ /removeSoldOutParentUnit +++++ //
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
  //console.log('setHTML_offerUnit_priceTaglineWrap_rel_mod is running!');
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
          return (offerUnit_priceTaglineWrap_rel + priceContXFragments + '</div>');
        }
    }
    return priceOrTagline_dom(item); //
}

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
  //console.log('setHTML_offerUnit_priceTaglineWrap_rel_mod is running!');
    var OfferDiscount_Wrap = '<div class="offerUnit_discountWrap">' + setHTMLContent_offerUnit_discount_nonPromise(item) + '</div>';
    var offerUnit_priceTaglineWrap_rel = '<div class="offerUnit_priceTaglineWrap_rel">';
    var tagLineFragments = '<div class="offerUnit_taglineWrap"><div class="offerUnit_tagline">' + item.tagLine + '</div></div>';
    var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_price">' + 'Rs. ' + item.price + '</span>' + '<span class="offerUnit_displayPrice">' + 'Rs. ' + item.displayPrice + '</span></span>' + '</div>';
    var displayPriceOnlyFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_displayPrice">' + 'Rs. ' + item.displayPrice + '</span></span>' + '</div>';

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

function setHTML_offerUnit_priceTaglineWrap_rel(item) {
    var offerUnit_priceTaglineWrap_rel = '<div class="offerUnit_priceTaglineWrap_rel">';
    var tagLineFragments = '<div class="offerUnit_taglineWrap"><div class="offerUnit_tagline">' + item.tagLine + '</div></div>';
    /*var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll">Rs.' + '<span class="offerUnit_price">' + item.price + '</span>&nbsp; &nbsp;</span>' + '<span class="offerUnit_displayPrice"><span>Rs.&nbsp;</span>' + item.displayPrice + '</span>' + '</div>';*/
    var priceContXFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_price">Rs.&nbsp;' + item.price + '</span>&nbsp; &nbsp;' + '<span class="offerUnit_displayPrice">Rs.&nbsp;' + item.displayPrice + '</span></span>' + '</div>';
    var displayPriceOnlyFragments = '<div class="offerUnit_priceWrap"><span class="offerUnit_priceWrapAll"><span class="offerUnit_displayPrice">Rs.&nbsp;' + item.displayPrice + '</span></span>' + '</div>';

    function priceOrTagline_dom(item) {
        if (item.tagLine) {
            return (offerUnit_priceTaglineWrap_rel + tagLineFragments + '</div>');
        }
        if (item.price || item.displayPrice) {
            if (item.price == item.displayPrice) {
                //console.log(item.pogId, ' has same MRP & SP!');
                return (offerUnit_priceTaglineWrap_rel + displayPriceOnlyFragments + '</div>');
            } else {
                return (offerUnit_priceTaglineWrap_rel + priceContXFragments + '</div>');
            }
        } else {
            return (offerUnit_priceTaglineWrap_rel + '</div>');
        }
    }
    return priceOrTagline_dom(item); //
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
    var blazy_img = '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />';
    var nonLazy_img = '<img class="offerUnit_img nonLazyX99 OfferImg"' +  'src="'+item.offerImageUrl +'" ' +  'alt="' + item.offerName + '" />';

    if(!isUCBrowserX99){
      if(item.sdGold === true){
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + sdPlusLogo + nonLazy_img + '</div>');
      }
      else {
        return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + nonLazy_img + '</div>');
      }
      return ('<div class="offerUnit_imgWrap_sdPlusInc_rel">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
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
    return ('<div class="offerUnit_imgWrapOnly">' + '<img class="offerUnit_img OfferImg b-lazy" data-src="' + item.offerImageUrl + '" src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" alt="' + item.offerName + '" />' + '</div>');
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
    var ifRatingDefined_dom_V = ifRatingDefined_dom(item);
    var setRating_V = setRating(item);
    var rating_Wrap = '<div class="offerUnit_ratingWrap">';
    var ratingFragments = '<div class="offerUnit_rating_rel"><div class="ratingBG_disabled"></div>' + '<div class="ratingBG_active" style="width:' + setRating_V + 'px;"></div></div>';
    var reviewsFragments = '<span class="numberRevsX">(' + item._noOfReviews + ')</span>';

    function ifRatingDefined_dom(item) {
        if (item.avgRating) {
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
    return ifRatingDefined_dom(item); //
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
    return dod_showDiscountUnless0_dom(item); //
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
function set_SoldOUt_ModuleX99(item) {
  var soldOut_Wrap = '<div class="offerUnit_Soldout"><div class="offerUnit_Soldout_btn">SOLD OUT</div></div>';
    if(nonPromise === true){
      if (item.soldOut) {
          return soldOut_Wrap;
      } else {
          return '';
      }
    }
    else {
      return '<div>'+ 'soldOut ' +'</div>';
    }

}

function set_SoldOUt_ModuleX99_mod(item) {
    var soldOut_Wrap = '<div class="offerUnit_Soldout"><div class="offerUnit_Soldout_btn">SOLD OUT</div></div>';
    if(item.pogId){
        return soldOut_Wrap;
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
