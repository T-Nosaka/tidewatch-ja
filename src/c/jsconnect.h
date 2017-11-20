#pragma once

#define MAX_TRANS_LENGTH 260

/*
 * 受信発生コールバック
 */
typedef void (* js_receive_callback)(Tuple *tuple);

/*
 * メッセージ定義
 */
enum JSMessageKey {
  LOCATION_REQ_KEY = 1,
  TIDE_RES_READY_KEY = 3,
  TIDE_RES_FINISH_KEY = 4,
  TIDE_RES_BIN_KEY = 5,
  LOCATION_LATLON_RES_KEY = 20,
  WEATHER_ICON_KEY = 31,
  WEATHER_TEMPERATURE_KEY = 32,
  WEATHER_CITY_KEY = 33,
  YW_RES_TITLE_KEY = 41,
  YW_RES_CLEAR_KEY = 42,
  MILTTIDE_RES_BIN_KEY = 51
};

/*
 * JSへ取得要求
 */
void js_request_location();

/*
 * JSコールバック設定
 */
void js_setup(AppSyncTupleChangedCallback changedcallback,js_receive_callback receivecallback );
