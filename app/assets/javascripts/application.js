// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, or any plugin's
// vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file. JavaScript code in this file should be added after the last require_* statement.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require activestorage
//= require_tree .


// IFrame Player API の読み込み
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// YouTubeの埋め込み
function onYouTubeIframeAPIReady(){
  document.getElementById("move").style.display ="none";
   ytPlayer = new YT.Player('move', // 埋め込む場所の指定 
   {
      width: 500,
      height: 390,
      // videoId: 'gvSeLq-3Azg', // YouTubeのID
      //イベントの設定
      events: {
          'onReady': onPlayerReady  // プレーヤーの準備ができたときに実行
      }
    }
  );
}

window.onload = function(){
  
  const url = document.getElementById('url');
  let videoId;
  // url入力フォームの入力されたイベントを監視
  url.addEventListener('input', () => {
    move.style.display ="block";
    // urlのv=以降が動画id
    videoId = url.value.split('v=')[1];
    // 正しいurlの形式だったとき
    if (videoId) {
      // &=クエリパラーメターがついていることがあるので取り除く
      const ampersandPosition = videoId.indexOf('&');
      if(ampersandPosition != -1) {
          videoId = videoId.substring(0, ampersandPosition);
      }
    }
    // 指定さらた動画IDのサムネイルを読み込み、動画を再生する準備をする。
    ytPlayer.cueVideoById({videoId: videoId});
  });
};


$(function(){

  function buildHTML(video){
    var build = 
      `
        <div class="content__right__list__move"></div>
          
        <div id="text" class="content__right__list__move__text"></div>
          ${video.text}
        `
      return build
  }

  $('.new_video').on('submit',function(e){
    e.preventDefault()
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "POST",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })

    .done(function(data){
      var html = buildHTML(data);
      $('.content__right__list').append(html);
      $('form')[0].reset();
      alert('保存できました');

      let playerId = "text";
      let videoId = data.text.split('v=')[1];
      player = new YT.Player(
        playerId,{
          width: "300",
          height:"150",
          videoId: videoId
        }
      )
    })
   
    .fail(function(){
      alert('保存されない');
    })
  });
});







var playerReady = false;
// プレーヤーの準備ができた
function onPlayerReady(event) {
  playerReady = true;
  // 動画再生
event.target.playVideo();
}

//プレーヤーの状態が変更された時
function onPlayerStateChange(event){
  // 現在のプレーヤーの状態を取得
  var ytStatus = event.data;
  // 再生終了した時
  if (ytStatus == YT.PlayerState.ENDED) {
    console.log('再生終了');
    //動画再生
    event.target.playVideo();
  }
  // 再生中の時
  if (ytStatus == YT.PlayerState.PLAYING) {
    console.log('再生中');
  }
  //停止中の時
  if (ytStatus == YT.PlayerState.PAUSED){
    console.log('停止中');
  }
  //バッファリング中の時
  if (ytStatus == YT.PlayerState.BUFFERING){
    console.log('バッファリング');
    }
  //頭出し済みの時
  if (ytStatus == YT.PlayerState.CUED){
    console.log('頭出し済み');
  }
}

$(function() {
  // 再生
   $('#play').click(function() {
     ytPlayer.playVideo();
   });
 // 一時停止
 $('#pause').click(function() {
        ytPlayer.pauseVideo();
  });
 // 1分前へ
 $('#prev').click(function() {
     // 現在の再生時間取得
        var currentTime = ytPlayer.getCurrentTime();
        // シークバーの移動
     ytPlayer.seekTo(currentTime - 60);
  });
 // 1分先へ
 $('#next').click(function() {
     // 現在の再生時間取得
        var currentTime = ytPlayer.getCurrentTime();
        // シークバーの移動
     ytPlayer.seekTo(currentTime + 60);
  });
 // 音量アップ(+10)
   $('#volup').click(function() {
        // 現在の音量取得
      var currentVol = ytPlayer.getVolume();
      ytPlayer.setVolume(currentVol + 10);
    });
 // 音量ダウン(-10)
   $('#voldown').click(function() {
      // 現在の音量取得
      var currentVol = ytPlayer.getVolume();
      ytPlayer.setVolume(currentVol - 10);
    });
 // ミュート
 $('#mute').click(function() {
     // ミュートされているかどうか
        if(ytPlayer.isMuted()) {
            // ミュートの解除
          ytPlayer.unMute();
      } else {
            // ミュート
         ytPlayer.mute();
        }
   });
});


