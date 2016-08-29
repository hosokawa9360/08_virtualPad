var itemsLayer;
var cart;
var xSpeed = 0; //カートの移動速度
var left; //左ボタン
var right; //右ボタン

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    gameLayer = new game();
    gameLayer.init();
    this.addChild(gameLayer);
  }
});


var game = cc.Layer.extend({
  init: function() {
    this._super();
    //グラデーション背景
    //  var backgroundLayer = cc.LayerGradient.create(cc.color(0,0,0,255), cc.color(0x46,0x82,0xB4,255));

    //森の背景
    var background = new cc.Sprite(res.background_png);
    var size = cc.director.getWinSize();
    background.setPosition(cc.p(size.width / 2.0, size.height / 2.0));
    var backgroundLayer = cc.Layer.create();
    backgroundLayer.addChild(background);
    this.addChild(backgroundLayer);

    //アイテムがおちてくるレイヤー
    itemsLayer = cc.Layer.create();
    this.addChild(itemsLayer);

    //ショッピングカートを操作するレイヤー
    topLayer = cc.Layer.create();
    this.addChild(topLayer);
    cart = cc.Sprite.create(res.cart_png);
    topLayer.addChild(cart, 0);
    cart.setPosition(240, 24);
    //左ボタン
    left = cc.Sprite.create(res.leftbutton_png);
    topLayer.addChild(left, 0);
    left.setPosition(40, 160)
    left.setOpacity(128)

    //右ボタン
    right = cc.Sprite.create(res.rightbutton_png);
    topLayer.addChild(right, 0);
    right.setPosition(440, 160);
    right.setOpacity(128)

    //addItemを1秒ごと呼び出す
    this.schedule(this.addItem, 1);

    //タッチイベントのリスナー追加
    cc.eventManager.addListener(touchListener, this);
    //カートの移動のため　Update関数を1/60秒ごと実行させる　
    this.scheduleUpdate();
  },
  addItem: function() {
    var item = new Item();
    itemsLayer.addChild(item, 1);
  },
  removeItem: function(item) {
    itemsLayer.removeChild(item);
  },
    //カートの移動のため　Update関数を1/60秒ごと実行させる関数
  update:function(dt){
      if(xSpeed>0){//スピードが正の値（右方向移動）
        //　カートの向きを判定させる
          cart.setFlippedX(true);
      }
      if(xSpeed<0){//スピードが負の値（左方向移動）
          cart.setFlippedX(false);
      }
      //カートの位置を更新する
      cart.setPosition(cart.getPosition().x+xSpeed,cart.getPosition().y);
  }
});

var Item = cc.Sprite.extend({
  ctor: function() {
    this._super();
    //ランダムに爆弾と果物を生成する
    if (Math.random() < 0.5) {
      this.initWithFile(res.bomb_png);
      this.isBomb = true;
    } else {
      this.initWithFile(res.strawberry_png);
      this.isBomb = false;
    }
  },
  //アイテムが生成された後、描画されるときに実行
  onEnter: function() {
    this._super();
    //ランダムな位置に
    this.setPosition(Math.random() * 400 + 40, 350);
    //ランダムな座標に移動させる
    var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random() * 400 + 40, -50));
    this.runAction(moveAction);
    this.scheduleUpdate();
  },
  update: function(dt) {
    //果物の処理　座標をチェックしてカートの接近したら
    if (this.getPosition().y < 35 && this.getPosition().y > 30 &&
      Math.abs(this.getPosition().x - cart.getPosition().x) < 10 && !this.isBomb) {
      gameLayer.removeItem(this);
      console.log("FRUIT");
    }
    //爆弾の処理　座標をチェックしてカートの接近したら　フルーツより爆弾に当たりやすくしている
    if (this.getPosition().y < 35 && Math.abs(this.getPosition().x - cart.getPosition().x) < 25 &&
      this.isBomb) {
      gameLayer.removeItem(this);
      console.log("BOMB");
    }
    //地面に落ちたアイテムは消去
    if (this.getPosition().y < -30) {
      gameLayer.removeItem(this)
    }
  }
});

//タッチリスナーの実装
var touchListener = cc.EventListener.create({
    event: cc.EventListener.TOUCH_ONE_BY_ONE,
    swallowTouches: true,
    onTouchBegan: function (touch, event) {
      //タッチされた場所が、画面の左側だったら
        if(touch.getLocation().x < 240){
            xSpeed = -2;
            left.setOpacity(255);
            right.setOpacity(128);
        }
        else{
            xSpeed = 2;
            right.setOpacity(255);
            left.setOpacity(128);
        }
        return true;
    },
    //タッチを止めたときは、移動スピードを0にする
    onTouchEnded:function (touch, event) {
        xSpeed = 0;
        left.setOpacity(128);
        right.setOpacity(128);
    }
})
