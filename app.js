var mResource= ["res/bg.png","res/1.png","res/2.png","res/3.png","res/4.png","res/5.png","res/6.png","res/7.png","res/8.png"];


var mPositionArray = [];

var mPieceArray=[];

var TOUCHDELAY = 150;
var COLSIZE = 24;
var dogs = [];




var UI = {
    score:0,
    pg:0,
    lastTime:0,
    multiplier:1,
    addScore:function(s){
        var now = Date.now();
        var timeD = now-this.lastTime;
        if(timeD < 500)
        {
            this.multiplier++;
        }
        else{
            this.multiplier = 1;
        }
        this.score += s*this.multiplier;
        this.scoreLabel.string = this.score;
        this.lastTime = now;
        this.scoreLabel.stopAllActions();
        this.scoreLabel.setScale((this.multiplier-1)*0.5+1.5);
        this.scoreLabel.runAction(cc.scaleTo(0.3, 1));
        this.pg++;
        this.pgLabel.string = this.pg;
    },
    end:function(){
        var sp = new cc.Sprite("end.png");
        cc.director.getRunningScene().addChild(sp,5);
        sp.setPosition(160, cc.director.getVisibleSize().height/2);
        var hiscore = 169;

        var rand =  Math.random()*12454;
        var rank = 0|((hiscore - UI.score) * 34763  + rand);
        var percent = (UI.score *34763 + rand) / (hiscore*34763+rand);
        var lb = cc.LabelTTF.create("地球太危险我要回喵星！\n恭喜喵战胜了"+ UI.pg +"个汪，\n超越了"+(0|(percent*100))+"％的好友！\n获得了"+UI.score+"分！", "黑体", 20, cc.size(225,105), cc.TEXT_ALIGNMENT_LEFT);
        document.title = window.wxData.desc = "喵星刷屏！喵获得"+UI.score+"分，在众喵中排名"+(0|(percent*100))+"%，尼能超过喵吗！";
        document.title = window.wxFriend.desc = "我拿了"+UI.score+"分，战胜了"+ UI.pg +"个汪，超越了"+(0|(percent*100))+"％的好友！你能超过我吗";
            lb.strokeStyle = cc.color(0,0,0);
        lb.lineWidth = 2;
        sp.addChild(lb);
        lb.setPosition(sp.getContentSize().width/2+ 2, sp.getContentSize().height/2 -5);

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan:function(t,e){
                return true;
            },
            onTouchEnded:function(t,e){
                var pos = t.getLocation();
                var sh = cc.director.getVisibleSize().height;

                if(cc.rectContainsPoint(cc.rect(38,sh/2 - 128,116,41), pos))
                {
                    var share = new ShareUI();
                    cc.director.getRunningScene().addChild(share,15);
                }
                else if(cc.rectContainsPoint(cc.rect(167,sh/2 - 128,116,41), pos))
                {
                    e.getCurrentTarget().removeFromParent();
                    Manager.clear();
                    Manager.init(cc.director.getRunningScene());
                }
            },
            onTouchMoved:function(){
                return true;
            }
        },sp)
    }
};

var Manager = {
    gameTime:0,
    cat:null,
    aliveDogs:0,
    maxAliveDogs:8,
    clear:function(){
        for(var i = dogs.length-1; i >= 0; i--)
        {
            dogs[i].removeFromParent();
        }
        dogs = [];
        this.cat.idle();
        UI.scoreLabel.setString(0);
        UI.pgLabel.setString(0);
    },
    init:function(scene){
        UI.score = 0;
        UI.lastTime = 0;
        UI.multiplier = 0;
        UI.pg = 0;
        this.aliveDogs = 0;
        this.gameTime = Date.now();
        var size = cc.director.getVisibleSize();
        if(!this.cat)
        {
            this.cat = new Cat;
        }
        this.cat.attr({
            x:size.width/2,
            y:size.height/2
        });
        scene.addChild(this.cat, 1);

/*        for(var i = 0; i < 5; i++)
        {
            var d = new Doge(this.cat);
            d.hide();
            d.state = 4;
            scene.addChild(d);
            dogs.push(d);
        }
        for(var i = 0; i < 4; i++)
        {
            var d = new Husky(this.cat);
            d.hide();
            d.state = 4;
            scene.addChild(d);
            dogs.push(d);
        }*/
        scene.scheduleOnce(this.run, 1.5);
        this.addDogesBinded = this.addDogs.bind(this);
    },
    run:function(){
        var a = Doge.getFromPool();
        a.reset();
        var b = Doge.getFromPool();
        b.reset();
        this.aliveDogs = 2;
    },
    addDogs:function(){
        var num = 0|(Math.random()*2)+1;
        if(this.aliveDogs + num <= this.maxAliveDogs)
        {
            this.aliveDogs + num;
            //random dog type， from 10 seconds, husky chance to spawn, to 20 seconds, husky have 70% chance
            var elapsed = Date.now() - this.gameTime;
            var r = Math.random();
            var seed = r + (cc.clampf(20, 10, (elapsed/1000))-10)*0.07;
            if(seed > 0.7)
            {
                Husky.getFromPool().reset();
            }
            else
            {
                Doge.getFromPool().reset();
            }
            if(num === 2)
            {
                var r = Math.random();
                var seed = r + (cc.clampf(20, 10, (elapsed/1000))-10)*0.07;
                if(seed > 0.7)
                {
                    Husky.getFromPool().reset();
                }
                else
                {
                    Doge.getFromPool().reset();
                }
            }
        }
    }
};
var Doge = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    rotRate:25,
    rotLeft:true,
    target:null,
    attackDist:80,
    attackDelay:1.5,
    left:true,
    alive:true,
    type:0,
    avail:false,
    ctor:function(target){
        this._super("catnorrisd.png", cc.rect(188,58,66,42));
        this.attr({
            anchorX:0.5,
            anchorY:0,
            target:target
        });
        this.scheduleUpdate();
        //this.state = 1;
        this.walk();
    },
    reset:function(){
        //this.left = true;
        this.alive = true;
        this.avail = false;
        this.x = Math.random() * 320;
        this.y =  (cc.director.getVisibleSize().height - 70)*Math.random() + 20;
        this.state = 1;
        this.setVisible(true);
    },
    walk:function(){
        this.stopAllActions();
        this.state = 1;
        this.setTextureRect(cc.rect(196,2,52,42));
        this.runAction(cc.sequence(cc.rotateTo(0.12, -3), cc.rotateTo(0.12,3)).repeatForever());
    },
    charge:function(){
        this.stopAllActions();
        this.state = 0;
        this.setTextureRect(cc.rect(188,58,66,42));
        this.runAction(cc.sequence(cc.scaleTo(0.15, 1, 0.92), cc.scaleTo(0.15,1,1)).repeatForever());
        this.scheduleOnce(
            this.attack,
        this.attackDelay);
        this.rotation = 0;
    },
    attack:function(){
        this.stopAllActions();
        this.state = 2;
        this.setTextureRect(cc.rect(122,58,64,42));
        //calculate attack angle
        var attackAngle = cc.pToAngle(cc.pSub(this.target.getPosition(), this.getPosition()));
        var pos = cc.pRotateByAngle(cc.p(this.attackDist,0), cc.p(0,0), attackAngle);
        this.runAction(
            cc.sequence(
                cc.callFunc(function(){
                    var tp = this.target.getPosition();
                    if(tp.x > this.x && this.left === true)
                    {
                        this.left = false;
                        this.setFlippedX(true);
                    }
                    else if(tp.x < this.x && this.left === false)
                    {
                        this.left = true;
                        this.setFlippedX(false);
                    }
                },this),
                cc.moveBy(0.5, pos).easing(cc.easeExponentialOut()),
                cc.callFunc(function(){this.walk();},this)
            ));
    },
    dead:function(){
        this.stopAllActions();
        this.state = 4;
        this.setTextureRect(cc.rect(2,102,70,30));
        this.scheduleOnce(this.fadeOut, 1.25);
    },
    fadeOut:function(){
        this.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(function(){dogs.splice(dogs.indexOf(this),1)}, this),
            cc.removeSelf()
        ));
    },
    hide:function(){
        this.setVisible(false);
        this.avail = true;
    },
    hurt:function(){
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        this.state = 3;
        this.setTextureRect(cc.rect(58,58,62,42));
        this.alive = false;
        this.scheduleOnce(this.dead,0.5);
        UI.addScore(1);
        //this.parent.scheduleOnce(Manager.addDogesBinded, Math.random()*2);
        setTimeout(Manager.addDogesBinded, Math.random()*2000+500);
    },
    update:function(dt){
        if(this.state === 1)
        {
            var tp = this.target.getPosition();
            var mp = this.getPosition();
            var walkangle = cc.pToAngle(cc.pSub(tp, mp));
            var pos = cc.pRotateByAngle(cc.p(35*dt,0), cc.p(0,0), walkangle);
            this.setPosition(this.x + pos.x, this.y + pos.y);
            if(tp.x > this.x && this.left === true)
            {
                this.left = false;
                this.setFlippedX(true);
            }
            else if(tp.x < this.x && this.left === false)
            {
                this.left = true;
                this.setFlippedX(false);
            }
            if(cc.pDistance(tp,mp) < this.attackDist)
            {
                this.charge();
            }
            this.zIndex = -this.y;
        }
        else if(this.state === 2 && cc.pDistance(this.target.getPosition(),this.getPosition()) < COLSIZE && this.target.state < 2)
        {
            this.target.hurt();
        }
    }
});
Doge.getFromPool= function(){
/*    for(var i=0; i < dogs.length; i++)
    {
        var d = dogs[i];
        if(d.avail && d.type === 0)
        {
            d.avail= false;
            return d;
        }
    }*/
    var d = new Doge(Manager.cat);
    cc.director.getRunningScene().addChild(d);
    d.reset();
    dogs.push(d);
    return d;
};

var Husky = cc.Sprite.extend({
    state:1,//0 charging, 1 walking, 2 attacking 3 dieing, 4 dead
    rotRate:25,
    rotLeft:true,
    target:null,
    attackDist:120,
    attackDelay:1.5,
    left:true,
    alive:true,
    type:1,
    avail:false,
    ctor:function(target){
        this._super("catnorrisd.png", cc.rect(188,58,66,42));
        this.attr({
            anchorX:0.5,
            anchorY:0,
            target:target
        });
        this.scheduleUpdate();
        //this.state = 1;
        this.walk();
    },
    reset:function(){
        this.left = true;
        this.alive = true;
        this.avail = false;
        this.x = Math.random() * 320;
        this.y =  (cc.director.getVisibleSize().height - 70)*Math.random() + 20;
        this.state = 1;
        this.setVisible(true);
    },
    walk:function(){
        this.stopAllActions();
        this.state = 1;
        this.setTextureRect(cc.rect(74,102,56,44));
        this.runAction(cc.sequence(cc.rotateTo(0.12, -3), cc.rotateTo(0.12,3)).repeatForever());
    },
    charge:function(){
        this.stopAllActions();
        this.state = 0;
        this.setTextureRect(cc.rect(144,148,70,32));
        this.runAction(cc.sequence(cc.scaleTo(0.15, 1, 0.92), cc.scaleTo(0.15,1,1)).repeatForever());
        this.scheduleOnce(
            this.attack,
        this.attackDelay);
        this.rotation = 0;
    },
    attack:function(){
        this.stopAllActions();
        this.state = 2;
        this.setTextureRect(cc.rect(2,148,68,42));
        //calculate attack angle
        var attackAngle = cc.pToAngle(cc.pSub(this.target.getPosition(), this.getPosition()));
        var pos = cc.pRotateByAngle(cc.p(this.attackDist,0), cc.p(0,0), attackAngle);
        this.runAction(
            cc.sequence(
                cc.callFunc(function(){
                    var tp = this.target.getPosition();
                    if(tp.x > this.x && this.left === true)
                    {
                        this.left = false;
                        this.setFlippedX(true);
                    }
                    else if(tp.x < this.x && this.left === false)
                    {
                        this.left = true;
                        this.setFlippedX(false);
                    }
                },this),
                cc.moveBy(0.5, pos).easing(cc.easeExponentialOut()),
                cc.callFunc(function(){this.walk();},this)
            ));
    },
    dead:function(){
        this.stopAllActions();
        this.state = 4;
        this.setTextureRect(cc.rect(72,148,70,32));
        this.scheduleOnce(this.fadeOut, 1.25);
    },
    fadeOut:function(){
        this.runAction(cc.sequence(
            cc.fadeOut(0.5),
            cc.callFunc(function(){dogs.splice(dogs.indexOf(this),1)}, this),
            cc.removeSelf()
        ));
    },
    hide:function(){
        this.setVisible(false);
        this.avail = true;
    },
    hurt:function(){
        this.stopAllActions();
        this.unscheduleAllCallbacks();
        this.state = 3;
        this.setTextureRect(cc.rect(184,102,58,40));
        this.alive = false;
        this.scheduleOnce(this.dead,0.5);
        UI.addScore(3);
        setTimeout(Manager.addDogesBinded, Math.random()*2000+500);
    },
    update:function(dt){
        if(this.state === 1)
        {
            var tp = this.target.getPosition();
            var mp = this.getPosition();
            var walkangle = cc.pToAngle(cc.pSub(tp, mp));
            var pos = cc.pRotateByAngle(cc.p(35*dt,0), cc.p(0,0), walkangle);
            this.setPosition(this.x + pos.x, this.y + pos.y);
            if(tp.x > this.x && this.left === true)
            {
                this.left = false;
                this.setFlippedX(true);
            }
            else if(tp.x < this.x && this.left === false)
            {
                this.left = true;
                this.setFlippedX(false);
            }
            if(cc.pDistance(tp,mp) < this.attackDist)
            {
                this.charge();
            }
            this.zIndex = -this.y;
        }
        else if(this.state === 2 && cc.pDistance(this.target.getPosition(),this.getPosition()) < COLSIZE && this.target.state < 3)
        {
            this.target.hurt();
        }
    }
});
Husky.getFromPool= function(){
    /*    for(var i=0; i < dogs.length; i++)
     {
     var d = dogs[i];
     if(d.avail && d.type === 0)
     {
     d.avail= false;
     return d;
     }
     }*/
    var d = new Husky(Manager.cat);
    cc.director.getRunningScene().addChild(d);
    d.reset();
    dogs.push(d);
    return d;
};


var mStartPiece ;
//小块图片
var PieceSprite = cc.Sprite.extend({
	
	id:0,
    _touchBegan: false,
    _touchEnabled: true,
	
	beginX:0,
	beginY:0,
	
	
    ctor: function (image,id) {
		this._super();
		this.init(image);
		this.id=id;
    },
	

    onEnter: function () {
        //cc.Director.getInstance().getTouchDispatcher()._addTargetedDelegate(this, 0); 
        this._super();
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			swallowTouches: true,
			onTouchBegan: this.onTouchBegan,
			//onTouchMoved: this.onTouchMoved,
			onTouchEnded: this.onTouchEnded
			//onTouchCancelled: this.onTouchCancelled
		}, this);

    },

    onExit: function () {
        //cc.Director.getInstance().getTouchDispatcher()._removeDelegate(this);
          //当Sprite退出后，取消点击事件的注册。
        this._touchEnabled = false;
        this._super();
    },
    onTouchBegan: function (touch, event) {
		//console.log(touch.getLocation());
		//console.log(this);
        if (cc.rectContainsPoint(this._node._getBoundingBoxToCurrentNode(), touch.getLocation())) {
            //当点击在 Sprite 范围内时，执行。
            //在这里处理点击事件。
            this._touchBegan = true;
			
			this.beginX= touch._prevPoint.x;
			
			this.beginY= touch._prevPoint.y;
			
			
            return true; //返回true， 才会执行 onTouchEnded方法。
        }
        return false;
    },

    onTouchEnded: function (touch, event) {
	
		
		
		if (touch._point.x - this.beginX > 50) {  
			//this.rightCombineNumber(); 
			console.log("right");
			//alert("right");
			doAction("right",this._node.id);
		}  
  
		else if (touch._point.x - this.beginX < -50) {  
			//this.leftCombineNumber();  
			console.log("left");
			//alert("left");
			doAction("left",this._node.id);
		}  
  
		else if (touch._point.y - this.beginY > 50) {  
			//this.upCombineNumber();  
			console.log("up");
			//alert("up");
			doAction("up",this._node.id);
		}  
  
		else if (touch._point.y - this.beginY < -50) {  
			
			console.log("down");
			//alert("down");
			doAction("down",this._node.id);
		}  
		
        if (this._touchBegan) {
            this._touchBegan = false;
        }
    }
});

	

var score = 0;
var person_dead=null;
var person=null;
var MyScene = cc.Scene.extend({
    cat:null,
    touchbeginpos:null,
    onEnter:function () {
        this._super();
        var size = cc.director.getWinSize();

        //Manager.init(this);

        var scoreLabel =  new cc.LabelTTF("0", "黑体", 24, cc.size(150, 30), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(scoreLabel);
        scoreLabel.attr({
            x:30,
            y:cc.director.getVisibleSize().height - 25,
            strokeStyle: cc.color(0,0,0),
            lineWidth: 2,
            color: cc.color(255,150,100),
            anchorX:0.1
        });
		/*
        var pg = new cc.Sprite("pg.png");
        this.addChild(pg);
        pg.attr({
            x:230,
            y:cc.director.getVisibleSize().height - 25
        });
		*/

		/*
        UI.pgLabel = new cc.LabelTTF("0", "黑体", 20, cc.size(80, 30), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(UI.pgLabel);
        UI.pgLabel.attr({
            x:290,
            y:cc.director.getVisibleSize().height - 30,
            strokeStyle: cc.color(0,0,0),
            lineWidth: 2,
            anchorX:0.1
        });
		*/
		
		var BgLayer = new BackgroundLayer();
		
		
		this.addChild(BgLayer);
		
		
		var playLayer = new PlayLayer();
		
		this.addChild(playLayer);

		
		
		
		

        cc.eventManager.addListener({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchMoved:function(touch, event){
				console.log(event.target);
				/*
                var cat = Manager.cat;
                if(cat.state >= 2)
                return false;
                cat.touchtime = Date.now();
                cat.targetPos = touch.getLocation();
                event.getCurrentTarget().touchbeginpos = touch.getLocation();
                return true;
				*/
				//return true;
				//console.log(touch.getLocation());
				//sight.x=touch.getLocation().x+(sight.width)/2;
				//sight.y=touch.getLocation().y+(sight.height)/2;
            },
            onTouchEnded:function(touch, event)
            {
				/*
                var cat = Manager.cat;
                cat.targetPos = touch.getLocation();
                if(cc.pDistance(cat.targetPos, event.getCurrentTarget().touchbeginpos)> 50)
                {
                    cat.walk();
                }
                if(cat.state < 2 && touch.getLocationX() > cat.x)
                {
                    cat.left = false;
                    cat.setFlippedX(true);
                }
                else
                {
                    cat.left = true;
                    cat.setFlippedX(false);
                }
				*/
				//alert('shoot');
				//console.log(touch.getLocation());
				/*
				var shootPosition = touch.getLocation();
				console.log(cc.pDistance(shootPosition, person.getPosition()));
				if(cc.pDistance(shootPosition, person.getPosition())< 50){
					person.setVisible(false);
					person_dead.setVisible(true);
					setTimeout("createAnother()",1000);
					score++;
					scoreLabel.setString(""+score);
					
					
				}
				*/
				
				
            },
            onTouchBegan:function(touch, event)
            {
				return true;
				/*
                var cat = Manager.cat;
                if(cat.state !== 4)
                {
                    if(Date.now() - cat.touchtime < TOUCHDELAY)
                    {
                        cat.attack();
                    }
                    else{
                        cat.idle();
                    }
                    if(touch.getLocationX() > cat.x)
                    {   
                        cat.left = false;
                        cat.setFlippedX(true);
                    }
                    else
                    {
                        cat.left = true;
                        cat.setFlippedX(false);
                    }
                }
                cat.touchtime = Infinity;
				*/
				//alert('up');
            }
        },this);

    }
});


//背景图
var BackgroundLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
 
    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();
 
        //create the background image and position it at the center of screen
        var centerPos = cc.p(winsize.width / 2, winsize.height / 2);
        var spriteBG = new cc.Sprite("res/bg.png");
		//console.log(spriteBG);
        spriteBG.setPosition(centerPos);
        this.addChild(spriteBG);
    }
});






//人物图
var PlayLayer = cc.Layer.extend({
    ctor:function () {
        this._super();
        this.init();
    },
 
    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();
		
		
		var picWidth=111;
		var picHeight=111;
		
		
		mPositionArray[0]=[];
		var i=1;
		for(;i<=3;i++){
			
			var centerPos = cc.p(picWidth/2+(i-1)*picWidth, picHeight/2+picHeight*2);
			//console.log(centerPos);
			var pic = new PieceSprite("res/"+i+".png",i);
			
			//console.log("PieceSprite="+pic._rect.y);
			
			//var pic = new cc.Sprite("res/"+i+".png");
			
			//console.log("cc.Sprite="+pic);
			
			//console.log(pic);
			
			
			
			mPositionArray[0][i-1]=i;
			
			mPieceArray[i]=pic;
			
			pic.setPosition(centerPos);
			this.addChild(pic);
			
		}
		
		mPositionArray[1]=[];
		for(;i<=6;i++){
			
			var centerPos = cc.p(picWidth/2+(i-4)*picWidth, picHeight/2+picHeight);
			var pic = new PieceSprite("res/"+i+".png",i);
			
			
			
			mPositionArray[1][i-4]=i;
			
			mPieceArray[i]=pic;
			
			pic.setPosition(centerPos);
			this.addChild(pic);
			
		}
		
		mPositionArray[2]=[];
		for(;i<=9;i++){
			
			var centerPos = cc.p(picWidth/2+(i-7)*picWidth, picHeight/2);
			var pic = new PieceSprite("res/"+i+".png",i);
			
			
			
			mPositionArray[2][i-7]=i;
			
			mPieceArray[i]=pic;
			
			pic.setPosition(centerPos);
			this.addChild(pic);
			
		}
		
		var i=0;
		while(i<50){
			initRandomPosition();
			i++;
		}
		
		
		
    }
});



function getPosition(id){
	var i=0;
	var j=0;
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			if(mPositionArray[i][j]==id){
				return i+","+j;
			}
		}
	}
}

function findLeftPiece(i,j){
	
	return mPositionArray[i][j-1];
	
}

function findRightPiece(i,j){
	
	return mPositionArray[i][parseInt(j)+1];
	
}

function findUpPiece(i,j){
	
	return mPositionArray[i-1][j];
	
}
function findDownPiece(i,j){
	
	return mPositionArray[parseInt(i)+1][j];
	
}

function changPiece(startPieceId,endPieceId){
	
	var startPiece=mPieceArray[startPieceId];
	var endPiece = mPieceArray[endPieceId];
		
	var pos = startPiece.getPosition();
	
	startPiece.setPosition(endPiece.getPosition());
	endPiece.setPosition(pos);
	

	
	var startCoordinate = getPosition(startPieceId);
	
	var endCoordinate = getPosition(endPieceId);
	
	var startCoordinateArray = startCoordinate.split(",");
	var endCoordinateArray = endCoordinate.split(",");
	
	
	mPositionArray[startCoordinateArray[0]][startCoordinateArray[1]]=endPieceId;
	
	mPositionArray[endCoordinateArray[0]][endCoordinateArray[1]]=startPieceId;

}


function doAction(direction,startPieceId){
	var posStr = getPosition(startPieceId);
	var posArray = posStr.split(",");
	//console.log(posArray);
	
	//console.log(startPieceId);
	
	//起始点为空白
	if(startPieceId==9){
		
		switch(direction){
		
			case "left":
				
				var tempId = findLeftPiece(posArray[0],posArray[1]);
				
				if(tempId){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "right":
				
				var tempId = findRightPiece(posArray[0],posArray[1]);
				
				console.log(tempId);
				
				if(tempId){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "up":
				
				var tempId = findUpPiece(posArray[0],posArray[1]);
				
				if(tempId){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "down":
				
				var tempId = findDownPiece(posArray[0],posArray[1]);
				
				if(tempId){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
		
			
			default:
				break;
		}
		
	}
	//起始点为其他方块
	else{
		
		switch(direction){
		
			case "left":
				
				var tempId = findLeftPiece(posArray[0],posArray[1]);
				
				if(tempId && tempId==9){
					changPiece(startPieceId,tempId);
					mMoveNum++;
					
				}
				
				break;
				
			case "right":
				
				var tempId = findRightPiece(posArray[0],posArray[1]);
				
				console.log(tempId);
				
				if(tempId && tempId==9){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "up":
				
				var tempId = findUpPiece(posArray[0],posArray[1]);
				
				if(tempId && tempId==9){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "down":
				
				var tempId = findDownPiece(posArray[0],posArray[1]);
				
				if(tempId && tempId==9){
					changPiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
		
			
			default:
				break;
		}
		
	
	}
	
	if(checkResult()){
		
		setTimeout("alert('恭喜您只用了"+mMoveNum+"步完成拼图,击败了全国99%的玩家,请再来一次吧');reset();",1000);
		
	}
	
	
	
	
}


function reset(){
	mChangedPieceIds=[];
	mMoveNum=0;
	
	mPositionArray = [];

	mPieceArray=[];
	
	cc.game.onStart = function(){
		cc.view.adjustViewPort(true);
		
		if (cc.sys.isMobile){
			cc.view.setDesignResolutionSize(333,333,cc.ResolutionPolicy.SHOW_ALL);
		}
		else{
			cc.view.setDesignResolutionSize(333,333,cc.ResolutionPolicy.SHOW_ALL);
		}
        cc.view.resizeWithBrowserSize(true);
    
		
        //cc.view.setDesignResolutionSize(320,500,cc.ResolutionPolicy.FIXED_WIDTH);
        cc._renderContext.webkitImageSmoothingEnabled = false;
        cc._renderContext.mozImageSmoothingEnabled = false;
        cc._renderContext.imageSmoothingEnabled = false; //future
        cc._renderContext.fillStyle="#afdc4b";
        //load resources
        cc.LoaderScene.preload(mResource, function () {
            cc.director.runScene(new MyScene());

        }, this);
    };
    cc.game.run("gameCanvas");
	
}
   
   
function checkResult(){
	
	var id=1;
	var i=0;
	var j=0;
	for(i=0;i<3;i++){
		for(j=0;j<3;j++){
			if(mPositionArray[i][j]!=id){
				return false;
			}
			id++;
		}
	}
	
	return true;
	
}

var mChangedPieceIds=[];

var mMoveNum=0;

function findAdjoinPieces(id){
	
	var adjoinPieces = [];
	
	var posArray = getPosition(id).split(",");
	
	
	if(mPositionArray[parseInt(posArray[0])-1]){
		var upPieceId = mPositionArray[parseInt(posArray[0])-1][posArray[1]];
		if(upPieceId){
			adjoinPieces.push(mPieceArray[upPieceId]);
		}
		
	}
	
	
	if(mPositionArray[parseInt(posArray[0])+1]){
		var downPieceId = mPositionArray[parseInt(posArray[0])+1][posArray[1]];
		if(downPieceId){
			adjoinPieces.push(mPieceArray[downPieceId]);
		}
	}
	
	
	
	var rightPieceId = mPositionArray[posArray[0]][parseInt(posArray[1])+1];
	
	if(rightPieceId){
		adjoinPieces.push(mPieceArray[rightPieceId]);
	}
	
	var leftPieceId = mPositionArray[posArray[0]][parseInt(posArray[1])-1];
	
	if(leftPieceId){
		adjoinPieces.push(mPieceArray[leftPieceId]);
	}
	
	return adjoinPieces;
	

}

function isInArray(id,arr){
	
	for(var val in arr){
		if(id==val)
			return true;
	}
	
	return false;
	
}


function initRandomPosition(){
	
	var pieces = findAdjoinPieces(9);
	
	var len = pieces.length;
	
	var index = parseInt((Math.random()*len));
	
	var randomPiece = pieces[index];
	
	
	if(isInArray(randomPiece.id,mChangedPieceIds)){
		return;
	}
	
	changPiece(9,randomPiece.id);
	
	mChangedPieceIds.push(randomPiece.id);
	
	
}


function createAnother(){
	person_dead.setVisible(false);
	var randx = Math.random();
	var randy = Math.random();
	person.x = cc.winSize.width-randx*cc.winSize.width;
	person.y = cc.winSize.height-randy*cc.winSize.height;
	person_dead.x = cc.winSize.width-randx*cc.winSize.width;
	person_dead.y = cc.winSize.height-randy*cc.winSize.height;
	person.setVisible(true);
	

}


window.onload = function(){
    cc.game.onStart = function(){
		cc.view.adjustViewPort(true);
		
		if (cc.sys.isMobile){
			cc.view.setDesignResolutionSize(333,333,cc.ResolutionPolicy.SHOW_ALL);
		}
		else{
			cc.view.setDesignResolutionSize(333,333,cc.ResolutionPolicy.SHOW_ALL);
		}
        cc.view.resizeWithBrowserSize(true);
    
		
        //cc.view.setDesignResolutionSize(320,500,cc.ResolutionPolicy.FIXED_WIDTH);
        cc._renderContext.webkitImageSmoothingEnabled = false;
        cc._renderContext.mozImageSmoothingEnabled = false;
        cc._renderContext.imageSmoothingEnabled = false; //future
        cc._renderContext.fillStyle="#afdc4b";
        //load resources
        cc.LoaderScene.preload(mResource, function () {
            cc.director.runScene(new MyScene());

        }, this);
    };
    cc.game.run("gameCanvas");
};

var ShareUI = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

        var arrow = new cc.Sprite("arrow.png");
        arrow.anchorX = 1;
        arrow.anchorY = 1;
        arrow.x = cc.winSize.width - 15;
        arrow.y = cc.winSize.height - 5;
        this.addChild(arrow);

        var label = new cc.LabelTTF("请点击右上角的菜单按钮\n然后\"分享到朋友圈\"\n测测好友的手指灵活度吧", "宋体", 18, cc.size(cc.winSize.width*0.7, 250), cc.TEXT_ALIGNMENT_CENTER);
        label.x = cc.winSize.width/2;
        label.y = cc.winSize.height - 100;
        label.anchorY = 1;
        label.shadowColor = cc.color(255,255,255);
        label.shadowBlur = 50;
        this.addChild(label);
    },
    onEnter: function () {
        this._super();
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            onTouchBegan: function (touch, event) {
                return true;
            },
            onTouchEnded:function(t, event){
                event.getCurrentTarget().removeFromParent();
            }
        }, this);
    }
});