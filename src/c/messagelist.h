#pragma once

#define MAX_MESSAGE_LENGTH 260
#define MAX_MESSAGE_LIST 15

typedef struct {
  char message[MAX_MESSAGE_LENGTH];
  uint32_t hashkey;
  uint32_t type;
} message_data_t;

/*
 * 追加
 */
void messagelist_push( char* message, int len, uint32_t type );

/*
 * サイズ
 */
int messagelist_size();

/*
 * メッセージ取得
 */
char* messagelist_get( int idx );

/*
 * メッセージ情報取得
 */
message_data_t* messagelist_getstruct( int idx );

/*
 * メッセージクリア
 */
void messagelist_clear();

/*
 * 同様メッセージ番号
 */
int messagelist_exists(char* message, int len);

/*
 * メッセージ削除
 */
void messagelist_remove( int idx );