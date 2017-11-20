/*
 * 空白区切り再配列
 */
function emptyarrayfilter(linestr) {
    //データ分割、再配列
    var dfilter = [];
    var dds = linestr.split(" ");
    for (var i = 0; i < dds.length; i++) {
        if (dds[i].length > 0) {
            dfilter.push(dds[i]);
        }
    }

    return dfilter;
}

/*
 * 海保実測値取得
 *
 * http://www1.kaiho.mlit.go.jp/KANKYO/TIDE/real_time_tide/sel/index.htm
 */
function loadmilt(now,lat, lon, callback ) {

    //対象先頭時間
    var nowfix = new Date(now.getFullYear(),now.getMonth(),now.getDate(),now.getHours(),0,0);
    var DD = new Date();
    DD.setTime(nowfix.getTime() + 3600000*(-12));

    //結果格納配列
    var resultarray = [];

    var baseurl = "http://www1.kaiho.mlit.go.jp/KANKYO/TIDE/real_time_tide/images/tide_real/";

    //近場の地点を取得
    var siteinfo = MILTNearSite( lat, lon );
    console.log("実測データ="+siteinfo.name);
  
    //前日が必要か判定
    if( DD.getDate() != now.getDate() ) {
      console.log('前日必要');
      var url = baseurl + siteinfo.url1;
      loadmiltday(now,DD,url,resultarray);
    }
  
    //本日を取得
    var url2 = baseurl + siteinfo.url0;
    loadmiltday(now,DD,url2,resultarray);

    console.log("実測値数="+resultarray.length);
  
    var f = new Float32Array(resultarray);
    var b = new Uint8Array(f.buffer);
    var ra = toArray(b);

    Pebble.sendAppMessage({'MILTTIDE_RES_BIN_KEY':ra},function(){
      callback();
    },function(e){
      callback();
    });
}

/*
 * 海保実測値取得
 *
 * http://www1.kaiho.mlit.go.jp/KANKYO/TIDE/real_time_tide/sel/index.htm
 */
function loadmiltday(now,DD,url,resultarray) {
  //    console.log('DD '+DD.getFullYear()+"年"+(DD.getMonth()+1)+"月"+DD.getDate()+"日"+DD.getHours()+'時'+DD.getMinutes()+'分'+DD.getSeconds()+'秒');
  //    console.log(url);

  var req = new XMLHttpRequest();
  req.open('GET', url, false);
  req.send(null);

  if (req.readyState == 4 && req.status == 200) {

      var ret = [];

      var lines = req.responseText.split('\n');
      var dflag = 0;
      for (var i = 0; i < lines.length; i++) {
          if (dflag == 0 && lines[i].search(/year/) == 0) {
              dflag = 1;
              continue;
          }
          if (dflag == 1) {
              //データ分割、再配列
              var dfilter = emptyarrayfilter(lines[i]);
              if (dfilter.length < 5)
                  continue;

              if (dfilter[4] != 0 && dfilter[4] != 30 )
                  continue;

              //配列に結果を格納する
              var tidedate = new Date(dfilter[0], dfilter[1] - 1, dfilter[2], dfilter[3], dfilter[4], 0);
              var dtdiff = tidedate.getTime() - DD.getTime();
              if (dtdiff < 0)
                  continue;
              var diffidx = Math.floor(dtdiff / 1800000);
              if (diffidx >= 0 && diffidx <= 26) {

                  resultarray[diffidx] = parseFloat(dfilter[5]);

//                  console.log('tidedate ' + tidedate.getFullYear() + "年" + (tidedate.getMonth() + 1) + "月" + tidedate.getDate() + "日" + tidedate.getHours() + '時' + tidedate.getMinutes() + '分' + tidedate.getSeconds() + '秒' + "diffidx:" + diffidx + "dtdiff:" + dtdiff);
//                  console.log("milt:" + dfilter[0] + "/" + dfilter[1] + "/" + dfilter[2] + " " + dfilter[3] + ":" + dfilter[4] + "," + dfilter[5]);
              }
          }
      }
  }
}


/*
 * 海保実測値 地点情報
 */
function MILTSiteInfo(name, url0,url1, lat, lon ){
	this.name=name;		//名前
	this.url0=url0;		//URL 本日
	this.url1=url1;		//URL 昨日
	this.lat=lat;			//緯度
	this.lon=lon;			//経度
}

/*
 * 海保実測値 地点情報リスト
 */
var miltsite=[];

/*
 * 海保実測値 地点情報作成
 */
function CreateMILTSite() {
  //地域情報
miltsite[0]=new MILTSiteInfo('稚内','abashiriToday.txt','abashiriYesterday.txt',45.4156641,141.6730822);
miltsite[1]=new MILTSiteInfo('油津','aburatsuToday.txt','aburatsuYesterday.txt',31.5835837,131.4041797);
miltsite[2]=new MILTSiteInfo('粟島','awasimaToday.txt','awasimaYesterday.txt',37.7490046,139.1812953);
miltsite[3]=new MILTSiteInfo('鮎川','ayukawaToday.txt','ayukawaYesterday.txt',34.8205193,135.5924218);
miltsite[4]=new MILTSiteInfo('深浦','fukauraToday.txt','fukauraYesterday.txt',40.6478953,139.927375);
miltsite[5]=new MILTSiteInfo('福江','fukueToday.txt','fukueYesterday.txt',32.7018615,128.7577605);
miltsite[6]=new MILTSiteInfo('御坊','goboToday.txt','goboYesterday.txt',33.8914924,135.1523464);
miltsite[7]=new MILTSiteInfo('博多','hakataToday.txt','hakataYesterday.txt',33.5913576,130.4148783);
miltsite[8]=new MILTSiteInfo('函館','hakodateToday.txt','hakodateYesterday.txt',41.7687933,140.7288103);
miltsite[9]=new MILTSiteInfo('浜田','hamadaToday.txt','hamadaYesterday.txt',34.8993025,132.0797833);
miltsite[10]=new MILTSiteInfo('花咲','hanasakiToday.txt','hanasakiYesterday.txt',36.7572533,139.1975136);
miltsite[11]=new MILTSiteInfo('広島','hirosimaToday.txt','hirosimaYesterday.txt',34.3852029,132.4552927);
miltsite[12]=new MILTSiteInfo('厳原','izuharaToday.txt','izuharaYesterday.txt',34.1913533,129.3066056);
miltsite[13]=new MILTSiteInfo('鹿児島','kagoshimaToday.txt','kagoshimaYesterday.txt',31.5601464,130.5579779);
miltsite[14]=new MILTSiteInfo('釜石','kamaisiToday.txt','kamaisiYesterday.txt',39.2758183,141.8856772);
miltsite[15]=new MILTSiteInfo('神戸','kobeToday.txt','kobeYesterday.txt',34.690083,135.1955112);
miltsite[16]=new MILTSiteInfo('口之津','kuchinotsuToday.txt','kuchinotsuYesterday.txt',32.5788952,130.1964425);
miltsite[17]=new MILTSiteInfo('熊野','kumanoToday.txt','kumanoYesterday.txt',33.8886037,136.1002367);
miltsite[18]=new MILTSiteInfo('串本','kushimotoToday.txt','kushimotoYesterday.txt',33.47247,135.7814983);
miltsite[19]=new MILTSiteInfo('釧路','kushiroToday.txt','kushiroYesterday.txt',42.9848542,144.3813556);
miltsite[20]=new MILTSiteInfo('舞鶴','maizuruMToday.txt','maizuruMYesterday.txt',35.4747971,135.3859918);
miltsite[21]=new MILTSiteInfo('長崎','nagasakiToday.txt','nagasakiYesterday.txt',32.7502856,129.877667);
miltsite[22]=new MILTSiteInfo('能登','notoToday.txt','notoYesterday.txt',37.3532156,137.2445214);
miltsite[23]=new MILTSiteInfo('大船渡','ofunatoToday.txt','ofunatoYesterday.txt',39.0819011,141.70853);
miltsite[24]=new MILTSiteInfo('大分','oitaToday.txt','oitaYesterday.txt',33.2395578,131.609272);
miltsite[25]=new MILTSiteInfo('小名浜','onahamaToday.txt','onahamaYesterday.txt',36.9490884,140.9055861);
miltsite[26]=new MILTSiteInfo('大阪','osakaToday.txt','osakaYesterday.txt',34.6937378,135.5021651);
miltsite[27]=new MILTSiteInfo('小樽','otaruToday.txt','otaruYesterday.txt',43.1907173,140.9946621);
miltsite[28]=new MILTSiteInfo('大浦','ouraToday.txt','ouraYesterday.txt',40.713346,141.2172505);
miltsite[29]=new MILTSiteInfo('尾鷲','owaseToday.txt','owaseYesterday.txt',34.0707989,136.1909953);
miltsite[30]=new MILTSiteInfo('苓北','reihokuToday.txt','reihokuYesterday.txt',32.5131926,130.0548041);
miltsite[31]=new MILTSiteInfo('佐渡','sadoToday.txt','sadoYesterday.txt',38.0183525,138.368082);
miltsite[32]=new MILTSiteInfo('佐伯','saikiToday.txt','saikiYesterday.txt',32.959806,131.9000575);
miltsite[33]=new MILTSiteInfo('佐世保','saseboToday.txt','saseboYesterday.txt',33.1799153,129.7151101);
miltsite[34]=new MILTSiteInfo('下北','shimokitaToday.txt','shimokitaYesterday.txt',41.3080176,141.3327821);
miltsite[35]=new MILTSiteInfo('白浜','shirahamaToday.txt','shirahamaYesterday.txt',33.6781645,135.3481343);
miltsite[36]=new MILTSiteInfo('洲本','sumotoToday.txt','sumotoYesterday.txt',34.3424262,134.8956197);
miltsite[37]=new MILTSiteInfo('淡輪','tannowaToday.txt','tannowaYesterday.txt',34.3235221,135.1837031);
miltsite[38]=new MILTSiteInfo('竜飛','tappiToday.txt','tappiYesterday.txt',35.830116,138.8933459);
miltsite[39]=new MILTSiteInfo('徳山','tokuyamaToday.txt','tokuyamaYesterday.txt',34.065682,131.8140153);
miltsite[40]=new MILTSiteInfo('富山','toyamaToday.txt','toyamaYesterday.txt',36.6959518,137.2136768);
miltsite[41]=new MILTSiteInfo('対馬比田勝','tushimaToday.txt','tushimaYesterday.txt',34.6549021,129.4643212);
miltsite[42]=new MILTSiteInfo('浦神','uragamiToday.txt','uragamiYesterday.txt',33.560154,135.8940903);
miltsite[43]=new MILTSiteInfo('和歌山','wakayamaToday.txt','wakayamaYesterday.txt',34.2305113,135.1708083);
miltsite[44]=new MILTSiteInfo('網走','wakkanaitoday.txt','wakkanaiYesterday.txt',44.0206319,144.2733983);
miltsite[45]=new MILTSiteInfo('土佐清水','tosashimizuToday.txt','tosashimizuYesterday.txt',32.7816335,132.9549889);
miltsite[46]=new MILTSiteInfo('宇和島','uwajimaToday.txt','uwajimaYesterday.txt',33.2233404,132.5605575);
miltsite[47]=new MILTSiteInfo('室戸岬','murotomisakiToday.txt','murotomisakiYesterday.txt',33.2680092,134.1641616);
miltsite[48]=new MILTSiteInfo('高知','kochiToday.txt','kochiYesterday.txt',33.5595867,133.5292788);
miltsite[49]=new MILTSiteInfo('松山','matsuyamaToday.txt','matsuyamaYesterday.txt',33.8391574,132.7655752);
miltsite[50]=new MILTSiteInfo('小松島','komatsushimaToday.txt','komatsushimaYesterday.txt',34.0047114,134.5906739);
miltsite[51]=new MILTSiteInfo('呉','kureToday.txt','kureYesterday.txt',34.2492541,132.5658045);
miltsite[52]=new MILTSiteInfo('高松','takamatsuToday.txt','takamatsuYesterday.txt',34.3427879,134.046574);
miltsite[53]=new MILTSiteInfo('宇野','unoToday.txt','unoYesterday.txt',34.4854355,133.9423817);
miltsite[54]=new MILTSiteInfo('境','sakaiToday.txt','sakaiYesterday.txt',36.1084264,139.7949611);
miltsite[55]=new MILTSiteInfo('西郷','saigoToday.txt','saigoYesterday.txt',37.1416956,140.1553637);
miltsite[56]=new MILTSiteInfo('阿波由岐','awayukiToday.txt','awayukiYesterday.txt',33.736019,134.55059);
miltsite[57]=new MILTSiteInfo('奄美','amamiToday.txt','amamiYesterday.txt',28.3772482,129.4937408);
miltsite[58]=new MILTSiteInfo('横須賀','yokosukaToday.txt','yokosukaYesterday.txt',28.3772482,129.4937408);
miltsite[59]=new MILTSiteInfo('横浜','yokohamaToday.txt','yokohamaYesterday.txt',35.4437078,139.6380256);
miltsite[60]=new MILTSiteInfo('岡田','okadaToday.txt','okadaYesterday.txt',35.4437078,139.6380256);
miltsite[61]=new MILTSiteInfo('御前崎','omaezakiToday.txt','omaezakiYesterday.txt',34.6379866,138.1281269);
miltsite[62]=new MILTSiteInfo('三宅島(阿古)','miyake-simaToday.txt','miyake-simaYesterday.txt',34.6379866,138.1281269);
miltsite[63]=new MILTSiteInfo('三宅島(坪田)','miyakejimaToday.txt','miyakejimaYesterday.txt',34.0701734,139.5544579);
miltsite[64]=new MILTSiteInfo('種子島','tanegashimaToday.txt','tanegashimaYesterday.txt',34.0701734,139.5544579);
miltsite[65]=new MILTSiteInfo('小田原','odawaraToday.txt','odawaraYesterday.txt',35.2645639,139.1521538);
miltsite[66]=new MILTSiteInfo('清水港','shimizuminatoToday.txt','shimizuminatoYesterday.txt',35.2645639,139.1521538);
miltsite[67]=new MILTSiteInfo('西之表','nisinoomoteToday.txt','nisinoomoteYesterday.txt',30.7324118,130.9968353);
miltsite[68]=new MILTSiteInfo('石垣','ishigakiToday.txt','ishigakiYesterday.txt',30.7324118,130.9968353);
miltsite[69]=new MILTSiteInfo('石廊崎','irousakiToday.txt','irousakiYesterday.txt',34.6102022,138.8424748);
miltsite[70]=new MILTSiteInfo('赤羽根','akabaneToday.txt','akabaneYesterday.txt',34.6102022,138.8424748);
miltsite[71]=new MILTSiteInfo('千葉','tibaToday.txt','tibaYesterday.txt',35.6072668,140.1062907);
miltsite[72]=new MILTSiteInfo('大泊','odomariToday.txt','odomariYesterday.txt',35.6072668,140.1062907);
miltsite[73]=new MILTSiteInfo('中之島','naka-no-simaToday.txt','naka-no-simaYesterday.txt',34.2391079,135.1821237);
miltsite[74]=new MILTSiteInfo('銚子漁港','choshigyokoToday.txt','choshigyokoYesterday.txt',34.2391079,135.1821237);
miltsite[75]=new MILTSiteInfo('鳥羽','tobaToday.txt','tobaYesterday.txt',34.481435,136.8433615);
miltsite[76]=new MILTSiteInfo('東京(晴海)','tokyoMToday.txt','tokyoMYesterday.txt',34.481435,136.8433615);
miltsite[77]=new MILTSiteInfo('那覇','nahaToday.txt','nahaYesterday.txt',26.2123124,127.6791568);
miltsite[78]=new MILTSiteInfo('内浦','uchiuraToday.txt','uchiuraYesterday.txt',26.2123124,127.6791568);
miltsite[79]=new MILTSiteInfo('南大東','minamidaitoToday.txt','minamidaitoYesterday.txt',25.8286844,131.2320154);
miltsite[80]=new MILTSiteInfo('八丈島','hatizyo-simaToday.txt','hatizyo-simaYesterday.txt',33.1030212,139.8035566);
miltsite[81]=new MILTSiteInfo('布良','meraToday.txt','meraYesterday.txt',53.2635306,34.41611);
miltsite[82]=new MILTSiteInfo('父島','chichijimaToday.txt','chichijimaYesterday.txt',27.0750533,142.2116025);
miltsite[83]=new MILTSiteInfo('舞阪','maisakaToday.txt','maisakaYesterday.txt',34.6857071,137.6271482);
miltsite[84]=new MILTSiteInfo('枕崎','makurazakiToday.txt','makurazakiYesterday.txt',31.2729002,130.2969045);
miltsite[85]=new MILTSiteInfo('名古屋','nagoyaToday.txt','nagoyaYesterday.txt',35.1814464,136.906398);
miltsite[86]=new MILTSiteInfo('名瀬','nazeToday.txt','nazeYesterday.txt',35.4308446,139.5437035);
miltsite[87]=new MILTSiteInfo('与那国','yonaguniToday.txt','yonaguniYesterday.txt',24.4679685,123.0044532);
miltsite[88]=new MILTSiteInfo('神津島','kozu-simaToday.txt','kozu-simaYesterday.txt',34.2052666,139.1342549);
}

CreateMILTSite();

/*
 * 近場の地点取得
 */
function MILTNearSite( lat, lon ) {
	var length = 999999999999;
	var targetsite = miltsite[0];
	for( var idx in miltsite ) {
	   var difflen = DiffLength( miltsite[idx].lat, miltsite[idx].lon, lat,lon );
	   if( difflen < length )
	   {
	      length = difflen;
	      targetsite = miltsite[idx];
	   }
	}

	return targetsite;
}