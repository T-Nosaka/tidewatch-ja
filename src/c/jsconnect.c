#include <pebble.h>
#include "jsconnect.h"

/*
 * JSメーセージ同期オブジェクト
 */
static AppSync sync;

/*
 * メッセージバッファ
 */
static uint8_t sync_buffer[MAX_TRANS_LENGTH];

/*
 * 同期エラーコールバック
 */
static void sync_error_callback(DictionaryResult dict_error, AppMessageResult app_message_error, void *context)
{
  APP_LOG(APP_LOG_LEVEL_DEBUG, "App Message Sync Error: %d", app_message_error);
}

/*
 * 結果メッセージ変換
 */
char *translate_error(AppMessageResult result) {
  switch (result) {
    case APP_MSG_OK: return "APP_MSG_OK";
    case APP_MSG_SEND_TIMEOUT: return "APP_MSG_SEND_TIMEOUT";
    case APP_MSG_SEND_REJECTED: return "APP_MSG_SEND_REJECTED";
    case APP_MSG_NOT_CONNECTED: return "APP_MSG_NOT_CONNECTED";
    case APP_MSG_APP_NOT_RUNNING: return "APP_MSG_APP_NOT_RUNNING";
    case APP_MSG_INVALID_ARGS: return "APP_MSG_INVALID_ARGS";
    case APP_MSG_BUSY: return "APP_MSG_BUSY";
    case APP_MSG_BUFFER_OVERFLOW: return "APP_MSG_BUFFER_OVERFLOW";
    case APP_MSG_ALREADY_RELEASED: return "APP_MSG_ALREADY_RELEASED";
    case APP_MSG_CALLBACK_ALREADY_REGISTERED: return "APP_MSG_CALLBACK_ALREADY_REGISTERED";
    case APP_MSG_CALLBACK_NOT_REGISTERED: return "APP_MSG_CALLBACK_NOT_REGISTERED";
    case APP_MSG_OUT_OF_MEMORY: return "APP_MSG_OUT_OF_MEMORY";
    case APP_MSG_CLOSED: return "APP_MSG_CLOSED";
    case APP_MSG_INTERNAL_ERROR: return "APP_MSG_INTERNAL_ERROR";
    default: return "UNKNOWN ERROR";
  }
}

/*
 * メッセージ破棄発生
 */
static void appmsg_in_dropped(AppMessageResult reason, void *context) {
  APP_LOG(APP_LOG_LEVEL_DEBUG, "In dropped: %s", translate_error(reason));
}

/*
 * 受信発生コールバック
 */
static js_receive_callback m_receive_callback = NULL;

/*
 * 受信発生
 */
static void inbox_received_callback(DictionaryIterator *iterator, void *context) {
  
  Tuple *tuple = dict_read_first(iterator);
  if (!tuple) {
    APP_LOG(APP_LOG_LEVEL_DEBUG, "Received null");
    return;
  }

  APP_LOG(APP_LOG_LEVEL_DEBUG, "Received: %d", (int)tuple->key );

  if( m_receive_callback != NULL ) {
    m_receive_callback(tuple);
  }
}

/*
 * JSへ取得要求
 */
void js_request_location()
{
  DictionaryIterator *iter;
  app_message_outbox_begin(&iter);
  if (iter == NULL) {
    return;
  }
  dict_write_uint8(iter, LOCATION_REQ_KEY, 1); //key, value
  dict_write_end(iter);
  app_message_outbox_send();
}

/*
 * JSコールバック設定
 */
void js_setup(AppSyncTupleChangedCallback changedcallback,js_receive_callback receivecallback )
{
    m_receive_callback = receivecallback;

  //通信路開通   
  const int inbound_size = MAX_TRANS_LENGTH;
  const int outbound_size = MAX_TRANS_LENGTH;
  app_message_open(inbound_size, outbound_size);

  //通信メッセージ
  Tuplet initial_values[] = {
    TupletCString(TIDE_RES_READY_KEY, "---"),
    TupletBytes(TIDE_RES_BIN_KEY,(uint8_t *)NULL,0),
    TupletCString(TIDE_RES_FINISH_KEY, "0"),
    TupletCString(LOCATION_LATLON_RES_KEY, ""),
    TupletCString(WEATHER_ICON_KEY, ""),
    TupletCString(WEATHER_TEMPERATURE_KEY, ""),
    TupletCString(WEATHER_CITY_KEY, ""),
    TupletCString(YW_RES_TITLE_KEY, ""),
    TupletBytes(MILTTIDE_RES_BIN_KEY,(uint8_t *)NULL,0),
  };
  
  app_sync_init(&sync, sync_buffer, sizeof(sync_buffer), initial_values, ARRAY_LENGTH(initial_values),
      changedcallback, sync_error_callback, NULL);
  
  app_message_register_inbox_received(inbox_received_callback);
  app_message_register_inbox_dropped(appmsg_in_dropped);
}