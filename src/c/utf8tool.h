#pragma once

/*
 * UTF8 バイト数取得
 */
size_t utf8_length(const char c );

/*
 * UTF8 文字数取得
 */
int utf8_strlen( const char* c );

/*
 * UTF8 文字数位置
 */
const char* utf8_position(const char* c, int length );

/*
 * UTF8 バイト数取得
 */
int utf8_strlenb( const char* c );