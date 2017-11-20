#include <pebble.h>
#include "utf8tool.h"

/*
 * UTF8 テーブル
 */
const char utf8length[] = {
  0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2,
  3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
  4, 4, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 6, 6, 1, 1,
};

/*
 * UTF8 バイト数取得
 */
size_t utf8_length(const char c )
{
  return (size_t)utf8length[(unsigned char)c];  
}

/*
 * UTF8 文字数取得
 */
int utf8_strlen( const char* c )
{
  int cnt=0;
  char* pos = (char*)c;
  size_t len = 0;
  while( *pos != 0x00 )
  {
    len = utf8_length(*pos);
    pos+=len;
    cnt++;
  }
  
  return cnt;
}

/*
 * UTF8 文字数位置
 */
const char* utf8_position(const char* c, int length )
{
  int cnt=0;
  char* pos = (char*)c;
  size_t len = 0;
  while( *pos != 0x00 && cnt < length )
  {
    len = utf8_length(*pos);
    pos+=len;
    cnt++;
  }
  
  return pos;
}

/*
 * UTF8 バイト数取得
 */
int utf8_strlenb( const char* c )
{
  int cnt=0;
  char* pos = (char*)c;
  size_t len = 0;
  while( *pos != 0x00 )
  {
    len = utf8_length(*pos);
    pos+=len;
    cnt+=len;
  }
  
  return cnt;
}