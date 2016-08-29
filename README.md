##### 08_virtualPad

### その１ いちご画像と爆弾画像をランダムに落す
https://github.com/hosokawa9360/08_virtualPad/issues/1  
エンドレスランナーゲームのロジックとほぼ同じです。
コードをしっかり読んでください。

### その２　ゴーストボタンでカート操作する

 - 画面に右矢印、左矢印ボタンを配置する
 - 画面の右側をタッチしたら、カートが右に移動する（右矢印ボタンは半透明になる）  
 - 画面の左側をタッチしたら、カートが左に移動する（左矢印ボタンは半透明になる）  

 ### その３　バーチャルアナログパッド（タッチ＆ドラック）でカートを操作する
（resouce.jsに追加）
 touchorigin_png: "res/touchorigin.png",
 touchend_png: "res/touchend.png"

 //バーチャルアナログパッド用のタッチリスナーの実装
 ```
 var touchListener = cc.EventListener.create({
   event: cc.EventListener.TOUCH_ONE_BY_ONE,
   swallowTouches: true,
   onTouchBegan: function(touch, event) {
     //タッチ開始位置にスプライトを表示させる
     touchOrigin = cc.Sprite.create(res.touchorigin_png);
     topLayer.addChild(touchOrigin, 0);
     touchOrigin.setPosition(touch.getLocation().x, touch.getLocation().y);
 　　//タッチ位置にドラック用スプライトを表示させる
     touchEnd = cc.Sprite.create(res.touchend_png);
     topLayer.addChild(touchEnd, 0);
     touchEnd.setPosition(touch.getLocation().x, touch.getLocation().y);
     //タッチしているぞflagをON
     touching = true;
     return true;
   },
   onTouchMoved: function(touch, event) {
     //移動中の指の位置にドラック用スプライトを表示させる
     touchEnd.setPosition(touch.getLocation().x, touchEnd.getPosition().y);
   },
   onTouchEnded: function(touch, event) {
     //タッチ終了のときはスプライトを消す　タッチflagをOFF
     touching = false;
     topLayer.removeChild(touchOrigin);
     topLayer.removeChild(touchEnd);
   }
 })
 ```

 //カートの移動のため　Update関数を1/60秒ごと実行させる関数
  ```
 update: function(dt) {
   if (touching) {
   //touchEnd(ドラックしている位置）とタッチ開始位置の差を計算する
   //そのままだと値が大きすぎるので50で割る
   xSpeed = (touchEnd.getPosition().x - touchOrigin.getPosition().x) / 50;
     if (xSpeed > 0) {
       cart.setFlippedX(true);
     }
     if (xSpeed < 0) {
       cart.setFlippedX(false);
     }
     cart.setPosition(cart.getPosition().x + xSpeed, cart.getPosition().y);
   }
 }
 ```
