#include <pebble.h>
#include "messagelist.h"
#include "fmvhash.h"
#include "utf8tool.h"


typedef struct {
  message_data_t* link;
  int enable;
} message_data_wrap_t;

/*
 * 本体
 */
static message_data_t list_message[MAX_MESSAGE_LIST];

/*
 * 仮想リスト
 */
static message_data_wrap_t virtual_list[MAX_MESSAGE_LIST];

/*
 * 初期処理済み
 */
static int do_init = 0;

/*
 * 初期処理
 */
void messagelist_init()
{
  //ストレージを仮想リストにリンクする。
  for( int iIdx=0; iIdx<MAX_MESSAGE_LIST; iIdx++ )
  {
    virtual_list[iIdx].link = &list_message[iIdx];
    virtual_list[iIdx].enable = 0;
  }
}

/*
 * メッセージ追加
 */
void messagelist_push( char* message, int len, uint32_t type )
{
  if( do_init == 0 ) {
    messagelist_init();
    do_init = 1;
  }
  
  int iContain = 0;
  for( int iIdx=0; iIdx<MAX_MESSAGE_LIST; iIdx++ )
  {
    if( virtual_list[iIdx].enable == 0 )
    {
      memset(virtual_list[iIdx].link->message, (char)0x00, MAX_MESSAGE_LENGTH );
      if( len >= MAX_MESSAGE_LENGTH-1 )
        len = MAX_MESSAGE_LENGTH-1;
      memcpy(virtual_list[iIdx].link->message,message,len);
      virtual_list[iIdx].link->hashkey = fnv_1_hash_32((uint8_t*)virtual_list[iIdx].link->message, utf8_strlenb(virtual_list[iIdx].link->message));
      virtual_list[iIdx].link->type = type;
      virtual_list[iIdx].enable = 1;
      iContain = 1;
      break; 
    }
  }
  if( iContain == 0 )
  {
    //あふれたので、一つ上げる
    message_data_t* first = virtual_list[0].link;
    for( int iIdx=0; iIdx<MAX_MESSAGE_LIST-1; iIdx++ )
    {
      virtual_list[iIdx].link = virtual_list[iIdx+1].link;
      virtual_list[iIdx].enable = virtual_list[iIdx+1].enable;
    }
    virtual_list[MAX_MESSAGE_LIST-1].link = first;
    memset(virtual_list[MAX_MESSAGE_LIST-1].link->message, (char)0x00, MAX_MESSAGE_LENGTH );
    if( len >= MAX_MESSAGE_LENGTH-1 )
      len = MAX_MESSAGE_LENGTH-1;
    memcpy(virtual_list[MAX_MESSAGE_LIST-1].link->message,message,len);
    virtual_list[MAX_MESSAGE_LIST-1].link->hashkey = fnv_1_hash_32((uint8_t*)virtual_list[MAX_MESSAGE_LIST-1].link->message, utf8_strlenb(virtual_list[MAX_MESSAGE_LIST-1].link->message));
    virtual_list[MAX_MESSAGE_LIST-1].link->type = type;
    virtual_list[MAX_MESSAGE_LIST-1].enable = 1;
  }
}

/*
 * サイズ
 */
int messagelist_size()
{
  for( int iIdx=0; iIdx<MAX_MESSAGE_LIST; iIdx++ )
  {
    if( virtual_list[iIdx].enable == 0 )
      return iIdx;
  }
  return MAX_MESSAGE_LIST;
}

/*
 * メッセージ取得
 */
char* messagelist_get( int idx )
{
  if( virtual_list[idx].enable == 1 )
  {
    return virtual_list[idx].link->message;
  }
  
  return NULL;
}

/*
 * メッセージ情報取得
 */
message_data_t* messagelist_getstruct( int idx )
{
  if( virtual_list[idx].enable == 1 )
  {
    return virtual_list[idx].link;
  }
  
  return NULL;
}


/*
 * メッセージクリア
 */
void messagelist_clear()
{
  for( int iIdx=0; iIdx<MAX_MESSAGE_LIST; iIdx++ )
  {
    virtual_list[iIdx].enable = 0;
  }  
}

/*
 * 同様メッセージ番号
 */
int messagelist_exists(char* message, int len)
{
  message_data_t mes;
  memset(mes.message, (char)0x00, sizeof(mes.message) );
  memcpy(mes.message,message,len);
  mes.hashkey = fnv_1_hash_32((uint8_t*)mes.message, utf8_strlenb(mes.message));
  for( int iIdx=0; iIdx<MAX_MESSAGE_LIST; iIdx++ )
  {
    if( virtual_list[iIdx].enable == 1 )
    {
      if( virtual_list[iIdx].link->hashkey == mes.hashkey )
        return iIdx;
    }
  }
  return -1;
}

/*
 * メッセージ削除
 */
void messagelist_remove( int idx )
{
  if( virtual_list[idx].enable == 0 )
    return;
  
  message_data_t* first = virtual_list[idx].link;

  //一つ上げる
  for( int iIdx=idx; iIdx<MAX_MESSAGE_LIST; iIdx++ )
  {
    virtual_list[iIdx].link = virtual_list[iIdx+1].link;
    virtual_list[iIdx].enable = virtual_list[iIdx+1].enable;
  }
  virtual_list[MAX_MESSAGE_LIST-1].link = first;
  virtual_list[MAX_MESSAGE_LIST-1].enable = 0;
}