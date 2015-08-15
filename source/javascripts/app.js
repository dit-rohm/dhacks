$(function() {
  ;(function(w,d){
    w.___gcfg = {lang:"ja"};
    var s,e = d.getElementsByTagName("script")[0],
    a = function(u,f){if(!d.getElementById(f)){s = d.createElement("script");
      s.src = u;if(f){s.id = f;}e.parentNode.insertBefore(s,e);}};
    a("//platform.twitter.com/widgets.js","twitter-wjs");
    a("//connect.facebook.net/ja_JP/sdk.js#xfbml=1&version=v2.0","facebook-jssdk");
  })(this, document);
});

//タイムテーブルの表示判別コード
$(function() {
  if ($(window).width() >= 768) {
    $("#schedule .row").append('<a href="./images/schedule.png"><img src="./images/schedule.png" alt="スケジュール"></a>');
  } else {
    $("#schedule .row").append('<div class="schedule-slider"></div>');
    $(".schedule-slider").append('<div class="day-schedule">foo</div>');
    $(".schedule-slider").append('<div class="day-schedule">foo</div>');
    $(".schedule-slider").append('<div class="day-schedule">foo</div>');
    $(".schedule-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false
    });
  }
});
