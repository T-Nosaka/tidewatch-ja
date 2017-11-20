#pragma once

/*
 * 潮汐基本海抜セット
 */
void setTideZ0( float val );

/*
 * 潮汐レイヤーセットアップ
 */
void setup_tidelayer(Layer* layer);

/*
 * 潮汐レイヤー破棄
 */
void destroy_tidelayer();

/*
 * 潮汐レイヤー更新
 */
void tide_layer_update_callback(Layer *layer, GContext* ctx);
