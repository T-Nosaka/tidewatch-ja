#include <pebble.h>
#include "tidedraw.h"

/*
 * 潮汐リスト
 * -12 -> +12
 */
float tidelist[25];

/*
 * 潮汐実測値リスト 30分毎
 * -12 -> 0
 */
float milttidelist[25];

/*
 * 時間幅
 */
#define PBB 12

/*
 * 基本海抜
 */
float tidebase = 0.0f;

/*
 * 潮汐基本海抜セット
 */
void setTideZ0( float val )
{
  tidebase = val;
}

/*
 * 潮汐レイヤー描画
 */
static void DrawTide(Layer *layer, GContext* ctx)
{
//  APP_LOG(APP_LOG_LEVEL_DEBUG, "DrawTide");
  
  //レイヤーサイズ取得
  GRect bounds = layer_get_bounds(layer);
  bounds.size.h--;

  //白
  graphics_context_set_fill_color(ctx, GColorWhite);
  graphics_context_set_stroke_color(ctx, GColorWhite);
  
  //現在時刻取得
  time_t now = time(NULL);

  //値域
  float h_max = tidebase+100.0f;
  float h_min = tidebase-100.0f;
  //縦分解能
  float h_b = (h_max - h_min)/(float)bounds.size.h;

  //横軸
  int linepos = bounds.size.h - ((tidebase - h_min) / h_b);
  GPoint left = GPoint(0, linepos);
  GPoint right = GPoint(bounds.size.w, linepos);
  graphics_draw_line(ctx, left, right);

  int centerw = bounds.size.w/2;
  for( int iH = h_min; iH<=h_max; iH+=50 )
  {
    int wlpos = bounds.size.h - (((float)iH - h_min) / h_b);
    GPoint wleft = GPoint(centerw-2, wlpos);
    GPoint wright = GPoint(centerw+2, wlpos);
    graphics_draw_line(ctx, wleft, wright);
  }
  
  //海面描画用前回頂点位置
  GPoint last_start;
  
  //幅半分長
  float cw = bounds.size.w/2;
  //1/6分解能
  float cwb = cw/(float)PBB;
  for( int iHour=-PBB; iHour<=PBB; iHour++ )
  {
    //対象時間
    time_t tt = now + 3600 * iHour;
    struct tm *l_tt = localtime(&tt);
    
    //潮汐計算
    float tide = tidelist[iHour+PBB];
    if( tide > h_max )
      tide = h_max;
    if( tide < h_min )
      tide = h_min;
    
    //頂点
    int top = bounds.size.h - ((tide - h_min) / h_b);
    //底辺
    int bottom = bounds.size.h;

    //x座標
    int x = cwb * (iHour+PBB);
    
    //頂点
    GPoint start = GPoint(x, top);
    GPoint end = GPoint(x, bottom);

    //時間軸
    GPoint hjstart = GPoint(x, linepos-2);
    GPoint hjend = GPoint(x, linepos+2);
    graphics_draw_line(ctx, hjstart, hjend);
    
    if( iHour > -PBB )
    {
      //海面描画
      graphics_draw_line(ctx, last_start, start);
    }
    if( iHour == 0 )
    {
      //中心ライン
      GPoint top = GPoint(x, 0);
      graphics_draw_line(ctx, top, end);
    }
    
    last_start = start;
    
//    APP_LOG(APP_LOG_LEVEL_DEBUG, "graphics_draw_line x=%d y=%d x=%d y=%d", start.x, start.y,end.x,end.y);
  }
  
  //1/12分解能 (30分毎)
  cwb = cw/(float)PBB/2;
  //実測値
  for( int iIdx=0; iIdx<26; iIdx++ )
  {
    //潮汐実測値
    float tide = milttidelist[iIdx];
    if( tide > h_max || tide < h_min )
      continue;
    
    //頂点
    int top = bounds.size.h - ((tide - h_min) / h_b);

    //x座標
    int x = cwb * (iIdx);
    
    //頂点
    GPoint start = GPoint(x, top);

    //描画
    graphics_draw_pixel(ctx, start);
    
//    APP_LOG(APP_LOG_LEVEL_DEBUG, "graphics_draw_line x=%d y=%d x=%d y=%d", start.x, start.y,end.x,end.y);
  }

}

/*
 * 潮汐レイヤー更新
 */
void tide_layer_update_callback(Layer *layer, GContext* ctx) {
  DrawTide(layer, ctx);
}


/*
 * 潮汐レイヤーセットアップ
 */
void setup_tidelayer(Layer* layer)
{
  layer_set_update_proc(layer, tide_layer_update_callback);
}

/*
 * 潮汐レイヤー破棄
 */
void destroy_tidelayer()
{
}
