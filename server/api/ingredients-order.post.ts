import type { IngredientWithProducts } from "./ingredients-search.post";

interface IngredientsOrderBody {
  ingredients: IngredientWithProducts[];
}

async function updateListingInBasket(listingId: string, quantity: number) {
  const headers = {
    accept: "application/vnd.com.rewe.digital.basket-v2+json",
    cookie:
      "trbo_usr=5911d119073a21fa2211cd83f0fb7faa; _rdfa=s:7369e340-43a1-4c52-bab0-4e72a73a406c.fyuHCYbEIUPcAgb+sphXwLx0ia2IT5RaISOnLFZWupM; s_ecid=MCMID%7C33623252820226652865786375525101435244; AMCVS_65BE20B35350E8DE0A490D45%40AdobeOrg=1; AMCV_65BE20B35350E8DE0A490D45%40AdobeOrg=179643557%7CMCMID%7C33623252820226652865786375525101435244%7CMCAID%7CNONE%7CMCOPTOUT-1718553432s%7CNONE%7CvVersion%7C5.5.0; s_cc=true; _fbp=fb.1.1718546232788.696264880217610320; _scid=c3ebc4d5-b731-4581-8ae6-17ce0c9cf1bc; _scid_r=c3ebc4d5-b731-4581-8ae6-17ce0c9cf1bc; trbo_us_5911d119073a21fa2211cd83f0fb7faa=%7B%22saleCount%22%3A0%2C%22sessionCount%22%3A4%2C%22brandSessionCount%22%3A4%2C%22pageViewCountTotal%22%3A13%2C%22sessionDurationTotal%22%3A1751%2C%22externalUserId%22%3A%22%22%2C%22userCreateTime%22%3A1704490131%7D; mf_2d859e38-92a3-4080-8117-c7e82466e45a=||1718546232859||0||||0|0|27.7108; _gcl_au=1.1.1655141637.1718546233; _pin_unauth=dWlkPVpUazRPRE0wTmpZdE1qVXdOQzAwT0RSbUxXRmxORGt0TURGak1HWm1ZbU01TVRkbA; _tt_enable_cookie=1; _ttp=Ac5USHNEmw_WooO2jBrYuXmlIqI; websitebot-launch=human-mousemove; _uetvid=6bc62100ac1111eeab5b079d1da61a17|iwkkse|1718546233336|1|1|bat.bing.com/p/insights/c/x; _cfuvid=t2YWTPkt5aaVc04wCGM.1Lh5faoSX0AKe4xRBsSeyjU-1718623190526-0.0.1.1-604800000; marketsCookie=%7B%22online%22%3A%7B%22wwIdent%22%3A%224040426%22%2C%22marketZipCode%22%3A%2204109%22%2C%22serviceTypes%22%3A%5B%22PICKUP%22%5D%2C%22customerZipCode%22%3A%2204109%22%7D%2C%22stationary%22%3A%7B%7D%7D; mtc=s:eyJ0ZXN0Z3JvdXBzSGFzaCI6IjgwNGEwOWYyY2I4YWQ4MDEzN2UwYjJiZTJiMGZhMDgzMmIzYzNkYmRkMWRjNTRlZDA1MTI0M2JjMTdhNWNhMWQiLCJoYXNoIjoiSkR1NVRrVkFoMm8yU1NJYW1JT1B3QT09Iiwic3RhYmxlIjpbInBheWJhY2stY2FyZC1jaGFuZ2UiLCJtZW5nZW5yYWJhdHRpZXJ1bmciLCJwYXliYWNrLWVjb3Vwb24tYXBpIiwicGF5YmFjay1ldm91Y2hlciIsIm9mZmVyLWRldGFpbHMtdHJhY2tpbmciLCJ3b29raWVlcy1waWNrdXAtcGFnZSIsInByb2R1Y3RsaXN0LWdhbS1zaXplcy0yMDI0IiwicHJlZmlsbGVkLWJhc2tldC1teXByb2R1Y3RzIiwiY21wMyIsIm5ldy1uYXZpZ2F0aW9uLXRyYWNraW5nIiwic29zLW9mZmVyLWZpbHRlciIsInBheWJhY2stcmV3ZS1uZXdzbGV0dGVyIiwicmV3ZS1zc28iLCJwYXliYWNrLXRhcmdldGVkLWJ1cm4iLCJwZXN0ZXItcG93ZXItaXRlbXMiLCJwYXliYWNrLXRhcmdldGVkLWJvbnVzLWNvdXBvbiJdLCJyZHRnYSI6W10sIm10Y0V4cGlyZXMiOjB9.VC3xKd4fh9rgQSpMY4hh6u0M1LV4N2k5tZTTsO6Dj88; MRefererUrl=direct; icVarSave=TC%2062%20Control%2Ctc_56_control%2Ctc116_c%2CSearch-Flyout-Tracking%20Treatment%2Ctc123_c%2CSearchBoost-Ctrl; rstp=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhZXMxOTIiOiIzZjVmYzJmNTRlMmU1MDE4ODUzZWM0MDUwY2NiMDhkMDExYWQ3YWEwMjRlZjc5ZWI0MjM5MTU1MDg0ZjhkYTM2MmQ3M2Q2MzU4NWFiNGQ0M2ViODViYmIyZWQxYzA4MWE3NmY3MWEzY2EzNjFlNjNkZDdiYTM2OTNjNDMyMmFhMzRhZDVjZGQ4ZTM3OGI2YjM2YTgxMGUwMjVjOGY2ZjJmNDgyMzk2MTVkY2UxZTZiNmUxNmRkYjc2MjQzYjMwYmRkNmFiYjI3ZmEwMzYzNjk2ZWM4MmU0NzQ2ZjYxNWIwYmVmYzJhZjEyMTg0NGEwZTcxZDQ3OGM4NjczZjI5NzE2MDgxYTIzYTQ2YWRiMDQyOWNmNWE3OWU0OGQyZDhhMjdiNTgwNmIyNWYxMWFjODMyYWI2ZjMxNWRhMTk5YWU4OTc2ZTNiZGNmNThhMWZiMTdkN2Q3Y2FmNGY2YTJkMWI4Yzc4ZTE1N2FkZWIxYmRhZDQwMzQyYjc5NGFkNTQ2ODNlZjk0MDI2Zjk5YjJhMDM1ZjRiNmFlZDE0MzczYjA5Y2I1ZGMwNTI4MjU4ZDAzNDc3YjYzNTU2YTQ4ZTI4OGYzMDc3M2U2YzM4OTc0YTdlNGMwZjU1YWQ4ODVmMzI3ZTgxMWVkZDM2ZTU5YTY3OThkY2Y4YzBiMDQxNDI1YTk5YzExNjA3OTc1MjIzMWMzMTU2MGM4ZWZmOTE0MWY5ZjUwZWUzYWMxMzFlZDM2YmEwNmQ4OWI0NDU0YTZmODAzYzcyYWJiZGIwZWI3NTczNmZiOWI0NWY4NGRmYWEwN2EwZDA1NWEwZjU1YmE0MmIxYzVmNDgzOTRiZmFkZmYyZGI2IiwiZXhwIjoxNzE4NjQ0NTkwLCJpYXQiOjE3MTg2NDM5OTB9.mu4TlDL-wTL2oFgBkia9x5lKw6mQO4ncQ6OISsketF8tqn2gmuLsjqAAtdRo_0on1Z1wzvqVD0hGIqXIGY23kA; __cf_bm=qF76BidXIzJua9l93ggcnZFHyy0PM7TBDh8tUUgzWPU-1718643990-1.0.1.1-Rc5nmnCsci_eSw4LhtW7R.ObnxaTmfYZKA0m.w.0Ml3458HdBEeaUapagH_e7zbbnHJz42eW4Jq1OAhvxB9zlA; __eoi=ID=43e34c8edcaabd58:T=1718629171:RT=1718643990:S=AA-AfjY19AAUfMAbkjuo1qaIF5az; cf_clearance=2BJbsnFtN0jXt1_jUYzclVozo9KKLy85Lma.m3av3lk-1718643990-1.0.1.1-2y4Q3tP7XrDODCvoobEl5yrZzqgp3sx2mptT_oLx3GIxCb5OCnOziqZjn0GjRimYm0Xwnui5Nb1Hd5l8fy_Qsw; consentSettings={%22Usercentrics-Consent-Management-Platform%22:1%2C%22Adobe-Launch%22:1%2C%22Adobe-Experience-Cloud-Identity-Service%22:1%2C%22AWIN%22:1%2C%22reCAPTCHA%22:1%2C%22Cloudflare%22:1%2C%22Keycloak%22:1%2C%22gstatic-com%22:1%2C%22JSDelivr%22:1%2C%22jQuery%22:1%2C%22Vimeo%22:1%2C%22Adobe-Analytics%22:1%2C%22Google-Ad-Manager-Basis%22:1%2C%22Funktionale-Cookies-und-Speicher%22:1%2C%22GfK-SENSIC%22:1%2C%22ChannelPilot%22:0%2C%22Adobe-Analytics-erweiterte-Web-Analyse%22:0%2C%22artegic-ELAINE-Software%22:0%2C%22Outbrain%22:0%2C%22RDFA-Technologie-Statistik-%22:0%2C%22Mouseflow%22:0%2C%22Facebook-Pixel%22:0%2C%22Microsoft-Advertising-Remarketing%22:0%2C%22Google-Maps%22:0%2C%22YouTube-Video%22:0%2C%22Google-Ads-Conversion-Tracking%22:0%2C%22Google-Ads-Remarketing%22:0%2C%22Snapchat-Advertising%22:0%2C%22Pinterest-Tags%22:0%2C%22trbo%22:0%2C%22TikTok-Advertising%22:0%2C%22LinkedIn-Ads%22:0%2C%22Taboola%22:0%2C%22DoubleClick-Floodlight%22:0%2C%22Cmmercl-ly%22:0%2C%22Google-Ad-Manager%22:0%2C%22RDFA-Technologie-Marketing-%22:0%2C%22The-Trade-Desk%22:0%2C%22tms%22:1%2C%22necessaryCookies%22:1%2C%22cmpPlatform%22:1%2C%22marketingBilling%22:1%2C%22fraudProtection%22:1%2C%22basicAnalytics%22:1%2C%22marketingOnsite%22:1%2C%22extendedAnalytics%22:0%2C%22serviceMonitoring%22:0%2C%22abTesting%22:0%2C%22conversionOptimization%22:0%2C%22feederAnalytics%22:0%2C%22personalAdsOnsite%22:0%2C%22remarketingOffsite%22:0%2C%22userProfiling%22:0%2C%22sessionMonitoring%22:0%2C%22targetGroup%22:0%2C%22advertisingOnsite%22:0}; perfTimings=event188=0.36%2Cevent189; perfLoad=0.36; c_lpv_a=1718644071560|int_internal_nn_nn_nn_nn_nn_nn_nn; s_ppn=rewe-de%3Ashop%3Asearch%3Aresults; s_sq=rewrewededev%3D%2526c.%2526a.%2526activitymap.%2526page%253Drewe-de%25253Ashop%25253Asearch%25253Aresults%2526link%253D%25257B%252522additionalUiData%252522%25253A%25257B%252522assetBaseUrl%252522%25253A%252522https%25253A%25252F%25252Fshop.rewe-static.de%25252Frewe-myproducts%25252F8e4c16602418eb6ef3881c0337822060463aca99%252522%25252C%252522stat%2526region%253Dadd2cart-aea6e91b-c5a2-420f-a030-8918e9030102%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c",
  };

  return await $fetch(
    `https://shop.rewe.de/api/baskets/listings/${listingId}`,
    {
      method: "POST",
      headers,
      body: {
        quantity,
        includeTimeslot: false,
        context: "product-list-search",
      },
    },
  );
}

export default defineEventHandler(async (event) => {
  const body = await readBody<IngredientsOrderBody>(event);

  // add each ingredient to rewe basket
  for (let i of body.ingredients) {
    if (!i.selectedProducts) {
      continue;
    }
    // add all products for each ingredient
    for (let selectedProduct of i.selectedProducts) {
      const articles = selectedProduct.product._embedded.articles;
      if (!articles.length) {
        throw new Error("No articles found");
      }

      const listing = articles[0]._embedded.listing;
      const listingId = listing.id;

      // add product to basket
      const response = await updateListingInBasket(
        listingId,
        selectedProduct.quantity,
      );
      console.log(
        "Added product",
        selectedProduct.quantity,
        selectedProduct.product,
        response,
      );
    }
  }
});
