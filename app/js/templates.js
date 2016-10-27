function setHTML_BannerX99(item) {
  console.log('setHTML_BannerX99 running!');
  return ('<li class="BannerX99_unit responsiveFontSizeX99 pad06_vertical ">' +
            setHTML_offerUnit_href(item) +
              setHTML_offerUnit_imgWrapOnly(item) +
            setHTML_offerUnit_href_closing(item) +
          '</li>');
}

function setHTML_superDod(item) {
  //console.log('setHTML_superDod running!');
  return ('<div class="dodSuperDeal_unit   ' + categoryName + '"' + setID_pogId(item) + '>' +
  set_SoldOUt_ModuleX99(item) +
    setHTML_offerUnit_innerContWrap(item) +
      set_SoldOUt_ModuleX99_mod(item) +
      setHTML_offerUnit_href(item) +
      setHTML_offerUnit_href_afterWrap() +
          setHTML_offerUnit_nonImgContWrap() +
            setHTML_wrapCenterCont() +
              setHTML_centeredContX() +
                setHTML_offerUnit_discountWrap(item) +
                setHTML_offerUnit_title(item) +
                setHTML_offerUnit_priceTaglineWrap_rel(item) +
                setHTML_offerUnit_ratingWrap(item) +
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
  console.log('setHTML_reason running!');
  return ('<li class="reason_unit responsiveFontSizeX99 ' + categoryName + '">' +
    setHTML_reasonsToBuy_tagline(item) +
  '</li>');
}

function setHTML_defaultOfferLiUnit(item) {
  console.log('setHTML_defaultOfferLiUnit running!');
  return ('<li class=" OffersContentBoxLi ' + categoryName + ' ' + filterTag + '"' + setID_pogId(item) +'>' +
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
