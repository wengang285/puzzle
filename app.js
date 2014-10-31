var mResource= ["http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/bg.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/1.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/2.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/3.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/4.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/5.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/6.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/7.png","http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/8.png"];


var mPositionArray = [];

var mPieceArray=[];


var mLevel=1;


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
			//console.log("right");
			//alert("right");
			doAction("right",this._node.id);
		}  
  
		else if (touch._point.x - this.beginX < -50) {  
			//this.leftCombineNumber();  
			//console.log("left");
			//alert("left");
			doAction("left",this._node.id);
		}  
  
		else if (touch._point.y - this.beginY > 50) {  
			//this.upCombineNumber();  
			//console.log("up");
			//alert("up");
			doAction("up",this._node.id);
		}  
  
		else if (touch._point.y - this.beginY < -50) {  
			
			//console.log("down");
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
				//console.log(event.target);
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


        if(mTimeLayer==null){
            mTimeLayer = new TimeLayer();
        }
        mTimeLayer.setLabel(60);
        this.addChild(mTimeLayer);
        if(mTimeLayer.isRunning==false){
            mTimeLayer.run();
        }


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
        var spriteBG = new cc.Sprite("http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/bg.png");
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
			var pic = new PieceSprite("http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/"+i+".png",i);
			
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
			var pic = new PieceSprite("http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/"+i+".png",i);
			
			
			
			mPositionArray[1][i-4]=i;
			
			mPieceArray[i]=pic;
			
			pic.setPosition(centerPos);
			this.addChild(pic);
			
		}
		
		mPositionArray[2]=[];
		for(;i<=9;i++){
			
			var centerPos = cc.p(picWidth/2+(i-7)*picWidth, picHeight/2);
			var pic = new PieceSprite("http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/"+i+".png",i);
			
			
			
			mPositionArray[2][i-7]=i;
			
			mPieceArray[i]=pic;
			
			pic.setPosition(centerPos);
			this.addChild(pic);
			
		}


        var i=0;
        while(i<mLevel){
            //initRandomPosition();
            setTimeout("initRandomPosition();",150*i);
            i++;
        }

    }
});

//计时器

var mTimeLayer=null;
var TimeLayer = cc.Layer.extend({
    timeLabel:null,
    isRunning:false,
    ctor:function () {
        this._super();
        this.init();
    },

    init:function () {
        this._super();
        var winsize = cc.director.getWinSize();

        this.timeLabel = new cc.LabelTTF("00:60", "黑体", 20, cc.size(80, 30), cc.TEXT_ALIGNMENT_LEFT);
        this.addChild(this.timeLabel);
        this.timeLabel.attr({
            x:30,
            y:cc.director.getVisibleSize().height - 30,
            strokeStyle: cc.color(0,0,0),
            lineWidth: 2,
            anchorX:0.1
        });
    },
    getLabel:function(){
       return this.timeLabel.getString().split(":")[1];
    },
    setLabel:function(labelStr){
        this.timeLabel.setString("00:"+labelStr);
    },

    run:function(){
        //setTimeout("beginTime()",1000);
        this.setLabel(60);
        beginTime();
        this.isRunning=true;
    }

});


function beginTime(){

    var curretTime = parseInt(mTimeLayer.getLabel());

    if(curretTime>0){
        curretTime--;
        if(curretTime<10){
            curretTime="0"+curretTime;
        }
        mTimeLayer.setLabel(curretTime);
        setTimeout("beginTime()",1000);
    }
    else{
        showSuccessLabel();
    }



}


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

function changePiece(startPieceId,endPieceId){
	
	var startPiece=mPieceArray[startPieceId];
	var endPiece = mPieceArray[endPieceId];
		
	var pos = startPiece.getPosition();

    var action1 = cc.MoveTo.create(0.1,endPiece.getPosition());
    var action2 = cc.MoveTo.create(0.1,pos);

    startPiece.runAction(action1);
    endPiece.runAction(action2);
	
	//startPiece.setPosition(endPiece.getPosition());
	//endPiece.setPosition(pos);
	

	
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
	//c
	
	//console.log(startPieceId);
	
	//起始点为空白
	if(startPieceId==9){
		
		switch(direction){
		
			case "left":
				
				var tempId = findLeftPiece(posArray[0],posArray[1]);
				
				if(tempId){
					changePiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "right":
				
				var tempId = findRightPiece(posArray[0],posArray[1]);
				
				//console.log(tempId);
				
				if(tempId){
					changePiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "up":
				
				var tempId = findUpPiece(posArray[0],posArray[1]);
				
				if(tempId){
					changePiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "down":
				
				var tempId = findDownPiece(posArray[0],posArray[1]);
				
				if(tempId){
					changePiece(startPieceId,tempId);
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
					changePiece(startPieceId,tempId);
					mMoveNum++;
					
				}
				
				break;
				
			case "right":
				
				var tempId = findRightPiece(posArray[0],posArray[1]);
				
				//console.log(tempId);
				
				if(tempId && tempId==9){
					changePiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "up":
				
				var tempId = findUpPiece(posArray[0],posArray[1]);
				
				if(tempId && tempId==9){
					changePiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
				
			case "down":
				
				var tempId = findDownPiece(posArray[0],posArray[1]);
				
				if(tempId && tempId==9){
					changePiece(startPieceId,tempId);
					mMoveNum++;
				}
				
				break;
		
			
			default:
				break;
		}
		
	
	}
	
	if(checkResult()){


        //showSuccessLabel();
        mLevel++;
        //reset();
        showLevel();
		//setTimeout("reset();",1000);
		
	}
	
	
	
	
}


var mScene;

function showSuccessLabel(){
    //var rand =  Math.random()*12454;
    //var rank = 0|((mLevel - UI.score) * 34763  + rand);
    //var percent = (UI.score *34763 + rand) / (mLevel*34763+rand);
    //var lb = cc.LabelTTF.create("您总共只用了"+mMoveNum+"步完成"+mLevel+"关拼图,击败了全国99%的玩家,马上分享给好友吧", "黑体", 20, cc.size(225,105), cc.TEXT_ALIGNMENT_LEFT);
    document.title = window.wxData.desc = "我总共只用了"+mMoveNum+"步完成"+mLevel+"关拼图,击败了全国99%的玩家,你敢试试吗！";
    document.title = window.wxFriend.desc = "我总共只用了"+mMoveNum+"步完成"+mLevel+"关拼图,击败了全国99%的玩家,你敢试试吗！";
    //lb.strokeStyle = cc.color(0,0,0);
    //lb.lineWidth = 2;
    //mScene.addChild(lb);
    //lb.setPosition(mScene.getContentSize().width/2+ 2, mScene.getContentSize().height/2 -5);

    var shareUI = new ShareUI();

    mScene.addChild(shareUI);

}

function showLevel(){


    var winsize = cc.director.getWinSize();

    //create the background image and position it at the center of screen
    var centerPos = cc.p(winsize.width / 2, winsize.height / 2);

    var lb = cc.LabelTTF.create("LEVEL "+mLevel, "黑体", 20, cc.size(225,105), cc.TEXT_ALIGNMENT_CENTER);
    lb.strokeStyle = cc.color(0,0,0);
    lb.lineWidth = 2;
    mScene.addChild(lb);
    lb.setPosition(centerPos);
    setTimeout("reset();",1000);
}

function reset(){

	mChangedPieceIds=[];
	//mMoveNum=0;
	
	mPositionArray = [];

	mPieceArray=[];

    //mScene.preload();c

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
        mScene = new MyScene();
        cc.director.runScene(mScene);
        //load resources
        /*
        cc.LoaderScene.preload(mResource, function () {
            mScene = new MyScene();
            cc.director.runScene(mScene);

        }, this);
        */
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
		if(upPieceId && upPieceId!=mLastChangePieceId){
			adjoinPieces.push(mPieceArray[upPieceId]);
		}
		
	}
	
	
	if(mPositionArray[parseInt(posArray[0])+1]){
		var downPieceId = mPositionArray[parseInt(posArray[0])+1][posArray[1]];
		if(downPieceId && downPieceId!=mLastChangePieceId){
			adjoinPieces.push(mPieceArray[downPieceId]);
		}
	}
	
	
	
	var rightPieceId = mPositionArray[posArray[0]][parseInt(posArray[1])+1];
	
	if(rightPieceId && rightPieceId!=mLastChangePieceId){
		adjoinPieces.push(mPieceArray[rightPieceId]);
	}
	
	var leftPieceId = mPositionArray[posArray[0]][parseInt(posArray[1])-1];
	
	if(leftPieceId && leftPieceId!=mLastChangePieceId){
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

var mLastChangePieceId;

function initRandomPosition(){
	
	var pieces = findAdjoinPieces(9);
	
	var len = pieces.length;
	
	var index = Math.floor((Math.random()*len));
	
	var randomPiece = pieces[index];
	
	/*
	if(isInArray(randomPiece.id,mChangedPieceIds)){
		return;
	}
	*/

	changePiece(9,randomPiece.id);
    //console.log("changeNode="+randomPiece.id);

    mLastChangePieceId=randomPiece.id;
	
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
            mScene = new MyScene();
            cc.director.runScene(mScene);

        }, this);
    };
    cc.game.run("gameCanvas");
};

var ShareUI = cc.LayerColor.extend({
    ctor: function () {
        this._super(cc.color(0, 0, 0, 188), cc.winSize.width, cc.winSize.height);

        var arrow = new cc.Sprite("http://ossweb-img.qq.com/images/chanpin/zzlt/public/weixingame/arrow.png");
        arrow.anchorX = 1;
        arrow.anchorY = 1;
        arrow.x = cc.winSize.width - 15;
        arrow.y = cc.winSize.height - 5;
        this.addChild(arrow);

        var label = new cc.LabelTTF("您总共只用了"+mMoveNum+"步完成"+mLevel+"关拼图,击败了全国99%的玩家,马上分享给好友吧,请点击右上角的菜单按钮然后\"分享到朋友圈\"邀请好友一起来玩吧", "宋体", 18, cc.size(cc.winSize.width*0.7, 250), cc.TEXT_ALIGNMENT_CENTER);
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