#pragma once

/*
 * スクロール完了コールバック
 */
typedef void (* ScrollText_callback)();

/*
 * テキストレイヤーセット
 */
void ScrollText_set( TextLayer* scrolltext, ScrollText_callback callback );

/*
 * 対象文字列セット
 */
void ScrollText_contents( char* text, int len );

/*
 * 現在スクロールキャンセル
 */
void ScrollText_cancel();

/*
 * 進行
 */
void ScrollText_beat();