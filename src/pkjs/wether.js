
/*
 * 天気取得
 */
function fetchWeather(latitude, longitude) {
  
  var keyid = "fe3e9f8106b81b2be9cc04cf3d6f25f9";
  
  var req = new XMLHttpRequest();
  req.open('GET', "http://api.openweathermap.org/data/2.5/weather?" +
    "lat=" + latitude + "&lon=" + longitude + "&cnt=1" + "&APPID=" + keyid, true);

  req.onload = function(e) {
    if (req.readyState == 4) {
      if(req.status == 200) {
        console.log(req.responseText);

        var response = JSON.parse(req.responseText);
        var temperature = Math.round(response.main.temp - 273.15);
        var icon = response.weather[0].id;
        var city = response.name;
        console.log("temp:"+temperature);
        console.log("icon:"+icon);
        console.log("city:"+city);
        
        Pebble.sendAppMessage({"WEATHER_ICON_KEY":icon.toString(10)},function() {
          Pebble.sendAppMessage({"WEATHER_TEMPERATURE_KEY":temperature + "\u00B0C"},function() {
            convGoogleMap(latitude, longitude);
          });
        });
      } else {
        console.log("Error");
      }
    }
  };
  req.send(null);
}

/*
 * グーグル場所取得
 */
function convGoogleMap(lat,lon) {
  
  var req = new XMLHttpRequest();
  req.open('GET', "https://maps.googleapis.com/maps/api/geocode/json?language=ja&latlng="+lat+","+lon, true);
  req.onload = function(e) {
    if (req.readyState == 4) {
      if(req.status == 200) {
        
        var response = JSON.parse(req.responseText);
        var entry = response.results;
        var locateresult;
        for(var i in entry){
          locateresult=entry[i].formatted_address.toString();
          break;
        }
        console.log(locateresult);
        Pebble.sendAppMessage({"WEATHER_CITY_KEY":locateresult},function()
                              {
                                getYahooWether(lat,lon);
                              },function(e)
                              {
                                getYahooWether(lat,lon);
                              });
      }
    }
  };
  req.send(null);
}

/*
 * Yahoo天候送信
 */
function sendYahooWether( feedlist, idx, len ) {
  console.log(idx,'/',len,':',feedlist[idx]);
  
  if( idx < len)
  {
    Pebble.sendAppMessage({"YW_RES_TITLE_KEY":feedlist[idx]},
                         function()
                          {
                            console.log('sendYahooWether success');
                            sendYahooWether( feedlist, idx+1, len );
                          },
                         function(e)
                          {
                            console.log('sendYahooWether error');
                          });
  }
}

/*
 * Yahoo天候 地域情報取得
 */
function getYahooWether(lat,lon) {
  console.log('getYahooWether start');
  
  //地域取得
  var ysite = YWNearSite( lat, lon );
  
  var req = new XMLHttpRequest();
  req.open('GET', ysite.url, true);
  req.onload = function(e) {
    if (req.readyState == 4) {
      if(req.status == 200) {

        var feedlist = [];
        var responce = xml2json.parser(req.responseText);
        var entry = responce.rss.channel.item
        for(var i=0; i<entry.length; i++){
          
          var titlewrap = entry[i].title.replace( /℃/g , "\u00B0C" ) ;
          feedlist.push(titlewrap);
        }
        
        console.log('yahoo wether count:',feedlist.length);
        
        Pebble.sendAppMessage({"YW_RES_CLEAR_KEY":""},
                              function() {
                                sendYahooWether( feedlist, 0, feedlist.length );
                              },
                              function(e){});
      }
    }
  };
  req.send(null);
}


/*
 * Yahoo天候 地点情報
 */
function YWSiteInfo(name, url, lat, lon ){
	this.name=name;			//名前
	this.url=url;			//URL
	this.lat=lat;			//緯度
	this.lon=lon;			//経度
}

/*
 * Yahoo天候 地点情報リスト
 */
var ywsite=[];

/*
 * Yahoo天候 地点情報作成
 */
function CreateYWSite() {
    //地域天候RSS
ywsite[0]=new YWSiteInfo("名瀬","http://rss.weather.yahoo.co.jp/rss/days/1000.xml",28.384463,129.496994);
ywsite[1]=new YWSiteInfo("稚内","http://rss.weather.yahoo.co.jp/rss/days/1100.xml",45.424536,141.692873);
ywsite[2]=new YWSiteInfo("旭川","http://rss.weather.yahoo.co.jp/rss/days/1200.xml",43.774679,142.360636);
ywsite[3]=new YWSiteInfo("留萌","http://rss.weather.yahoo.co.jp/rss/days/1300.xml",43.94219,141.652064);
ywsite[4]=new YWSiteInfo("札幌","http://rss.weather.yahoo.co.jp/rss/days/1400.xml",43.062096,141.354376);
ywsite[5]=new YWSiteInfo("岩見沢","http://rss.weather.yahoo.co.jp/rss/days/1500.xml",43.196206,141.775933);
ywsite[6]=new YWSiteInfo("倶知安","http://rss.weather.yahoo.co.jp/rss/days/1600.xml",42.901829,140.758698);
ywsite[7]=new YWSiteInfo("網走","http://rss.weather.yahoo.co.jp/rss/days/1710.xml",44.020632,144.273398);
ywsite[8]=new YWSiteInfo("北見","http://rss.weather.yahoo.co.jp/rss/days/1720.xml",43.8040314,143.8958758);
ywsite[9]=new YWSiteInfo("紋別","http://rss.weather.yahoo.co.jp/rss/days/1730.xml",44.3564842,143.3545032);
ywsite[10]=new YWSiteInfo("根室","http://rss.weather.yahoo.co.jp/rss/days/1800.xml",43.3300759,145.5827903);
ywsite[11]=new YWSiteInfo("釧路","http://rss.weather.yahoo.co.jp/rss/days/1900.xml",42.9848542,144.3813556);
ywsite[12]=new YWSiteInfo("帯広","http://rss.weather.yahoo.co.jp/rss/days/2000.xml",42.9238989,143.1961031);
ywsite[13]=new YWSiteInfo("室蘭","http://rss.weather.yahoo.co.jp/rss/days/2100.xml",42.3152306,140.9737991);
ywsite[14]=new YWSiteInfo("浦河","http://rss.weather.yahoo.co.jp/rss/days/2200.xml",42.1685159,142.7681204);
ywsite[15]=new YWSiteInfo("函館","http://rss.weather.yahoo.co.jp/rss/days/2300.xml",41.7687933,140.7288103);
ywsite[16]=new YWSiteInfo("江差","http://rss.weather.yahoo.co.jp/rss/days/2400.xml",41.8691558,140.12746);
ywsite[17]=new YWSiteInfo("青森","http://rss.weather.yahoo.co.jp/rss/days/3110.xml",40.822072,140.7473647);
ywsite[18]=new YWSiteInfo("むつ","http://rss.weather.yahoo.co.jp/rss/days/3120.xml",41.2927457,141.1834755);
ywsite[19]=new YWSiteInfo("八戸","http://rss.weather.yahoo.co.jp/rss/days/3130.xml",40.5122839,141.4883986);
ywsite[20]=new YWSiteInfo("秋田","http://rss.weather.yahoo.co.jp/rss/days/3210.xml",39.7200079,140.1025642);
ywsite[21]=new YWSiteInfo("横手","http://rss.weather.yahoo.co.jp/rss/days/3220.xml",39.3137816,140.5666488);
ywsite[22]=new YWSiteInfo("盛岡","http://rss.weather.yahoo.co.jp/rss/days/3310.xml",39.702053,141.1544838);
ywsite[23]=new YWSiteInfo("宮古","http://rss.weather.yahoo.co.jp/rss/days/3320.xml",39.6414202,141.9571395);
ywsite[24]=new YWSiteInfo("大船渡","http://rss.weather.yahoo.co.jp/rss/days/3330.xml",39.0819011,141.70853);
ywsite[25]=new YWSiteInfo("仙台","http://rss.weather.yahoo.co.jp/rss/days/3410.xml",38.268215,140.8693558);
ywsite[26]=new YWSiteInfo("白石","http://rss.weather.yahoo.co.jp/rss/days/3420.xml",38.0024779,140.6198605);
ywsite[27]=new YWSiteInfo("山形","http://rss.weather.yahoo.co.jp/rss/days/3510.xml",38.2554388,140.3396017);
ywsite[28]=new YWSiteInfo("米沢","http://rss.weather.yahoo.co.jp/rss/days/3520.xml",37.9222401,140.1167811);
ywsite[29]=new YWSiteInfo("酒田","http://rss.weather.yahoo.co.jp/rss/days/3530.xml",38.9144331,139.8365153);
ywsite[30]=new YWSiteInfo("新庄","http://rss.weather.yahoo.co.jp/rss/days/3540.xml",38.7650154,140.3016084);
ywsite[31]=new YWSiteInfo("福島","http://rss.weather.yahoo.co.jp/rss/days/3610.xml",37.7502986,140.4675514);
ywsite[32]=new YWSiteInfo("小名浜","http://rss.weather.yahoo.co.jp/rss/days/3620.xml",36.9490884,140.9055861);
ywsite[33]=new YWSiteInfo("若松","http://rss.weather.yahoo.co.jp/rss/days/3630.xml",33.9054755,130.8111429);
ywsite[34]=new YWSiteInfo("水戸","http://rss.weather.yahoo.co.jp/rss/days/4010.xml",36.3665027,140.4709965);
ywsite[35]=new YWSiteInfo("土浦","http://rss.weather.yahoo.co.jp/rss/days/4020.xml",36.0782972,140.2043331);
ywsite[36]=new YWSiteInfo("宇都宮","http://rss.weather.yahoo.co.jp/rss/days/4110.xml",36.5551124,139.8828072);
ywsite[37]=new YWSiteInfo("大田原","http://rss.weather.yahoo.co.jp/rss/days/4120.xml",36.871484,140.0174187);
ywsite[38]=new YWSiteInfo("前橋","http://rss.weather.yahoo.co.jp/rss/days/4210.xml",36.3894816,139.0634281);
ywsite[39]=new YWSiteInfo("みなかみ","http://rss.weather.yahoo.co.jp/rss/days/4220.xml",36.6786996,138.9990639);
ywsite[40]=new YWSiteInfo("さいたま","http://rss.weather.yahoo.co.jp/rss/days/4310.xml",35.8617292,139.6454822);
ywsite[41]=new YWSiteInfo("熊谷","http://rss.weather.yahoo.co.jp/rss/days/4320.xml",36.1473097,139.3886446);
ywsite[42]=new YWSiteInfo("秩父","http://rss.weather.yahoo.co.jp/rss/days/4330.xml",35.9920551,139.0848169);
ywsite[43]=new YWSiteInfo("東京","http://rss.weather.yahoo.co.jp/rss/days/4410.xml",35.6894875,139.6917064);
ywsite[44]=new YWSiteInfo("大島","http://rss.weather.yahoo.co.jp/rss/days/4420.xml",27.81,128.94);
ywsite[45]=new YWSiteInfo("八丈島","http://rss.weather.yahoo.co.jp/rss/days/4430.xml",33.1030212,139.8035566);
ywsite[46]=new YWSiteInfo("父島","http://rss.weather.yahoo.co.jp/rss/days/4440.xml",27.0750533,142.2116025);
ywsite[47]=new YWSiteInfo("千葉","http://rss.weather.yahoo.co.jp/rss/days/4510.xml",35.6072668,140.1062907);
ywsite[48]=new YWSiteInfo("銚子","http://rss.weather.yahoo.co.jp/rss/days/4520.xml",35.7346813,140.8266406);
ywsite[49]=new YWSiteInfo("館山","http://rss.weather.yahoo.co.jp/rss/days/4530.xml",34.9965057,139.8699653);
ywsite[50]=new YWSiteInfo("横浜","http://rss.weather.yahoo.co.jp/rss/days/4610.xml",35.4437078,139.6380256);
ywsite[51]=new YWSiteInfo("小田原","http://rss.weather.yahoo.co.jp/rss/days/4620.xml",35.2645639,139.1521538);
ywsite[52]=new YWSiteInfo("長野","http://rss.weather.yahoo.co.jp/rss/days/4810.xml",36.6485496,138.1942432);
ywsite[53]=new YWSiteInfo("松本","http://rss.weather.yahoo.co.jp/rss/days/4820.xml",36.2380381,137.9720341);
ywsite[54]=new YWSiteInfo("飯田","http://rss.weather.yahoo.co.jp/rss/days/4830.xml",35.5149777,137.8214466);
ywsite[55]=new YWSiteInfo("甲府","http://rss.weather.yahoo.co.jp/rss/days/4910.xml",35.66228,138.5682015);
ywsite[56]=new YWSiteInfo("河口湖","http://rss.weather.yahoo.co.jp/rss/days/4920.xml",35.5170946,138.7517787);
ywsite[57]=new YWSiteInfo("静岡","http://rss.weather.yahoo.co.jp/rss/days/5010.xml",34.9771201,138.3830845);
ywsite[58]=new YWSiteInfo("網代","http://rss.weather.yahoo.co.jp/rss/days/5020.xml",35.043543,139.081238);
ywsite[59]=new YWSiteInfo("三島","http://rss.weather.yahoo.co.jp/rss/days/5030.xml",35.1184025,138.9185126);
ywsite[60]=new YWSiteInfo("浜松","http://rss.weather.yahoo.co.jp/rss/days/5040.xml",34.7108344,137.7261258);
ywsite[61]=new YWSiteInfo("名古屋","http://rss.weather.yahoo.co.jp/rss/days/5110.xml",35.1814464,136.906398);
ywsite[62]=new YWSiteInfo("豊橋","http://rss.weather.yahoo.co.jp/rss/days/5120.xml",34.7691995,137.3914662);
ywsite[63]=new YWSiteInfo("岐阜","http://rss.weather.yahoo.co.jp/rss/days/5210.xml",35.4232984,136.7606537);
ywsite[64]=new YWSiteInfo("高山","http://rss.weather.yahoo.co.jp/rss/days/5220.xml",36.1461236,137.2521729);
ywsite[65]=new YWSiteInfo("津","http://rss.weather.yahoo.co.jp/rss/days/5310.xml",34.718596,136.5056975);
ywsite[66]=new YWSiteInfo("尾鷲","http://rss.weather.yahoo.co.jp/rss/days/5320.xml",34.0707989,136.1909953);
ywsite[67]=new YWSiteInfo("新潟","http://rss.weather.yahoo.co.jp/rss/days/5410.xml",37.9161924,139.0364126);
ywsite[68]=new YWSiteInfo("長岡","http://rss.weather.yahoo.co.jp/rss/days/5420.xml",37.4462652,138.8512772);
ywsite[69]=new YWSiteInfo("高田","http://rss.weather.yahoo.co.jp/rss/days/5430.xml",35.7150966,139.7159526);
ywsite[70]=new YWSiteInfo("相川","http://rss.weather.yahoo.co.jp/rss/days/5440.xml",34.757377,135.533582);
ywsite[71]=new YWSiteInfo("富山","http://rss.weather.yahoo.co.jp/rss/days/5510.xml",36.6959518,137.2136768);
ywsite[72]=new YWSiteInfo("伏木","http://rss.weather.yahoo.co.jp/rss/days/5520.xml",36.792264,137.058512);
ywsite[73]=new YWSiteInfo("金沢","http://rss.weather.yahoo.co.jp/rss/days/5610.xml",36.5613254,136.6562051);
ywsite[74]=new YWSiteInfo("輪島","http://rss.weather.yahoo.co.jp/rss/days/5620.xml",37.3905901,136.8991957);
ywsite[75]=new YWSiteInfo("福井","http://rss.weather.yahoo.co.jp/rss/days/5710.xml",36.0640669,136.2194938);
ywsite[76]=new YWSiteInfo("敦賀","http://rss.weather.yahoo.co.jp/rss/days/5720.xml",35.6452443,136.0554408);
ywsite[77]=new YWSiteInfo("大津","http://rss.weather.yahoo.co.jp/rss/days/6010.xml",35.0178929,135.8546074);
ywsite[78]=new YWSiteInfo("彦根","http://rss.weather.yahoo.co.jp/rss/days/6020.xml",35.274461,136.2596226);
ywsite[79]=new YWSiteInfo("京都","http://rss.weather.yahoo.co.jp/rss/days/6110.xml",35.0116363,135.7680294);
ywsite[80]=new YWSiteInfo("舞鶴","http://rss.weather.yahoo.co.jp/rss/days/6120.xml",35.4747971,135.3859918);
ywsite[81]=new YWSiteInfo("大阪","http://rss.weather.yahoo.co.jp/rss/days/6200.xml",34.6937378,135.5021651);
ywsite[82]=new YWSiteInfo("神戸","http://rss.weather.yahoo.co.jp/rss/days/6310.xml",34.690083,135.1955112);
ywsite[83]=new YWSiteInfo("豊岡","http://rss.weather.yahoo.co.jp/rss/days/6320.xml",35.5445754,134.8201814);
ywsite[84]=new YWSiteInfo("奈良","http://rss.weather.yahoo.co.jp/rss/days/6410.xml",34.6850869,135.8050002);
ywsite[85]=new YWSiteInfo("風屋","http://rss.weather.yahoo.co.jp/rss/days/6420.xml",34.043805,135.7817794);
ywsite[86]=new YWSiteInfo("和歌山","http://rss.weather.yahoo.co.jp/rss/days/6510.xml",34.2305113,135.1708083);
ywsite[87]=new YWSiteInfo("潮岬","http://rss.weather.yahoo.co.jp/rss/days/6520.xml",33.4479784,135.7614191);
ywsite[88]=new YWSiteInfo("岡山","http://rss.weather.yahoo.co.jp/rss/days/6610.xml",34.6551456,133.9195019);
ywsite[89]=new YWSiteInfo("津山","http://rss.weather.yahoo.co.jp/rss/days/6620.xml",35.0691155,134.0045428);
ywsite[90]=new YWSiteInfo("広島","http://rss.weather.yahoo.co.jp/rss/days/6710.xml",34.3852029,132.4552927);
ywsite[91]=new YWSiteInfo("庄原","http://rss.weather.yahoo.co.jp/rss/days/6720.xml",34.8577316,133.0172775);
ywsite[92]=new YWSiteInfo("松江","http://rss.weather.yahoo.co.jp/rss/days/6810.xml",35.4680595,133.048375);
ywsite[93]=new YWSiteInfo("浜田","http://rss.weather.yahoo.co.jp/rss/days/6820.xml",34.8993025,132.0797833);
ywsite[94]=new YWSiteInfo("西郷","http://rss.weather.yahoo.co.jp/rss/days/6830.xml",37.1416956,140.1553637);
ywsite[95]=new YWSiteInfo("鳥取","http://rss.weather.yahoo.co.jp/rss/days/6910.xml",35.5011326,134.2350914);
ywsite[96]=new YWSiteInfo("米子","http://rss.weather.yahoo.co.jp/rss/days/6920.xml",35.4280717,133.3309447);
ywsite[97]=new YWSiteInfo("徳島","http://rss.weather.yahoo.co.jp/rss/days/7110.xml",34.0657179,134.5593601);
ywsite[98]=new YWSiteInfo("日和佐","http://rss.weather.yahoo.co.jp/rss/days/7120.xml",33.728915,134.530537);
ywsite[99]=new YWSiteInfo("高松","http://rss.weather.yahoo.co.jp/rss/days/7200.xml",34.3427879,134.046574);
ywsite[100]=new YWSiteInfo("松山","http://rss.weather.yahoo.co.jp/rss/days/7310.xml",33.8391574,132.7655752);
ywsite[101]=new YWSiteInfo("新居浜","http://rss.weather.yahoo.co.jp/rss/days/7320.xml",33.9602895,133.2833512);
ywsite[102]=new YWSiteInfo("宇和島","http://rss.weather.yahoo.co.jp/rss/days/7330.xml",33.2233404,132.5605575);
ywsite[103]=new YWSiteInfo("高知","http://rss.weather.yahoo.co.jp/rss/days/7410.xml",33.5595867,133.5292788);
ywsite[104]=new YWSiteInfo("室戸","http://rss.weather.yahoo.co.jp/rss/days/7420.xml",33.2900093,134.1520509);
ywsite[105]=new YWSiteInfo("清水","http://rss.weather.yahoo.co.jp/rss/days/7430.xml",35.0158879,138.4895275);
ywsite[106]=new YWSiteInfo("下関","http://rss.weather.yahoo.co.jp/rss/days/8110.xml",33.9578307,130.941459);
ywsite[107]=new YWSiteInfo("山口","http://rss.weather.yahoo.co.jp/rss/days/8120.xml",34.178496,131.4737269);
ywsite[108]=new YWSiteInfo("柳井","http://rss.weather.yahoo.co.jp/rss/days/8130.xml",33.9638333,132.1015969);
ywsite[109]=new YWSiteInfo("萩","http://rss.weather.yahoo.co.jp/rss/days/8140.xml",34.4081155,131.3990849);
ywsite[110]=new YWSiteInfo("福岡","http://rss.weather.yahoo.co.jp/rss/days/8210.xml",33.5903547,130.4017155);
ywsite[111]=new YWSiteInfo("八幡","http://rss.weather.yahoo.co.jp/rss/days/8220.xml",34.8755551,135.7076209);
ywsite[112]=new YWSiteInfo("飯塚","http://rss.weather.yahoo.co.jp/rss/days/8230.xml",33.6459075,130.6915113);
ywsite[113]=new YWSiteInfo("久留米","http://rss.weather.yahoo.co.jp/rss/days/8240.xml",33.3192865,130.5083735);
ywsite[114]=new YWSiteInfo("大分","http://rss.weather.yahoo.co.jp/rss/days/8310.xml",33.2395578,131.609272);
ywsite[115]=new YWSiteInfo("中津","http://rss.weather.yahoo.co.jp/rss/days/8320.xml",33.5982211,131.1883247);
ywsite[116]=new YWSiteInfo("日田","http://rss.weather.yahoo.co.jp/rss/days/8330.xml",33.3213327,130.9409659);
ywsite[117]=new YWSiteInfo("佐伯","http://rss.weather.yahoo.co.jp/rss/days/8340.xml",32.959806,131.9000575);
ywsite[118]=new YWSiteInfo("長崎","http://rss.weather.yahoo.co.jp/rss/days/8410.xml",32.7502856,129.877667);
ywsite[119]=new YWSiteInfo("佐世保","http://rss.weather.yahoo.co.jp/rss/days/8420.xml",33.1799153,129.7151101);
ywsite[120]=new YWSiteInfo("厳原","http://rss.weather.yahoo.co.jp/rss/days/8430.xml",34.1913533,129.3066056);
ywsite[121]=new YWSiteInfo("福江","http://rss.weather.yahoo.co.jp/rss/days/8440.xml",32.7018615,128.7577605);
ywsite[122]=new YWSiteInfo("佐賀","http://rss.weather.yahoo.co.jp/rss/days/8510.xml",33.263482,130.3008576);
ywsite[123]=new YWSiteInfo("伊万里","http://rss.weather.yahoo.co.jp/rss/days/8520.xml",33.2645856,129.880269);
ywsite[124]=new YWSiteInfo("熊本","http://rss.weather.yahoo.co.jp/rss/days/8610.xml",32.8031004,130.7078911);
ywsite[125]=new YWSiteInfo("阿蘇乙姫","http://rss.weather.yahoo.co.jp/rss/days/8620.xml",32.9433086,131.0426286);
ywsite[126]=new YWSiteInfo("牛深","http://rss.weather.yahoo.co.jp/rss/days/8630.xml",32.1944694,130.0257515);
ywsite[127]=new YWSiteInfo("人吉","http://rss.weather.yahoo.co.jp/rss/days/8640.xml",32.2100405,130.7625544);
ywsite[128]=new YWSiteInfo("宮崎","http://rss.weather.yahoo.co.jp/rss/days/8710.xml",31.9076736,131.4202411);
ywsite[129]=new YWSiteInfo("延岡","http://rss.weather.yahoo.co.jp/rss/days/8720.xml",32.5822723,131.6650094);
ywsite[130]=new YWSiteInfo("都城","http://rss.weather.yahoo.co.jp/rss/days/8730.xml",31.7195903,131.0616214);
ywsite[131]=new YWSiteInfo("高千穂","http://rss.weather.yahoo.co.jp/rss/days/8740.xml",32.71169,131.3077866);
ywsite[132]=new YWSiteInfo("鹿児島","http://rss.weather.yahoo.co.jp/rss/days/8810.xml",31.5601464,130.5579779);
ywsite[133]=new YWSiteInfo("鹿屋","http://rss.weather.yahoo.co.jp/rss/days/8820.xml",31.3782921,130.8520774);
ywsite[134]=new YWSiteInfo("種子島","http://rss.weather.yahoo.co.jp/rss/days/8830.xml",30.609558,130.9788775);
ywsite[135]=new YWSiteInfo("那覇","http://rss.weather.yahoo.co.jp/rss/days/9110.xml",26.2123124,127.6791568);
ywsite[136]=new YWSiteInfo("名護","http://rss.weather.yahoo.co.jp/rss/days/9120.xml",26.5915465,127.9773162);
ywsite[137]=new YWSiteInfo("久米島","http://rss.weather.yahoo.co.jp/rss/days/9130.xml",26.3490331,126.7472481);
ywsite[138]=new YWSiteInfo("南大東","http://rss.weather.yahoo.co.jp/rss/days/9200.xml",25.8286844,131.2320154);
ywsite[139]=new YWSiteInfo("宮古島","http://rss.weather.yahoo.co.jp/rss/days/9300.xml",24.80549,125.2811486);
ywsite[140]=new YWSiteInfo("石垣島","http://rss.weather.yahoo.co.jp/rss/days/9410.xml",24.4064027,124.1754442);
ywsite[141]=new YWSiteInfo("与那国島","http://rss.weather.yahoo.co.jp/rss/days/9420.xml",24.4616586,123.0085106);
}

/*
 * 地点情報作成
 */
CreateYWSite();


/*
 * 近場の地域取得
 */
function YWNearSite( lat, lon ) {
	var length = 999999999999;
	var targetsite = ywsite[0];
	for( var idx in ywsite ) {
	   var difflen = DiffLength( ywsite[idx].lat, ywsite[idx].lon, lat,lon );
	   if( difflen < length )
	   {
	      length = difflen;
	      targetsite = ywsite[idx];
	   }
	}

	return targetsite;
}
