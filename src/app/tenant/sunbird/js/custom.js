sessionStorage.setItem("tenantSlug", "vidyadaan");
sessionStorage.setItem("rootTenantLogo", "vidyadaan");
$(document).ready(function () {
  sessionStorage.setItem("tenantSlug", "vidyadaan");
  sessionStorage.setItem("rootTenantLogo", "vidyadaan");
  
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

var url = window.location.origin + '/content/program/v1/tenant/list';
makeCallToGetProjects(url,getProjectsTemplates);

function makeCallToGetProjects(url, callback){
  var data = {
    request: {
      filters: {
        status: "Live"
      }
    }
  };
  $.ajax({
    type: "POST",
    url: url,
    data: JSON.stringify(data),
  headers: {'content-type':'application/json'},
    success: function(response){
        callback(response.result.content);
    }
  });
}

function getProjectsTemplates(data){
  addOtherBoardTemplate(data);
  addAllStateBoardTemplaet(data);
  var a = window.location.hostname;
  $(".cb").attr("href",getEnvironment(a));
}
function addOtherBoardTemplate(data){
  var otherBoards = data.filter(e => (e.org_name === 'CBSE') || e.org_name === 'NCERT');
  var otherBoardCards = '';
  for(let i=0; i<otherBoards.length; i++){
    otherBoardCards = otherBoardCards + '<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6"> <div class="program-cards"> <div class="topSection"> <label class="text-center hidden-lg-down">' + otherBoards[i].orgName + '</label> <div class="my-20">';
    if(otherBoardCards[i].imgUrl){
      otherBoardCards = otherBoardCards + '<img src="' + otherBoards[i].imgUrl + '" class="logo-img" alt="' + otherBoards[i].orgName + ' logo" />'
    }
    otherBoardCards = otherBoardCards + '</div> </div> <div class="bottomSection"> <label><span class="fs-2">'+ otherBoards[i].pgm_count + '</span> Projects</label> <a href="#" class="hidden-lg-down a-link cb">Contribute</a> </div> </div> </div>';
  }
  $('.flex-jc-center').append(otherBoardCards);
}
function addAllStateBoardTemplaet(data) {
  var allStateBoards = data.filter(function(el){return el.org_name !== "CBSE" && el.org_name !== "NCERT";});
  var stateCards = '';
  for(let j=0; j<allStateBoards.length; j++){
    stateCards = stateCards + '<div class="col-xl-3 col-lg-3 col-md-6 col-sm-6 col-xs-6"> <div class="program-cards"> <div class="topSection"> <label class="text-center hidden-lg-down">' + allStateBoards[j].orgName + '</label> <div class="my-20">';
    if(allStateBoards[j].imgUrl){
      stateCards = stateCards + '<img src="' + allStateBoards[j].imgUrl + '" class="logo-img" alt="' + allStateBoards[j].orgName + ' logo"/>';
    }
    stateCards = stateCards + '</div> </div> <div class="bottomSection"> <label><span class="fs-2">' + allStateBoards[j].program_count + '</span> Projects</label> <a href="#" class="hidden-lg-down a-link cb">Contribute</a> </div> </div> </div>';
  }
  $('.state-board-projects').append(stateCards);
}

  var $videoSrc;  
  $('.video-btn').click(function() {
      $videoSrc = $(this).data( "src" );
      $('#vidyaDaanVideoModal').modal("show");
  });
  
  $('#vidyaDaanVideoModal').on('shown.bs.modal', function (e) {
    $("#vidyaDaanVideoModal video").attr('src',$videoSrc + "?autoplay=1&amp;modestbranding=1&amp;showinfo=0" ); 
  })
    
  $('#vidyaDaanVideoModal').on('hide.bs.modal', function (e) {
      $("#vidyaDaanVideoModal video").attr('src',''); 
  }) 
});