#include <pebble.h>
#include "scrolltxt.h"
#include "utf8tool.h"

#define RIGHT_POSITION -5

/*
 * スクロールするテキスト
 */
static TextLayer *s_scrolltext = NULL;

/*
 * スクロール終了コールバック
 */
static ScrollText_callback s_scrollcallback;

/*
 * 対象文字列
 */
static char* s_text = NULL;


//static char s_msgtext[21];

/*
 * 対象文字数
 */
static int s_length = 0;

/*
 * 位置
 */
static int s_position = 0;

/*
 * テキストレイヤーセット
 */
void ScrollText_set( TextLayer* scrolltext, ScrollText_callback callback )
{
  s_scrolltext = scrolltext;
  s_scrollcallback = callback;
}

/*
 * 対象文字列セット
 */
void ScrollText_contents( char* text, int len )
{
  s_text = text;
  s_length = len;
  s_position = RIGHT_POSITION;
  
//  APP_LOG(APP_LOG_LEVEL_DEBUG, "ScrollText_contents [%s] [%d] [%d]", s_text, s_length, s_position);
}

/*
 * 現在スクロールキャンセル
 */
void ScrollText_cancel()
{
  s_position = s_length;
}

/*
 * 進行
 */
void ScrollText_beat()
{
  if( s_text == NULL || s_scrolltext == NULL )
     return;

   if( s_position >= s_length )
   {
     s_scrollcallback();
     return;
   }

//  APP_LOG(APP_LOG_LEVEL_DEBUG, "ScrollText_beat %d", s_position);
  
  if( s_position <= 0 )
  {
/*    
    int msgsize = utf8_strlenb(s_text);
    int size = s_position;
    if( size > msgsize )   //10 > 20
      size = msgsize;
    if( size > (int)sizeof(s_msgtext)-1 )   //10 >  21-1
      size = (int)sizeof(s_msgtext)-1;
    
    //先頭を右からスクロールさせる
    memset( s_msgtext, 0x00, sizeof(s_msgtext) );
    memset( s_msgtext, ' ', sizeof(s_msgtext)-1 );
    memcpy( s_msgtext-s_position, s_text, size );  // p- (-10), 10
    text_layer_set_text(s_scrolltext, s_msgtext);
*/    
    text_layer_set_text(s_scrolltext, s_text);
  }
  else
  {
    //現在位置取得
    const char* pCur = utf8_position(s_text, s_position );
    text_layer_set_text(s_scrolltext, pCur);
  }
  
  //現在位置シフト
  s_position++;
  
  if( s_position >= s_length )
  {
    s_scrollcallback();
  }
}
