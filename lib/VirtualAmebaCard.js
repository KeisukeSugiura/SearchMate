
/**
 * アメーバ（描画オブジェクト）
 * @param {[type]} option [description]
 */
 var AmebaCard = function(option){
 	//private
 	option = option === undefined ? {} : option;
	this.id = option.id === undefined ? generateRandomID() : option.id; 
	this.cardType = option.cardType === undefined ? "graphic" : option.cardType;
	this.weight = option.weight === undefined ? 1 : option.weight;
	this.name = option.name === undefined ? generateRandomID() : option.name;
	this.department = option.department === undefined ? {} : option.department;
	this.tags = option.tags === undefined ? [] : option.tags;
	//当たり判定
	this.collisionType = option.collisionType === undefined ? "rect" : option.collisionType;
	this.width = option.width === undefined ? 100 : option.width;
	this.height = option.height === undefined ? 100 : option.height;
	this.x = option.x === undefined ? generateRandomInt(0,1920) : option.x;
	this.y = option.y === undefined ? generateRandomInt(0,1080) : option.y;
	this.z = 0;
	//力学モデル
	this.vX = 0;
	this.vY = 0;
	this.aX = 0;
	this.aY = 0;
	this.fX = 0;
	this.fY = 0;
	this.lo_vX = 0;
	this.lo_vY = 0;
	this.lo_minX = 0;
	this.lo_minY = 0;
	this.lo_maxX = 0;
	this.lo_maxY = 0;
	this.lo_midX = 0;
	this.lo_midY = 0;
	this.lo_lenX = 0;
	this.lo_lenY = 0;

	this.circle=false;
	this.degree = 0;
	this.radious = 0;
	this.cx = 0;
	this.cy = 0;

	//プリレンダリング
	//テキスト
	this.text = option.text === undefined ? "honahona" : option.text;
	this.textSize = option.textSize === undefined ? "15px" : option.textSize;
	this.color = option.color === undefined ? "black" : option.color;
	this.textFont = option.textFont === undefined ? "Century Gothic" : option.textFont;
	//イメージ
	this.url = option.url === undefined ? "" : option.url;
	this.scale = option.scale === undefined ? 1.0 : option.scale;
	this.img = null;
	this.grobalAlpha = option.grobalAlpha === undefined ? 1.0 : option.grobalAlpha;
	//グラフィック
	this.graphicType = option.graphicType === undefined ? "rect" : option.graphicType;
	this.radious = option.radious === undefined ? 50 : option.radious;
	//this.preRender();
	//クリック箇所
	this.clickX = 0;
	this.clickY = 0;

	this.drawFlg = true;
	this.updateFlg = false;

	this.mouseenter = false;
	this.mouseover = false;
	
	this.datas = option.datas === undefined ? {} : option.datas;

	//イベント管理
	this.eventList = {
		mousedown:function(e,card){},
		mousemove:function(e,card){},
		mouseup:function(e,card){},
		mouseleave:function(e,card){},
		mouseout:function(e,card){},
		mouseenter:function(e,card){},
		mouseover:function(e,card){},
		click:function(e,card){},
		dblclick:function(e,card){},
		contextmenu:function(e,card){},
		show:function(e,card){}
	};
};
//static
AmebaCard.prototype.CLLISIONTYPE = ["rect","circle","free"]; //TODO freeをどうするか
AmebaCard.prototype.CARDTYPE = ["image","video","graphic","text","culster"];
AmebaCard.prototype.GRAPHICTYPE = ["rect","circle"];
AmebaCard.prototype.MOUSEEVENTTYPE = ["click","mousedown","mousemove","mouseup","dblclick","mouseover","mouseenter","mouseleave","mouseout","show","contextmenu"];
AmebaCard.prototype.getId = function(){
	return this.id;
};
AmebaCard.prototype.getPosition = function(){
	return {x:this.x,y:this.y};
};
AmebaCard.prototype.getName = function(){
	return this.name;
};
AmebaCard.prototype.getTags = function(){
	return this.tags;
};
AmebaCard.prototype.setId = function(id){
	this.id = id;
};
AmebaCard.prototype.setPosition = function(x,y){
	var self= this;
	this.x = x;
	this.y = y;
	//console.log("setPosition");
	self.updateNotification();

};
AmebaCard.prototype.setName = function(name){
	this.name = name;
};
AmebaCard.prototype.setDepartment = function(department){
	this.department = department;
};
AmebaCard.prototype.setWeight = function(weight){
	this.weight = weight;
	this.updateNotification();

};
AmebaCard.prototype.addTag = function(tag){
	this.tags.push(tag);
};

AmebaCard.prototype.clearTag = function(){
	this.tags = [];
};
AmebaCard.prototype.deleteTag = function(tag){
	var index = this.tag.indexOf(tag);
	if(index !== -1){
		this.tags.splice(index,1);
	}else{

	}
};
AmebaCard.prototype.hasTag = function(tag){
  var search = this.tags.indexOf(tag);
  if(search == -1) {    
    return false;
  } else {
    return true;
  }
};
AmebaCard.prototype.beHeavy = function(plus){
	var addWeight = plus === undefined ? 1 : plus;
	this.weight += addWeight;
	this.updateNotification();

};
AmebaCard.prototype.beLight = function(minus){
	var minusWeight = minus === undefined ? 1 : minus;
	this.weight -= minusWeight;
	if(this.weight < 1){
		this.weight = 1;
	}
	this.updateNotification();

};
AmebaCard.prototype.setColor = function(color){
	this.color = color;
	this.preRender();
	this.updateNotification();

};
AmebaCard.prototype.setSize = function(width,height){
	this.width = width;
	this.height = height;
	this.canvas.width = width;
	this.canvas.height = height;
	this.preRender();
	this.updateNotification();

};
AmebaCard.prototype.preRender = function(){
	switch(this.cardType){
		case "image" :
			this.preRenderCanvas = this.renderImage();
		break;
		case "video" :
			this.preRenderCanvas = this.renderVideo();
		break;
		case "graphic" :
			this.preRenderCanvas = this.renderGraphic();
		break;
		case "text" :
			this.preRenderCanvas = this.renderText();
			break;
		break;
		case "cluster" :
			this.preRenderCanvas = this.renderCluster();
			break;
		default :
			this.preRenderCanvas = this.renderGraphic();
		break;
	}
};

AmebaCard.prototype.renderCluster = function(){
	//this.graphicType="circle";
	//this.collisionType="circle";
	this.weight = -10000;
	return this.renderText();
};

AmebaCard.prototype.renderImage = function(){
	var self = this;
	var canvas = document.createElement("canvas");

	if(self.img == null){
		var image = new Image();
		canvas.style.position="absolute";
		image.onload = function(e){
			canvas.width = image.width*self.scale;
			canvas.height = image.height*self.scale;
			self.width = image.width*self.scale;
			self.height = image.height*self.scale;
			self.img = image;
			var context = canvas.getContext("2d");
			context.globalAlpha = self.grobalAlpha;
			context.drawImage(image,0,0,image.width,image.height,0,0,canvas.width,canvas.height);
		};
		image.onerror = function(e) {
	     	console.log('not found image on '+this.url);
		};
		image.src = this.url;	
	}else{
		canvas.width = self.width;
		canvas.height = self.height;
		var context = canvas.getContext("2d");
			context.globalAlpha = self.grobalAlpha;

		context.drawImage(self.img,0,0,self.img.width,self.img.height,0,0,canvas.width,canvas.height);
	}
	return canvas;

};
AmebaCard.prototype.renderGraphic = function(){
	var canvas = document.createElement("canvas");
	canvas.style.position="absolute";
	switch(this.graphicType){
		case "rect" :
		canvas.width = this.width;
		canvas.height = this.height;
		var context = canvas.getContext("2d");
		context.save();	
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		context.strokeRect(0,0,this.width,this.height);
		context.fillRect(0,0,this.width,this.height);
		break;
		case "circle" :
		canvas.width = this.radious*2+2;
		canvas.height = this.radious*2+2;
		this.width = this.radious*2;
		this.height = this.radious*2;
		this.collisionType = "circle";
		var context = canvas.getContext("2d");
		context.save();	
		context.strokeStyle = this.color;
		context.fillStyle = this.color;
		context.arc(this.radious+1,this.radious+1,this.radious,0,Math.PI*2,true);
		context.stroke();
		context.fill();
		break;
		default :
		break;
	}
	context.restore();
	return canvas;
};


AmebaCard.prototype.renderText = function(){
	var canvas = document.createElement("canvas");
	canvas.style.position="absolute";
	canvas.style.left = this.x;
	canvas.style.top = this.y;
	canvas.width = parseInt(this.textSize)*this.text.length;
	canvas.height = parseInt(this.textSize);
	this.width = canvas.width;
	this.height = canvas.height;
	var context = canvas.getContext("2d");
	context.save();
	context.strokeStyle = this.color;
	context.fillStyle = this.color;
	context.font = this.textSize + " " + this.textFont;
	context.strokeText(this.text,0,parseInt(this.textSize)*0.75, parseInt(this.textSize)*this.text.length);
	context.fillText(this.text,0,parseInt(this.textSize)*0.75, parseInt(this.textSize)*this.text.length);
	//console.log(context.font);
	context.restore();
	return canvas;
};
AmebaCard.prototype.renderVideo = function(){
	var canvas = document.createElement("canvas");
	//TODO
	return canvas;
};
AmebaCard.prototype.isCollision = function(x,y,s1,s2){
	switch(this.collisionType){
		case "rect" :
			return this.isRectCollision(x,y,s1,s2);
		break;
		case "circle" :
			return this.isCircleCollision(x,y,s1);
		break;
		default :
			return false;
		break;
	}

};

AmebaCard.prototype.isRectCollision = function(x,y,width,height){
	//四角どうし
	width = width === undefined ? 0 : width;
	height = height === undefined ? 0 : height;
	if(Math.abs((this.x+this.width/2) - (x+width/2)) <= this.width/2 + width/2 && Math.abs((this.y+this.height/2) - (y+height/2)) <= this.height/2 + height/2){
		return true;
	}else{
		return false;
	}
};
AmebaCard.prototype.isCircleCollision = function(x,y,radious){
	//x,yは左上の座標
	//円どうし
	radious = radious === undefined ? 0 :radious;
	if(Math.sqrt(Math.pow(x+radious-this.x-this.radious,2)+Math.pow(y+radious-this.y-this.radious,2)) <= this.radious + radious){
		return true;
	}else{
		return false;
	}
};

AmebaCard.prototype.relativeClick = function(ex,ey){
	this.clickX = ex - this.x;
	this.clickY = ey - this.y;
};
AmebaCard.prototype.clearRelativeClick = function(){
	this.clickX = null;
	this.clickY = null;
};
AmebaCard.prototype.moveTo = function(nx,ny){
	console.log(String(this.x)+" , "+String(this.y));

	this.x = nx - this.clickX;
	this.y = ny - this.clickY;

	//canvas領域衝突判定
	var sw = this.department.width;
	var sh = this.department.height;
	var sx = this.department.x;
	var sy = this.department.y;


	if(this.x < 0){this.x = 0;}

	if(this.x+this.width > sw){this.x = sw -this.width;}

	if(this.y < 0){this.y = 0;}

	if(this.y+this.height > sh){this.y = sh - this.height;}

	// if(this.x < sx){
	// 	this.x = sx;
	// }
	// if(this.x+this.width > sx+sw){
	// 	this.x = sx+sw -this.width;
	// }
	// if(this.y < sy){
	// 	this.y = sy;
	// }
	// if(this.y+this.height > sy+sh){
	// 	this.y = sy+sh - this.height;
	// }
	//console.log("moveTo");
	console.log(String(this.x)+" , "+String(this.y));
	this.updateNotification();

};

AmebaCard.prototype.eventHandler = function(event){
	//event handler
	this.eventList[event.type](event,this);
};
AmebaCard.prototype.setOnMouseEventListener = function(type,method){
	var self = this;
	if(self.MOUSEEVENTTYPE.indexOf(type) !== -1){
		self.eventList[type] = method;
		//console.log("set");
	}
};

AmebaCard.prototype.clearOnMouseEventListener = function(type){
	var self = this;
	if(self.MOUSEEVENTTYPE.indexOf(type) !== -1){
		self.eventList[type] = function(e){};
	}
};

AmebaCard.prototype.changeDrawFlg = function(){
	var self = this;
	if(self.drawFlg){
		self.drawFlg=false;
	}else{
		self.drawFlg=true;
	}
	//self.updateNotification();
};


AmebaCard.prototype.updateNotification = function(){
	this.updateFlg = true;
	//this.department.updateListener(this.id);
};


var generateRandomID = function(){
	return String(Math.random().toString(36).slice(-8));
};


var generateRandomInt = function(min,max){
	return Math.floor( Math.random() * (max - min + 1) ) + min;
};

module.exports = AmebaCard;