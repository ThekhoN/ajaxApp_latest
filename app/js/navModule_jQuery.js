// +++++ requires jQuery +++++ //
// +++++ requires scrollToFixed_inVw_debounce +++++ //
//detect css transition end dependency jQuery dependency MUST BE GLOBAL
! function(n, i, t, o) {
    var a = t.body || t.documentElement,
        a = a.style,
        e = "",
        s = "";
    "" == a.WebkitAnimation && (e = "-webkit-"), "" == a.MozAnimation && (e = "-moz-"), "" == a.OAnimation && (e = "-o-"), "" == a.WebkitTransition && (s = "-webkit-"), "" == a.MozTransition && (s = "-moz-"), "" == a.OTransition && (s = "-o-"), n.fn.extend({
        onCSSAnimationEnd: function(i) {
            var t = n(this).eq(0);
            return t.one("webkitAnimationEnd mozAnimationEnd oAnimationEnd oanimationend animationend", i), ("" != e || "animation" in a) && "0s" != t.css(e + "animation-duration") || i(), this
        },
        onCSSTransitionEnd: function(i) {
            var t = n(this).eq(0);
            return t.one("webkitTransitionEnd mozTransitionEnd oTransitionEnd otransitionend transitionend", i), ("" != s || "transition" in a) && "0s" != t.css(s + "transition-duration") || i(), this
        }
    })
}(jQuery, window, document);
// end of detect css transition end
(function($) {
    var mainWrapperX99 = $('#mainWrapperX_newX999');
    $(document).ready(function() {
        // +++++ vars for slideInNav
        var mainNavX = mainWrapperX99.find('.navMainX_Wrapper');
        var mainNavX_fixedAtTop = mainWrapperX99.find('.topNavX99');
        var x99bgWrap = mainWrapperX99.find('.x99bgWrap');
        var innerMenuWrap = mainWrapperX99.find('.menuInnerX99');
        var menuSectionX = innerMenuWrap.find('.menuSectionX');
        var hamburgerContX = mainWrapperX99.find('.hamburgerContX');
        var hamburger = hamburgerContX.find('.scrollTo_menuX99');
        var arrowDownX99 = hamburger.find('.arrowDownX99');
        var arrowCloseX99 = hamburger.find('.arrowCloseX99');
        var scrollTo_menuX99 = mainNavX.find('.scrollTo_menuX99');
        var scrollTo_menuX99_clickEle = mainNavX.find('.scrollTo_menuX99 .clickEle');
        var activeClass = 'activeX99';
        /// +++++ scrollToFixed_inVw_debounced_MODULE +++++ ///

        // jquery, scrollToFixed, isInvwport, debounce//
        var scrollToFixed_inVw_debounced_MODULE = (function() {
            //inner vars for use

            var headerBannerX = mainWrapperX99.find('.headerBannerX');
            var navClass = 'navX99';
            var dataScrollToTargetAttr = 'data-target';
            var dataFilterAttr = 'data-filter';
            var activeClass = 'activeX99';
            var p = {};
            p.scrollToFixed = function () {
              //this sets the nav to fixed onScroll
              // +++++ enable this to always fix
              //mainNavX_fixedAtTop.scrollToFixed();
              if(mainWrapperX99.find('.headerBannerX').length){
                console.log(headerBannerX);
                console.log('headerBannerX found!');
                headerBannerX.find('img').one('load', function() {
                    mainNavX_fixedAtTop.scrollToFixed();
                    console.log('scrollToFixed running');
                }).each(function() {
                    if (this.complete) $(this).load();
                });
              }
              else {
                  mainNavX_fixedAtTop.scrollToFixed();
                  console.log('headerBannerX not found!');
              }


            };
            p.scrollTo_inVwActiv8 = function() {

                mainNavX.find('[' + dataScrollToTargetAttr + ']').on('click', function(e) {
                    //e.preventDefault();
                    //get mainNavHeight for calc offset
                    var mainNavXHeight = mainNavX.height();
                    //console.log(mainNavXHeight);
                    var $this = $(this),
                        targeterino = $(this).attr(dataScrollToTargetAttr),
                        activeOneX = $(this).addClass(activeClass).siblings("li").removeClass(activeClass);
                    $('html, body').animate({
                        scrollTop: $('#' + targeterino).offset().top - (mainNavXHeight)
                    }, 1000, "swing");
                });
            };
            p.filterToggle = function() {
                //console.log('filterToggle running!');
                mainNavX.find('[' + dataFilterAttr + ']').on('click', function(e) {
                    //console.log('filter control was clicked!');
                    e.preventDefault();
                    var this_clicked = $(this);
                    //console.log('this_clicked: ', this_clicked);
                    this_clicked.addClass(activeClass).siblings("li").removeClass(activeClass);
                    //get mainNavHeight for calc offset
                    var filterAttr = this_clicked.data('filter');
                    console.log(filterAttr);
                    if(filterAttr === 'all'){
                        $('li.AllOffers_filterX99').css({'display': 'inline-block'});
                    }
                    else {
                      $('li.AllOffers_filterX99').css({'display': 'none'});
                      $('li.AllOffers_filterX99.' + filterAttr).css({'display': 'inline-block'});
                    }
                    //jump to
                    var jumpToTarget = '#DealofDayOffers_offerUnit_Wrapper';
                    //console.log('jumpToTarget: ', jumpToTarget);

                    function htmlJumpToLocation(id){
                        var top = document.getElementById(id).offsetTop;
                        //console.log('offsetTop: ', top);
                        window.scrollTo(0, top);
                        location.href = "#"+filterAttr;
                      }

                      htmlJumpToLocation('onClickFilter_ScrollTo');




                });
            };
            p.scrollActiv899 = function() {
                $('.scrollToSectionX:in-viewport(100)').run(function() {
                    //console.log('scrollActiv899 is running!!!');
                    var activ8This = $(this).attr('id');
                    //console.log('activ8This: ', activ8This);
                    mainNavX.find('[' + dataScrollToTargetAttr + ']').each(function() {
                        $(this).removeClass(activeClass);
                    });
                    mainNavX.find('[' + dataScrollToTargetAttr + '="' + activ8This + '"]').addClass(activeClass);
                });
            };

            return p;
        })();
        scrollToFixed_inVw_debounced_MODULE.scrollToFixed();
        scrollToFixed_inVw_debounced_MODULE.filterToggle();

        /// +++++ running scrollToFixed_inVw_debounced_MODULE +++++ ///
          //scrollToFixed_inVw_debounced_MODULE.init();
          //$(window).scroll($.debounce(250, scrollToFixed_inVw_debounced_MODULE.scrollActiv899));
        /// +++++ /scrollToFixed_inVw_debounced_MODULE +++++ ///

        /// +++++ hamburgerSlideIn +++++ ///
        /*
          hamburgerContX.data('clickState', true);
          hamburgerContX.on('click', function() {
              //console.log('hamburgerContX was clicked!');
              var $this = $(this);
              if ($this.data('clickState') && !innerMenuWrap.hasClass(activeClass) && !hamburger.hasClass(activeClass)) {
                  slideInAnim();
              } else {
                  slideOutAnim();
              }
              $this.data('clickState', !hamburgerContX.data('clickState'));
          });
          //emulate click outside
          x99bgWrap.on('click', function() {
              var $this = $(this);
              slideOutAnim();
              $this.hide();
              hamburgerContX.data('clickState', hamburgerContX.data('clickState', true));
          });
          //resize hamburgerContX size on resize
          function resize_hamburgerContX() {
              if ($(window).width() > 768) {
                  return;
              } else {
                  //console.log('do something');
                  var set_hamburgerContX_dimension = mainNavX.height();
                  scrollTo_menuX99.height(set_hamburgerContX_dimension);
                  scrollTo_menuX99.width(set_hamburgerContX_dimension);
                  scrollTo_menuX99_clickEle.width(set_hamburgerContX_dimension);
                  scrollTo_menuX99_clickEle.height(set_hamburgerContX_dimension);
              }
          }
          //run on load
          resize_hamburgerContX();
          //debounced
          $(window).resize($.debounce(250, resize_hamburgerContX));
          function slideInAnim() {
              hamburger.addClass(activeClass).onCSSAnimationEnd(function() {
                  innerMenuWrap.addClass(activeClass).onCSSAnimationEnd(function() {
                      menuSectionX.each(function() {
                          var $this = $(this);
                          $this.addClass(activeClass);
                      });
                      //toggle arrowClass
                      arrowDownX99.removeClass(activeClass);
                      arrowCloseX99.addClass(activeClass);
                  });
              });
              console.log('running slideIn');
              mainWrapperX99.find("li.navType").each(function() {
                  var $this = $(this);
                  $this.addClass('fadeTransparent');
              });
              x99bgWrap.show();
          }
          function slideOutAnim() {
              menuSectionX.each(function() {
                  var $this = $(this);
                  $this.removeClass(activeClass);
              }).onCSSAnimationEnd(function() {
                  innerMenuWrap.removeClass(activeClass);
                  //toggle arrowClass
                  arrowDownX99.addClass(activeClass);
                  arrowCloseX99.removeClass(activeClass);
              });
              hamburger.removeClass(activeClass);
              console.log('running slideOut');
              mainWrapperX99.find("li.navType").each(function() {
                  var $this = $(this);
                  $this.removeClass('fadeTransparent');
              });
              x99bgWrap.hide();
          }
        */
        /// +++++ /hamburgerSlideIn +++++ ///



        // +++++ show fixedNav on scrollUp
          //  +++++ vars for showFixedNavOnScrollUp
          //var mainNavX = mainWrapperX99.find('.navMainX_Wrapper');
          var scrolling;
          var val_lastScrollTop = 0;
          var limit = 5;


        // +++++ fixAtTheTop  +++++ //
        var heightTopFixedNav = mainNavX_fixedAtTop.height();
        function scrollToShowTopFixedNav() {
            var val_scrollTop = $(this).scrollTop();
            //if exceeds threshold
            if (Math.abs(val_lastScrollTop - val_scrollTop) <= limit) {
                mainNavX_fixedAtTop.removeClass('slideInX999');
                return;
            }
            if (val_scrollTop > val_lastScrollTop && val_scrollTop > heightTopFixedNav) {
                navSlideOut();
            } else {
                if (val_scrollTop + $(window).height() < $(document).height()) {
                    navSlideIn();
                }
            }
            val_lastScrollTop = val_scrollTop;
            //inner animate functions
            function navSlideOut() {
                mainNavX_fixedAtTop.removeClass('slideInX999');
            }

            function navSlideIn() {
                mainNavX_fixedAtTop.addClass('slideInX999');
            }
        }
        // +++++ /fixAtTheTop  +++++ //

        // +++++ fixAtTheBottom +++++ //
        var $botNavFxd = $('.botNavX99');
        var height_botNavFxd = $botNavFxd.height();
        function scrollBackUpToShowBotFixedNav() {
          var val_scrollTop = $(this).scrollTop();
          //if exceeds threshold
          if (Math.abs(val_lastScrollTop - val_scrollTop) <= limit) {
              return;
          }
          if (val_scrollTop > val_lastScrollTop && val_scrollTop > height_botNavFxd) {
              navSlideOut();
          } else {
              if (val_scrollTop + $(window).height() < $(document).height()) {
                  navSlideIn();
              }
          }
          val_lastScrollTop = val_scrollTop;
          //inner animate functions
          function navSlideOut() {
              $botNavFxd.removeClass('slideInX999_botFixed');
              setTimeout(function() {
                  $botNavFxd.removeClass('displayOn_invis_botFixed');
              }, 100);
          }

          function navSlideIn() {
              $botNavFxd.addClass('displayOn_invis_botFixed').onCSSAnimationEnd(function() {
                  $botNavFxd.addClass('slideInX999_botFixed');
              });
          }
        }
        // +++++ /fixAtTheBottom +++++ //

        function scrollToShowTopFixedNav_scrollToFixed_inVw() {
            console.log('scrollToShowFixedNav_scrollToFixed_inVw running!');
            scrollToShowTopFixedNav();
            scrollBackUpToShowBotFixedNav();
            scrollToFixed_inVw_debounced_MODULE.scrollActiv899();
        }

        function scrollToShowFixedNavs() {
            //console.log('scrollToShowFixedNavs running!');
            //scrollToShowTopFixedNav();
            //scrollBackUpToShowBotFixedNav();
            if($(window).width() > 1024){
              //for web
                scrollToShowTopFixedNav();
            }
            else {
              //for mobile
                scrollBackUpToShowBotFixedNav();
            }
        }

        //scrollToFixed_inVw_debounced_MODULE.init();
        //$(window).scroll($.debounce(250, scrollToFixed_inVw_debounced_MODULE.scrollActiv899));
        $(window).scroll($.debounce(250, scrollToShowFixedNavs));
        //end documentReady
    });
})(jQuery);
