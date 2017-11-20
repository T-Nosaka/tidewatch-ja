#include <pebble.h>
#include "atof2.h"
#include "main.h"
#include "jsconnect.h"
#include "tidedraw.h"
#include "mooncalc.h"
#include "messagelist.h"
#include "utf8tool.h"
#include "scrolltxt.h"

// BEGIN AUTO-GENERATED UI CODE; DO NOT MODIFY
static Window *s_window;
static GBitmap *s_res_image_back_white;
static GFont s_res_roboto_condensed_21;
static GFont s_res_gothic_18_bold;
static GFont s_res_gothic_18;
static GFont s_res_font_moongraph_30;
static GFont s_res_gothic_28;
static BitmapLayer *s_backlayer;
static TextLayer *s_clocktxt;
static Layer *s_tidelayer;
static TextLayer *s_tidelocatetxt;
static TextLayer *s_z0txt;
static TextLayer *s_datetxt;
static TextLayer *s_wdatetxt;
static TextLayer *s_temptxt;
static TextLayer *s_moontext;
static TextLayer *s_wethertxt;
static TextLayer *s_citytxt;

static void initialise_ui(void) {
  s_window = window_create();
  window_set_background_color(s_window, GColorBlack);
  #ifndef PBL_SDK_3
    window_set_fullscreen(s_window, true);
  #endif
  
  s_res_image_back_white = gbitmap_create_with_resource(RESOURCE_ID_IMAGE_BACK_WHITE);
  s_res_roboto_condensed_21 = fonts_get_system_font(FONT_KEY_ROBOTO_CONDENSED_21);
  s_res_gothic_18_bold = fonts_get_system_font(FONT_KEY_GOTHIC_18_BOLD);
  s_res_gothic_18 = fonts_get_system_font(FONT_KEY_GOTHIC_18);
  s_res_font_moongraph_30 = fonts_load_custom_font(resource_get_handle(RESOURCE_ID_FONT_MOONGRAPH_30));
  s_res_gothic_28 = fonts_get_system_font(FONT_KEY_GOTHIC_28);
  // s_backlayer
  s_backlayer = bitmap_layer_create(GRect(0, -6, 144, 168));
  bitmap_layer_set_bitmap(s_backlayer, s_res_image_back_white);
  bitmap_layer_set_background_color(s_backlayer, GColorBlack);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_backlayer);
  
  // s_clocktxt
  s_clocktxt = text_layer_create(GRect(0, 144, 143, 21));
  text_layer_set_background_color(s_clocktxt, GColorClear);
  text_layer_set_text_color(s_clocktxt, GColorWhite);
  text_layer_set_text(s_clocktxt, "00:00:00");
  text_layer_set_text_alignment(s_clocktxt, GTextAlignmentCenter);
  text_layer_set_font(s_clocktxt, s_res_roboto_condensed_21);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_clocktxt);
  
  // s_tidelayer
  s_tidelayer = layer_create(GRect(0, 66, 143, 52));
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_tidelayer);
  
  // s_tidelocatetxt
  s_tidelocatetxt = text_layer_create(GRect(3, 66, 69, 21));
  text_layer_set_background_color(s_tidelocatetxt, GColorClear);
  text_layer_set_text_color(s_tidelocatetxt, GColorWhite);
  text_layer_set_text(s_tidelocatetxt, " ");
  text_layer_set_font(s_tidelocatetxt, s_res_gothic_18_bold);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_tidelocatetxt);
  
  // s_z0txt
  s_z0txt = text_layer_create(GRect(76, 64, 68, 20));
  text_layer_set_background_color(s_z0txt, GColorClear);
  text_layer_set_text_color(s_z0txt, GColorWhite);
  text_layer_set_text(s_z0txt, " ");
  text_layer_set_text_alignment(s_z0txt, GTextAlignmentRight);
  text_layer_set_font(s_z0txt, s_res_gothic_18_bold);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_z0txt);
  
  // s_datetxt
  s_datetxt = text_layer_create(GRect(0, 119, 113, 28));
  text_layer_set_background_color(s_datetxt, GColorClear);
  text_layer_set_text_color(s_datetxt, GColorWhite);
  text_layer_set_text(s_datetxt, "0000-00-00");
  text_layer_set_text_alignment(s_datetxt, GTextAlignmentCenter);
  text_layer_set_font(s_datetxt, s_res_roboto_condensed_21);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_datetxt);
  
  // s_wdatetxt
  s_wdatetxt = text_layer_create(GRect(111, 120, 32, 22));
  text_layer_set_background_color(s_wdatetxt, GColorClear);
  text_layer_set_text_color(s_wdatetxt, GColorWhite);
  text_layer_set_text(s_wdatetxt, "金");
  text_layer_set_text_alignment(s_wdatetxt, GTextAlignmentCenter);
  text_layer_set_font(s_wdatetxt, s_res_gothic_18);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_wdatetxt);
  
  // s_temptxt
  s_temptxt = text_layer_create(GRect(43, 14, 33, 20));
  text_layer_set_background_color(s_temptxt, GColorClear);
  text_layer_set_text_color(s_temptxt, GColorWhite);
  text_layer_set_text(s_temptxt, "0");
  text_layer_set_text_alignment(s_temptxt, GTextAlignmentCenter);
  text_layer_set_font(s_temptxt, s_res_gothic_18);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_temptxt);
  
  // s_moontext
  s_moontext = text_layer_create(GRect(90, 4, 33, 33));
  text_layer_set_background_color(s_moontext, GColorClear);
  text_layer_set_text_color(s_moontext, GColorWhite);
  text_layer_set_text(s_moontext, " ");
  text_layer_set_text_alignment(s_moontext, GTextAlignmentCenter);
  text_layer_set_font(s_moontext, s_res_font_moongraph_30);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_moontext);
  
  // s_wethertxt
  s_wethertxt = text_layer_create(GRect(17, 4, 33, 29));
  text_layer_set_background_color(s_wethertxt, GColorClear);
  text_layer_set_text_color(s_wethertxt, GColorWhite);
  text_layer_set_text(s_wethertxt, " ");
  text_layer_set_text_alignment(s_wethertxt, GTextAlignmentCenter);
  text_layer_set_font(s_wethertxt, s_res_gothic_28);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_wethertxt);
  
  // s_citytxt
  s_citytxt = text_layer_create(GRect(0, 39, 143, 26));
  text_layer_set_background_color(s_citytxt, GColorClear);
  text_layer_set_text_color(s_citytxt, GColorWhite);
  text_layer_set_text(s_citytxt, " ");
  text_layer_set_font(s_citytxt, s_res_gothic_18);
  layer_add_child(window_get_root_layer(s_window), (Layer *)s_citytxt);
}

static void destroy_ui(void) {
  window_destroy(s_window);
  bitmap_layer_destroy(s_backlayer);
  text_layer_destroy(s_clocktxt);
  layer_destroy(s_tidelayer);
  text_layer_destroy(s_tidelocatetxt);
  text_layer_destroy(s_z0txt);
  text_layer_destroy(s_datetxt);
  text_layer_destroy(s_wdatetxt);
  text_layer_destroy(s_temptxt);
  text_layer_destroy(s_moontext);
  text_layer_destroy(s_wethertxt);
  text_layer_destroy(s_citytxt);
  gbitmap_destroy(s_res_image_back_white);
  fonts_unload_custom_font(s_res_font_moongraph_30);
}
// END AUTO-GENERATED UI CODE

static void handle_window_unload(Window* window) {
  destroy_ui();
}

void show_main(void) {
  initialise_ui();
  window_set_window_handlers(s_window, (WindowHandlers) {
    .unload = handle_window_unload,
  });
  window_stack_push(s_window, true);
}

void hide_main(void) {
  window_stack_remove(s_window, true);
}

/*
 * 初期処理状態
 */
static int init_job = 0;

/*
 * 潮汐取得状態
 */
static int init_tide = 0;


/*
 * メッセージインデックス
 */
static int message_idx=-1;

/*
 * スクロール完了コールバック
 */
void OnFinishScroll()
{
    //次のメッセージ
  message_idx++;
  
  //メッセージ表示
  int mes_size = messagelist_size();
  if( message_idx >= mes_size )
  {
    if( mes_size == 0 )
    {
      message_idx = -1;
      return;
    }
    
    //先頭に戻す
    message_idx = 0;
  }

  //ッセージを取得
  char* pmes = messagelist_get(message_idx);
  int meslength = utf8_strlen( pmes );
     
  //メッセージセット
  ScrollText_contents( pmes, meslength );
}

/*
 * 同タイプのメッセージ削除
 */
void deletePrevMessageType( uint32_t type )
{
  int loopout = 1;
  while( loopout )
  {
    loopout = 0;
    for( int iIdx=0; iIdx<messagelist_size();iIdx++ )
    {
      message_data_t* ps = messagelist_getstruct( iIdx );
      if( ps->type == type )
      {
        messagelist_remove( iIdx );
        loopout = 1;
        break;
      }
    }
  }
  
  //現在スクロールキャンセル
  ScrollText_cancel();
}

/*
 * 時刻更新
 */
void update_time() {
  
  //現在時刻取得
  time_t temp = time(NULL);
  struct tm *tick_time = localtime(&temp);
 
  int yy = tick_time->tm_year+1900;
	int mm = tick_time->tm_mon+1;
	int dd = tick_time->tm_mday;
	int ww = tick_time->tm_wday; 
  
  //日時表示
  static char s_date1[20];
  strftime(s_date1, sizeof(s_date1), "%Y-%m-%d", tick_time );
  text_layer_set_text(s_datetxt, s_date1);
  
  //曜日
  char* wday = "";
    switch( ww )
    {
      case 0:
      wday = "日";
      break;
      case 1:
      wday = "月";
      break;
      case 2:
      wday = "火";
      break;
      case 3:
      wday = "水";
      break;
      case 4:
      wday = "木";
      break;
      case 5:
      wday = "金";
      break;
      case 6:
      wday = "土";
      break;
      default:
      wday = "?";
      break;
    }
  static char s_date2[5];
  snprintf(s_date2, sizeof(s_date2), "%s", wday );
  text_layer_set_text(s_wdatetxt, s_date2);

  // 月齢
  int iMoonAge = mooncalc( yy, mm, dd );
  setmoontext( iMoonAge, s_moontext );
  
  //時計表示
  static char s_time1[10];
  strftime(s_time1, sizeof(s_time1), "%H:%M:%S", tick_time );
  text_layer_set_text(s_clocktxt, s_time1);

  if( init_job == 0 )
  {
    //初期処理
    init_job = 1;
    
    //潮汐要求
    js_request_location();
  }
  else
  {
    if( init_tide == 0 )
    {
      //1分毎に更新
      if( tick_time->tm_sec == 0 ) {
        //潮汐要求
        js_request_location();
      }
    }
    else
    {
      //1時間毎に更新
      if( tick_time->tm_min == 0 && tick_time->tm_sec == 0 ) {
        //潮汐要求
        js_request_location();
      }
    }
  }
  
  if( message_idx == -1 )
  {
    //非表示中
    //メッセージ確認
    int mes_size = messagelist_size();
    
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Message Start %d", mes_size);
    
    if( mes_size > 0 )
    {
      //最初のメッセージを取得
      message_idx = 0;
      char* pmes = messagelist_get(message_idx);
      int meslength = utf8_strlen( pmes );
      
      //メッセージセット
      ScrollText_contents( pmes, meslength );
    }
  }
  else
  {
    //表示中
    //スクロール進行
    ScrollText_beat();
  }
}

/*
 * 秒周期ハンドル
 */
void tick_handler(struct tm *tick_time, TimeUnits units_changed) {
   update_time();
}

/*
 * 天候設定
 */
void setwether( int iVal, int iKind )
{
  switch( iKind )
  {
    case 2:
    text_layer_set_text(s_wethertxt,"雷");
    break;
    case 3:
    text_layer_set_text(s_wethertxt,"霧");
    break;
    case 5:
    text_layer_set_text(s_wethertxt,"雨");
    break;
    case 6:
    text_layer_set_text(s_wethertxt,"雪");
    break;          
    case 7:
    text_layer_set_text(s_wethertxt,"異");
    break;          
    case 8:
    {
      if( iVal == 800 )
        text_layer_set_text(s_wethertxt,"晴");
      else
        text_layer_set_text(s_wethertxt,"曇");
    }
    break;
    case 9:
    text_layer_set_text(s_wethertxt,"極");
    break; 
    default:
    text_layer_set_text(s_wethertxt,"不");
    break;
  }
}

/*
 * 同期メーセージ変化発生コールバック
 */
static void js_handler(const uint32_t key, const Tuple* new_tuple, const Tuple* old_tuple, void* context)
{
//  APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Sync : %d, %s", (int)key,new_tuple->value->cstring);
}

/*
 * 潮汐データ
 */
extern float tidelist[25];

/*
 * 潮汐実測値リスト
 * -12 -> 0
 */
extern float milttidelist[26];

/*
 * 受信発生
 */
static void OnReceive(Tuple *tuple)
{
  static char tidename[21];
  static char tidez0str[21];
  float fz0 = 0.0f;
  static char tmpstr[10];
  
  int key = (int)tuple->key;
  switch (key) {
    case TIDE_RES_BIN_KEY:
       if( tuple->length >= sizeof(tidelist) ) {
         //連続floatデータ
//       APP_LOG(APP_LOG_LEVEL_DEBUG, "TIDE_RES_BIN_KEY ");
         memcpy(tidelist, tuple->value->data, sizeof(tidelist));
         //潮汐データ
         init_tide = 1;
       }
       break;

    case TIDE_RES_READY_KEY:
//       APP_LOG(APP_LOG_LEVEL_DEBUG, "TIDE_RES_READY_KEY");
       //潮汐地名セット
       strncpy(tidename,tuple->value->cstring,sizeof(tidename)-1);
       text_layer_set_text(s_tidelocatetxt,tidename);
      break;
    
    case TIDE_RES_FINISH_KEY:
        //基本海抜
        fz0 = atof2(tuple->value->cstring);
        setTideZ0(fz0);
        snprintf(tidez0str,sizeof(tidez0str),"Z0=%d",(int)fz0);
        text_layer_set_text( s_z0txt, tidez0str);
    
       //潮汐描画要求
       //layer_mark_dirty(s_tidelayer);
       //APP_LOG(APP_LOG_LEVEL_DEBUG, "潮汐描画要求");
    
       init_tide = 1;
      break;

    //海保実測値
    case MILTTIDE_RES_BIN_KEY:
      //APP_LOG(APP_LOG_LEVEL_DEBUG, "MILTTIDE_RES_BIN_KEY %d %d",tuple->length,sizeof(milttidelist));
      if( tuple->length >= (sizeof(float)*26) )
      {
        float *p = (float*)tuple->value->data;
        for( int iIdx=0; iIdx<26; iIdx++ ) {
//          APP_LOG(APP_LOG_LEVEL_DEBUG, "milt %d ", (int)p[iIdx] );
          milttidelist[iIdx] = p[iIdx];
        }
      }
      break;
    
    //位置情報
    case LOCATION_LATLON_RES_KEY:
//       APP_LOG(APP_LOG_LEVEL_DEBUG, tuple->value->cstring);
       deletePrevMessageType(3);
       messagelist_push( (char*)tuple->value->cstring, MAX_MESSAGE_LENGTH, 3 );
      break;
    
      //天候
    case WEATHER_ICON_KEY:
       {
          int iVal = atoi(tuple->value->cstring);
          int iKind = iVal/100;
          setwether( iVal, iKind );
       }
       break;

    //温度
    case WEATHER_TEMPERATURE_KEY:
       strncpy( tmpstr, tuple->value->cstring, sizeof(tmpstr)-1 );
       text_layer_set_text(s_temptxt,tmpstr);
       break;
    
    //City
    case WEATHER_CITY_KEY:
//       strncpy( citystr, tuple->value->cstring, sizeof(citystr)-1 );
    
       deletePrevMessageType(2);
       messagelist_push( (char*)tuple->value->cstring, MAX_MESSAGE_LENGTH, 2 );
    
//       text_layer_set_text(s_citytxt,citystr);
       break;
    
    //Yahoo地域天候情報削除
    case YW_RES_CLEAR_KEY:
       deletePrevMessageType(1);
    break;
    
    //Yahoo地域天候情報
    case YW_RES_TITLE_KEY:
       messagelist_push( (char*)tuple->value->cstring, MAX_MESSAGE_LENGTH, 1 );
//       APP_LOG(APP_LOG_LEVEL_DEBUG, tuple->value->cstring);
       break;
  }
}

/*
 * メイン
 */
int main(void) {
  //画面設定
  show_main();
  
  //潮汐レイヤーセットアップ
  setup_tidelayer(s_tidelayer);

  //JS接続セットアップ
  js_setup(js_handler,OnReceive);
  
  //スクロールテキスト
  ScrollText_set( s_citytxt, OnFinishScroll );
  
  //秒周期イベントコールバック登録
  tick_timer_service_subscribe(SECOND_UNIT, tick_handler);

  app_event_loop();
  
  //潮汐レイヤー破棄
  destroy_tidelayer();
}