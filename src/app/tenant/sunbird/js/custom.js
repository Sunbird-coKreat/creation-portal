sessionStorage.setItem("tenantSlug", "vidyadaan");
sessionStorage.setItem("rootTenantLogo", "vidyadaan");
$(document).ready(function () {
  sessionStorage.setItem("tenantSlug", "vidyadaan");
  sessionStorage.setItem("rootTenantLogo", "vidyadaan");

  var a = window.location.hostname;
  $(".cb").attr("href",getEnvironment(a));
  
  $(".readMore").on('click',function(){
    if(!($(".more").is(":visible"))){
      $(".more").show();
      $(".dots").hide();
      $(this).text("Read Less");
      var h = $(".about-section").innerHeight();
      if(window.innerWidth < 1024){
        $(".eresourcesContents").css("padding-top", ((h - 280)+ 166)+"px");
      }else{
        $(".eresourcesContents").css("padding-top", ((h - 202)+ 140)+"px");
      }
    }else{
      $(".more").hide();
      $(".dots").show();
      $(this).text("Read More");
      if(window.innerWidth < 1024){
        $(".eresourcesContents").css("padding-top","166px");
      }else{
        $(".eresourcesContents").css("padding-top","140px");
      }
    }
  })

function getEnvironment(a){
  switch(a){
    case "dock.preprod.ntp.net.in": return "https://dock.preprod.ntp.net.in/contribute"; break;
    case "vdn.diksha.gov.in": return "https://vdn.diksha.gov.in/contribute"; break;
    case "preprod.ntp.net.in": return "https://dock.preprod.ntp.net.in/contribute"; break;
    case "diksha.gov.in": return "https://vdn.diksha.gov.in/contribute"; break;
    default: return "/contribute"; break;
  }
}

});