
/*
 * ビッグインディアン
 */
var bigendian = 0;

/*
 * エンディアン判定
 */
function checkendian() {
    
  //判定値
  var f = new Float32Array([1.5]);
  var b = new Uint8Array(f.buffer);
  if( b[0] == 63 ) {
    bigendian = 1;
    console.log("Big endian");
  }
  else {
    console.log("Little endian");
  }
}

/*
 * Littleに変換し、Array型にキャスト
 */
function toArray( uint8array ) {
  
  var senddata = [];
  
  if( bigendian==1 ) {
     for( var idx=0; idx<uint8array.length; idx+=4 ) {
       for( var p=0; p<4; p++ ) {
          senddata[idx+p] = uint8array[idx+3-p];      
       }
     }    
  }
  else {
     for( var idx=0; idx<uint8array.length; idx++ ) {
       senddata[idx] = uint8array[idx];
     }
  }
  
  return senddata;
}
