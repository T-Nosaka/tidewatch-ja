#include <pebble.h>
#include "mooncalc.h"

static int monthtbl[12] = {0,2,0,2,2,4,5,6,7,8,9,10};
static char moontbl[32] = {'0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v'};

/*
 * 月齢計算
 */
int mooncalc( int yy, int mm, int dd )
{
  return (((yy-11)%19)*11+monthtbl[mm-1] + dd)%30;
}

/*
 * 月テキストセット
 */
void setmoontext( int moonage, TextLayer *moontext_layer )
{
  moonage--;
  if( moonage<0 )
    moonage=0;
  if( moonage>29)
    moonage=29;
  
  float c = 31.0f/29.0f;
  int idx = (int)(c * (float)moonage);

  static char s_moonstring[2];
  snprintf(s_moonstring,sizeof(s_moonstring),"%c",moontbl[idx] );
  text_layer_set_text(moontext_layer, s_moonstring);
}
