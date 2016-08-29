var itemsLayer;
var cart;

var gameScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new game();
        gameLayer.init();
        this.addChild(gameLayer);
    }
});


var game = cc.Layer.extend({
    init:function () {
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
        topLayer.addChild(cart,0);
        cart.setPosition(240,24);
   　　　//addItemを1秒ごと呼び出す
        this.schedule(this.addItem,1);
    },
    addItem:function(){
        var item = new Item();
        itemsLayer.addChild(item,1);
    },
    removeItem:function(item){
        itemsLayer.removeChild(item);
    }
});

var Item = cc.Sprite.extend({
    ctor:function() {
        this._super();
        if(Math.random()<0.5){
            this.initWithFile(res.bomb_png);
            this.isBomb=true;
        }
        else{
            this.initWithFile(res.strawberry_png);
            this.isBomb=false;
        }
    },
    onEnter:function() {
        this._super();
        this.setPosition(Math.random()*400+40,350);
        var moveAction = cc.MoveTo.create(8, new cc.Point(Math.random()*400+40,-50));
        this.runAction(moveAction);
        this.scheduleUpdate();
    },
    update:function(dt){
        if(this.getPosition().y<35 && this.getPosition().y>30&&
           Math.abs(this.getPosition().x-cart.getPosition().x)<10 && !this.isBomb){
            gameLayer.removeItem(this);
            console.log("FRUIT");
        }
        if(this.getPosition().y<35 && Math.abs(this.getPosition().x-cart.getPosition().x)<25&&
           this.isBomb){
            gameLayer.removeItem(this);
            console.log("BOMB");
        }
        if(this.getPosition().y<-30){
            gameLayer.removeItem(this)
        }
    }
});
