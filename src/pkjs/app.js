
/*
 * 潮汐計算、送信
 */
function SendTide2( now, siteinfo, lat, lon ) {
  var DD = new Date(now);
  var floatarray = [];
  for( var iH=-12; iH<=12; iH++ ) {
     DD.setTime(now.getTime() + 3600000*iH);
     var tide = Get_Tide(DD.getYear()+1900, DD.getMonth() + 1, DD.getDate(), DD.getHours(), 9, siteinfo ).toFixed(2);
//     console.log(' '+DD.getDate()+'日'+DD.getHours()+'時'+tide+'cm');
     floatarray.push(tide);
  }
  var f = new Float32Array(floatarray);
  var b = new Uint8Array(f.buffer);

  var ra = toArray(b);
  
  //地点名送信
  Pebble.sendAppMessage({'TIDE_RES_READY_KEY':siteinfo.name},function(){
    //潮汐データ送信
    Pebble.sendAppMessage({'TIDE_RES_BIN_KEY':ra},function(){
      Pebble.sendAppMessage({'TIDE_RES_FINISH_KEY':new String(siteinfo.Z0)},function(){
      
        //海保実測値
        loadmilt(now,lat, lon, function()
                 {
                    //天候取得
                    fetchWeather(lat, lon);
                 });
      },function(e){});
    },function(e){});
  },function(e){});
}

/*
 * 潮汐計算エントリ
 */
function CalcTide( lat, lon ) {
  //近場の地点を取得
  var siteinfo = TideNearSite( lat, lon );
  
  console.log("site:",siteinfo.name);
  
  //潮汐データ処理
  var now = new Date();
  SendTide2( now, siteinfo, lat, lon );
}

/*
 * 位置情報取得成功
 */
function locationSuccess(pos) {
  var coordinates = pos.coords;
  console.log("locationSuccess:lat="+coordinates.latitude+":log="+coordinates.longitude );
  
  //取得した位置情報を記録する。
  localStorage.setItem('lastlocation', JSON.stringify({ lat: coordinates.latitude, lon: coordinates.longitude }));
  
  var mes = '緯度:'+coordinates.latitude.toString(10)+' 経度:'+coordinates.longitude.toString(10);
  Pebble.sendAppMessage({"LOCATION_LATLON_RES_KEY":mes},function()
                       {
                          CalcTide( coordinates.latitude, coordinates.longitude );
                       },function(e){});
                       
}

/*
 * 位置情報取得失敗
 */
function locationError(err) {
  console.warn('location error (' + err.code + '): ' + err.message);
  
  var locationjson = localStorage.getItem('lastlocation');
  if( locationjson !== null )
  {
      var location = JSON.parse(locationjson);
      console.log("last location:lat="+location.lat+":log="+location.lon );
    
      CalcTide( location.lat, location.lon );
  }
}

/*
 * 位置情報取得タイムアウト設定
 */
var locationOptions = { "timeout": 30000, "maximumAge": 120000 }; 


/*
 * 起動インベト設定
 */
Pebble.addEventListener("ready", function(e) {
  console.log("connect!" + e.ready);
  
  //インディアン判定
  checkendian();
});

/*
 * メッセージ受信イベント設定
 */
Pebble.addEventListener("appmessage", function(e) {

  console.log("appmessage!");
  
  if( e.payload["LOCATION_REQ_KEY"] == 1 ) {
    console.log("LOCATION_REQ_KEY");
    window.navigator.geolocation.getCurrentPosition(locationSuccess, locationError, locationOptions);
  }
 
//  console.log(e.type);
//  console.log(e.payload.temperature);
});

/*
 * 終了イベント設定
 */
Pebble.addEventListener("webviewclosed", function(e) {
  console.log("webview closed");
  console.log(e.type);
  console.log(e.response);
});

