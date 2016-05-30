

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
	this.preRender();
	//クリック箇所
	this.clickX = 0;
	this.clickY = 0;

	this.drawFlg = true;
	this.updateFlg = false;

	this.mouseenter = false;
	this.mouseover = false;
	
	this.datas = option === undefined ? {} :option.datas;

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
	//console.log(String(this.x)+" , "+String(this.y));

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
	//console.log(String(this.x)+" , "+String(this.y));
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
	this.department.updateListener(this.id);
};





/************************************************************************

************************************************************************/

/**
 * アメーバキャンバス（描画キャンバス）
 * @param {[type]} option [description]
 */
var AmebaCanvas = function(option){
	var self = this;
	option = option === undefined ? {} : option;
	this.id = option.id === undefined ? generateRandomID() : option.id; 
	this.width = option.width === undefined ? 1000 : option.width;
	this.height = option.height === undefined ? 1000 : option.height;
	
	this.canvas = document.getElementById(this.id) === null ? (function(id){var elem = document.createElement("canvas"); elem.setAttribute("id",id); return elem;}(this.id)) : document.getElementById(this.id);
	this.x = option.x === undefined ? (function(style){return style.left === "" ? 0 : parseFloat(style.left);}(this.canvas.style)) : option.x;
	this.y = option.y === undefined ? (function(style){return style.top === "" ? 0 : parseFloat(style.top);}(this.canvas.style)) : option.y;
	this.canvas.style.position = "absolute";
	//this.canvas.style.top ="30px";
	//this.canvas.style.left = "0px";
	this.canvas.style.zIndex=10;
	this.canvas.style.top =this.y+"px";
	this.canvas.style.left = this.x+"px";
	this.ctx = this.canvas.getContext("2d");

	//console.log(this.ctx);
	//描画オブジェクトの蓄積
	this.amebas = {};
	this.zOrder = [];
	this.render = {};//render target key-value
	this.updates = {};

	this.layers = {
		layer0:self.createLayer(0)
	};

	this.thSeed = option.thSeed === undefined ? 1000 : option.thSeed;

	//this.renderStartTime = new Date();
	//this.renderEndTime = new Date();
	
	this.eventType = option.eventType === undefined ? "drag" : option.eventType;
	
	this.eventList = {
		mousedown:function(e){self.propagateMouseEvent(e,false);},
		mousemove:function(e){self.propagateMouseEvent(e,false);},
		mouseup:function(e){self.propagateMouseEvent(e,false);},
		mouseleave:function(e){self.propagateMouseEvent(e,false);},
		mouseout:function(e){self.propagateMouseEvent(e,false);},
		mouseenter:function(e){self.propagateMouseEvent(e,false);},
		mouseover:function(e){self.propagateMouseEvent(e,false);},
		click:function(e){self.propagateMouseEvent(e,false);},
		dblclick:function(e){self.propagateMouseEvent(e,false);},
		contextmenu:function(e){self.propagateMouseEvent(e,false);},
		show:function(e){self.propagateMouseEvent(e,false);}
	};
	//イベント制御対象のアメーバ
	this.eventTargetList = [];
	this.setEventListener();

	//this.initWebWorker('/javascripts/AmebaCanvasWebWorker.js');

	this.focusCard = '';

	//this.clearEventListener();
	//this.dragstart = false;

	this.drawAnimation="";
	this.animationKeyFrame=60;
	this.currentFrame = 0;

	this.telepathyClient = '';
	this.isConnected=false;
	this.host = '';
	this.site = '';
	this.token = '';



	//this.startAnimation(this);

	window.onunload = function() {
		self.stopAnimation();
	};

};
AmebaCanvas.prototype.MOUSEEVENTTYPE = ["click","mousedown","mousemove","mouseup","dblclick","mouseover","mouseenter","mouseleave","mouseout","show","contextmenu"];

AmebaCanvas.prototype.startAnimation = function(socket){
	var self = this;

	//self.drawAmebas(self); 	// this.animationId = setInterval(function(){self.drawAmebas(self)},1);

	self.currentFrame++;

	if( self.currentFrame >= self.animationKeyFrame ){

		//console.log('syncAmebaCanvas', this.id, this.syncId);

		//self.syncAmebaCanvas(self);

		self.currentFrame = 0;
	}

	self.drawAnimation = requestAnimationFrame( function () {
		//console.log(socket);
		//
		self.drawAmebas(self);
		if(socket === undefined){
			self.startAnimation();
			//console.log('undefined');

		}else{
			self.updatePositionsWithClustering();
			Object.keys(self.amebas).forEach(function(elm,index){
				//console.log(elm);
				var target = self.amebas[elm];
				socket.emit('sync_cluster_move',{id:target.id,x:target.x,y:target.y});

			});

			self.startAnimation(socket);
		}
		// self.wProcessSendAllDatasWithoutPreRender(function(sendObj){
		// 	//console.log('update');
		// 	self.worker.postMessage(
		// 		{act:'updatePositionWithClustering',
		// 		data:{
		// 			canvas:{width:self.width,height:self.height,zOrder:self.zOrder},
		// 			amebas:sendObj
		// 			}
		// 		});
		// });
		//console.log('dra');
	});
};
AmebaCanvas.prototype.createLayer = function(num){
	var layer = document.createElement("canvas");
	layer.width = this.width;
	layer.id = this.id+String(num);
	layer.height = this.height;
	layer.style.left = this.x+ "px";
	layer.style.top = this.y+ "px";
	layer.style.position = "absolute";
	document.body.appendChild(layer);
	return layer;

};

AmebaCanvas.prototype.drawLayer = function(layerID){
	var self = this;

	var canvas = self.layers[layerID];
	var context = canvas.getContext('2d');
	context.clearRect(0,0,amebaCanvas.width,amebaCanvas.height);	

	Object.keys(self.render).forEach(function(elm,index){
		if(self.render[elm] == layerID){
			context.drawImage(self.amebas[elm].preRenderCanvas,self.amebas[elm].x,self.amebas[elm].y);
		}
	});

};


AmebaCanvas.prototype.divideLayer=function(amebaId) {
      //var maxAge: number, layerAge: number;
     // var sprites: Sprite[] = this.spriteList.sprites;
     //ktsn/amebaCanvasわからない
     //
     var self = this;
     var maxAge = 0;
     var layerAge = 0;

     var target = self.render[amebaId];
     var sameLayerCard = [];
 	Object.keys(self.render).forEach(function(val){
 		if(self.render[val] == target){
 			sameLayerCard.push(val);
 		}
 	});


     sameLayerCard.forEach(function(elm){
     	maxAge += self.updates[elm];
     	if(elm == amebaId){
     		layerAge += self.updates[elm];
     	}
     });
     

     var threshold = self.thSeed * (1- layerAge/maxAge) + 1;
     	var layers_size = Object.keys(self.layers).length;

     //if(layers_size > threshold){
 	if(sameLayerCard.length > threshold){	
     	self.layers["layer"+String(layers_size)] = self.createLayer(layers_size);
     	self.render[amebaId] = "layer"+String(layers_size);
     	self.updates[amebaId] = 1;
     	self.drawLayer(target);
     	// console.log("divide");
     	// console.log(threshold);
     	// console.log(sameLayerCard.length);
     	// console.log(self.layers);
     	// console.log(self.render);
     }else{
     	//console.log(threshold);

     	//console.log(maxAge);
     	//console.log(layerAge);
       //	console.log(threshold);
     }

  };

AmebaCanvas.prototype.stopAnimation = function(){
	cancelAnimationFrame(this.drawAnimation);
};
AmebaCanvas.prototype.addCard = function(ameba){
	ameba.updateFlg = true;
	this.amebas[ameba.id] = ameba;
	this.zOrder.push(ameba.id);
	this.updates[ameba.id]=1;
	this.render[ameba.id] = "layer0";
	//this.updateList.push(ameba.id);
	ameba.department = this;
	//this.drawAmebas();
};
AmebaCanvas.prototype.removeAmeba = function(amebaId){
	var index = this.zOrder.indexOf(amebaId);
	if(index !== -1){
		delete this.amebas[amebaId];
		this.zOrder.splice(index,1);	
	}
};
AmebaCanvas.prototype.removeAmebas = function(amebaId){
	// var self = this;
	// var deleteList = [];
	// self.zOrder.forEach(function(elm,value){
	// 	var nm = self.zOrder.indexOf(amebaId);
	// 	if(nm !== -1){
	// 		deleteList.push(elm);	
	// 	}
	// });

	// deleteList.forEach(function(elm,valur){
	// 	var index = self.zOrder.indexOf(elm);
	// 	if(index !== -1){
	// 		delete self.amebas[elm];
	// 		self.zOrder.splice(index,1);
	// 	}
	// });

};

AmebaCanvas.prototype.popupZOrder = function(amebaId){
	var index = this.zOrder.indexOf(amebaId);
	if(index !== -1){
		this.zOrder.splice(index,1);
		this.zOrder.push(amebaId);
		//console.log(this.zOrder);
	}
};
AmebaCanvas.prototype.drawAmebas = function(amebaCanvas){
	//一度の描画
	//console.log(amebaCanvas);
	var self = this;
	//var startDraw = new Date();
	//amebaCanvas.ctx.clearRect(0,0,amebaCanvas.width,amebaCanvas.height);
	//更新オブジェクトの抽出
	//var redrawIDs = self.updateList;
	var canvases = {};
	//初期化
	self.zOrder.forEach(function(elm,index){
		if(self.amebas[elm].updateFlg){
			var canvasId = self.render[elm];
			canvases[canvasId] = self.layers[canvasId];
			var canvas = self.layers[canvasId];
			var context = canvas.getContext('2d');
			context.clearRect(0,0,amebaCanvas.width,amebaCanvas.height);	
		}	
	});

	Object.keys(canvases).forEach(function(element, index){
		// if(self.amebas[element].drawFlg){
		// 	var canvasId = self.render[element];
		// 	var canvas = self.layers[canvasId];
		// 	var context = canvas.getContext('2d');
		// 	context.drawImage(amebaCanvas.amebas[element].preRenderCanvas,amebaCanvas.amebas[element].x,amebaCanvas.amebas[element].y);
		// 	//amebaCanvas.ctx.drawImage(amebaCanvas.amebas[element].preRenderCanvas,amebaCanvas.amebas[element].x,amebaCanvas.amebas[element].y);
		// }

			self.zOrder.forEach(function(elm,index){
				if(self.render[elm] == element){
					if(self.amebas[elm].drawFlg){
						var canvasId = self.render[elm];
						var canvas = self.layers[canvasId];
						var context = canvas.getContext('2d');
						context.drawImage(amebaCanvas.amebas[elm].preRenderCanvas,amebaCanvas.amebas[elm].x,amebaCanvas.amebas[elm].y);
						//amebaCanvas.ctx.drawImage(amebaCanvas.amebas[element].preRenderCanvas,amebaCanvas.amebas[element].x,amebaCanvas.amebas[element].y);
					}

				}
				self.amebas[elm].updateFlg = false;
			});

	});

	//self.updateList = [];

//	var endDraw = new Date();
//	return startDraw-endDraw;

	//delete drawList;
};

AmebaCanvas.prototype.updatePositionsWithClustering = function(){
	var self = this;
	var W = self.width;
	var H = self.height;

	var N = Object.keys(self.amebas).length;
	var G = 1;
	var vlimit = 2.0;
	var amList = self.zOrder;

	var tagList = [];
	amList.forEach(function(elm,index){
		if(self.amebas[elm].cardType == "cluster"){
			Array.prototype.push.apply(tagList,self.amebas[elm].tags);
		}
	});
	//console.log(tagList);
	tagList.forEach(function(tag,index){
		amList.forEach(function(elm,index){
			self.amebas[elm].midX = self.amebas[elm].x;
			self.amebas[elm].lenX = self.amebas[elm].width;
			self.amebas[elm].minX = self.amebas[elm].midX - self.amebas[elm].lenX / 2;
			self.amebas[elm].maxX = self.amebas[elm].midX + self.amebas[elm].lenX / 2;
			self.amebas[elm].midY = self.amebas[elm].y;
			self.amebas[elm].lenY = self.amebas[elm].height;
			self.amebas[elm].minY = self.amebas[elm].midY - self.amebas[elm].lenY / 2;
			self.amebas[elm].maxY = self.amebas[elm].midY + self.amebas[elm].lenY / 2;
			
			if (self.amebas[elm].cardType != "cluster") {
				self.amebas[elm].weight = self.amebas[elm].lenX * self.amebas[elm].lenY; //重さ
			}

			self.amebas[elm].fX = 0;
			self.amebas[elm].fY = 0;
			self.amebas[elm].hitcount = 0;
		});
			var N = amList.length;
		for (var i = 0; i <= N - 2; i++) {
			for (var j = i + 1; j <= N - 1; j++) {
				if (!(self.amebas[amList[i]].hasTag(tag) && self.amebas[amList[j]].hasTag(tag))) continue;
				var dX = self.amebas[amList[i]].midX - self.amebas[amList[j]].midX;
				var dY = self.amebas[amList[i]].midY - self.amebas[amList[j]].midY;
				var dXdX = dX * dX;
				var dYdY = dY * dY;
				var dRdR = dXdX + dYdY;
				var dR = Math.max(1, Math.sqrt(dRdR));
				var dD = Math.atan2(dY, dX);
				var udX = dX / dR;
				var udY = dY / dR;
				var fX = ((G * self.amebas[amList[i]].weight * self.amebas[amList[j]].weight) / (dRdR)) * udX;
				var fY = ((G * self.amebas[amList[i]].weight * self.amebas[amList[j]].weight) / (dRdR)) * udY;
				var sX = (self.amebas[amList[i]].maxX < self.amebas[amList[j]].maxX ? self.amebas[amList[i]].maxX : self.amebas[amList[j]].maxX) - (self.amebas[amList[i]].minX > self.amebas[amList[j]].minX ? self.amebas[amList[i]].minX : self.amebas[amList[j]].minX);
				var sY = (self.amebas[amList[i]].maxY < self.amebas[amList[j]].maxY ? self.amebas[amList[i]].maxY : self.amebas[amList[j]].maxY) - (self.amebas[amList[i]].minY > self.amebas[amList[j]].minY ? self.amebas[amList[i]].minY : self.amebas[amList[j]].minY);
				var s = (sX > 0 ? sX : 0) * (sY > 0 ? sY : 0);
				var hit = (s > 0);
					var mag = ((self.amebas[amList[i]].cardType == "cluster" || self.amebas[amList[j]].cardType == "cluster") && (self.amebas[amList[i]].hasTag(tag) && self.amebas[amList[j]].hasTag(tag)) ? -1 : 0);
					//console.log("mag : "+ mag);
					if (dR < self.amebas[amList[i]].lenX * 2) {
						self.amebas[amList[i]].fX += mag * fX;
						self.amebas[amList[i]].fY += mag * fY;
						self.amebas[amList[j]].fX -= mag * fX;
						self.amebas[amList[j]].fY -= mag * fY;
					} else {
						self.amebas[amList[i]].fX -= mag * fX;
						self.amebas[amList[i]].fY -= mag * fY;
						self.amebas[amList[j]].fX += mag * fX;
						self.amebas[amList[j]].fY += mag * fY;
					}

					if (self.amebas[amList[i]].cardType != "cluster" && self.amebas[amList[j]].cardType != "cluster") {
						if (hit) {
							var mag = -1;
							self.amebas[amList[i]].fX -= mag * fX;
							self.amebas[amList[i]].fY -= mag * fY;
							self.amebas[amList[j]].fX += mag * fX;
							self.amebas[amList[j]].fY += mag * fY;
						}
					}
			}
		}
		for (var i = 0; i <= N - 1; i++) {
			if (self.amebas[amList[i]].width < 1) self.amebas[amList[i]].width = 1;
			if (self.amebas[amList[i]].height < 1) self.amebas[amList[i]].height = 1; 
			self.amebas[amList[i]].aX = self.amebas[amList[i]].fX / self.amebas[amList[i]].weight;
			self.amebas[amList[i]].aY = self.amebas[amList[i]].fY / self.amebas[amList[i]].weight;
			self.amebas[amList[i]].vX += self.amebas[amList[i]].aX;
			self.amebas[amList[i]].vY += self.amebas[amList[i]].aY;
			self.amebas[amList[i]].vX = Math.max(-vlimit, Math.min(+vlimit, self.amebas[amList[i]].vX));
			self.amebas[amList[i]].vY = Math.max(-vlimit, Math.min(+vlimit, self.amebas[amList[i]].vY));
			if (self.amebas[amList[i]].cardType != "cluster" && self.amebas[amList[i]].hasTag(tag)) {
				 self.amebas[amList[i]].setPosition(self.amebas[amList[i]].x+self.amebas[amList[i]].vX,self.amebas[amList[i]].y+self.amebas[amList[i]].vY);
			}
			//壁当たり判定
			if (self.amebas[amList[i]].x < 0) { self.amebas[amList[i]].x = 0; self.amebas[amList[i]].vX *= -1;}
			if (self.amebas[amList[i]].x + self.amebas[amList[i]].width > W) { self.amebas[amList[i]].x = W - self.amebas[amList[i]].width; self.amebas[amList[i]].vX *= -1;}
			if (self.amebas[amList[i]].y < 0) { self.amebas[amList[i]].y = 0; self.amebas[amList[i]].vY *= -1;}
			if (self.amebas[amList[i]].y + self.amebas[amList[i]].height > H) { self.amebas[amList[i]].y = H - self.amebas[amList[i]].height; self.amebas[amList[i]].vY *= -1;}
			self.amebas[amList[i]].midX = self.amebas[amList[i]].x;
			self.amebas[amList[i]].lenX = self.amebas[amList[i]].width;
			self.amebas[amList[i]].minX = self.amebas[amList[i]].midX - self.amebas[amList[i]].lenX / 2;
			self.amebas[amList[i]].maxX = self.amebas[amList[i]].midX + self.amebas[amList[i]].lenX / 2;
			self.amebas[amList[i]].midY = self.amebas[amList[i]].y;
			self.amebas[amList[i]].lenY = self.amebas[amList[i]].height;
			self.amebas[amList[i]].minY = self.amebas[amList[i]].midY - self.amebas[amList[i]].lenY / 2;
			self.amebas[amList[i]].maxY = self.amebas[amList[i]].midY + self.amebas[amList[i]].lenY / 2;
			if (self.amebas[amList[i]].cardType != "cluster") {
				self.amebas[amList[i]].weight = self.amebas[amList[i]].lenX * self.amebas[amList[i]].lenY;
			}
			var alpha = 0.01;
			self.amebas[amList[i]].lo_vX += (self.amebas[amList[i]].vX - self.amebas[amList[i]].lo_vX) * alpha;
			self.amebas[amList[i]].lo_vY += (self.amebas[amList[i]].vY - self.amebas[amList[i]].lo_vY) * alpha;
			self.amebas[amList[i]].lo_minX += (self.amebas[amList[i]].minX - self.amebas[amList[i]].lo_minX) * alpha;
			self.amebas[amList[i]].lo_minY += (self.amebas[amList[i]].minY - self.amebas[amList[i]].lo_minY) * alpha;
			self.amebas[amList[i]].lo_maxX += (self.amebas[amList[i]].maxX - self.amebas[amList[i]].lo_maxX) * alpha;
			self.amebas[amList[i]].lo_maxY += (self.amebas[amList[i]].maxY - self.amebas[amList[i]].lo_maxY) * alpha;
			self.amebas[amList[i]].lo_midX += (self.amebas[amList[i]].midX - self.amebas[amList[i]].lo_midX) * alpha;
			self.amebas[amList[i]].lo_midY += (self.amebas[amList[i]].midY - self.amebas[amList[i]].lo_midY) * alpha;
			self.amebas[amList[i]].lo_lenX += (self.amebas[amList[i]].lenX - self.amebas[amList[i]].lo_lenX) * alpha;
			self.amebas[amList[i]].lo_lenY += (self.amebas[amList[i]].lenY - self.amebas[amList[i]].lo_lenY) * alpha;
		}
	});
	
};


AmebaCanvas.prototype.searchAmebasWithTag = function(tag){
	var list = [];	
	var self = this;
	zOrder.forEach(function(elem,index){
		var search = self.amebas[elem].tags.indexOf(tag);
		if(search !== -1){
			list.push(elem);
		}
	});
	return list;
};
AmebaCanvas.prototype.searchAmebasWithTags = function(tags){
	var self = this;
	var list = self.zOrder;
	tags.forEach(function(e,i){
		var instansList = [];
		list.forEach(function(elem,index){
			var search = self.amebas[elem].tags.indexOf(e);
			if(search !== -1){
				instansList.push(elem);
			}
			list = instansList;
		});
	});	
	return list;
};

AmebaCanvas.prototype.setEventListener = function(){
	
	this.clearEventListener();
	switch(this.type){
		case "drag" :
			this.setDragEventListener();
		break;
		case "gather" :
			this.setGatherEventListener();
		break;
		case "freedraw" :
			this.setFreeDrawEventListener();
		break;
		default :
			this.setDragEventListener();
		break;
	}
};
AmebaCanvas.prototype.clearEventListener = function(){
	var self = this;
	Object.keys(this.eventList).forEach(function(elem,index){
		self.canvas.removeEventListener(elem,self.eventList[elem]);
		self.eventList[elem] = function(e){};
	});

};
AmebaCanvas.prototype.propagateMouseEvent = function(event,manyFlg){
	//範囲内をクリックされた要素のリストにイベントを伝える
	var self = this;
	//var targetList;
	manyFlg = manyFlg === undefined ? false : manyFlg;
	//console.log(event.type);
	if(manyFlg){
		//全部に伝える
		var order = self.zOrder;

		order.forEach(function(element,index){
			// self.eventTargetList.push(element);
			// self.popupZOrder(element);
			 //relativeClickイベントに飛ばす
			 //self.amebas[element].relativeClick(event.clientX+window.pageXOffset,event.clientY+window.pageYOffset);
			self.amebas[element].eventHandler(event);
		});
	}else{
		var revOrder = self.zOrder.reverse();

		if(!revOrder.some(function(element){
			if(self.amebas[element].isCollision(event.clientX+window.pageXOffset-self.x,event.clientY+window.pageYOffset-self.y)){
				// self.eventTargetList.push(element);
				 self.zOrder.reverse();
				 //self.popupZOrder(element);
				 // console.log(element);
				 //self.amebas[element].relativeClick(event.clientX+window.pageXOffset,event.clientY+window.pageYOffset);	
				self.amebas[element].eventHandler(event);
				
				return true;
			}
		})){
			self.zOrder.reverse();
		}		
	}

	//return targetList;
	
};

/*
//ドラッグイベントリスナー
*/
AmebaCanvas.prototype.setDragEventListener = function(){
	 var self = this;
	
	self.setOnMouseEventListener("mousedown",function(e){

		var revOrder = self.zOrder.reverse();

		if(!revOrder.some(function(element){
			if(self.amebas[element].isCollision(event.clientX+window.pageXOffset-self.x,event.clientY+window.pageYOffset-self.y)){
				 self.eventTargetList.push(element);
				 self.zOrder.reverse();
				 self.popupZOrder(element);
				
				 self.amebas[element].relativeClick(event.clientX+window.pageXOffset,event.clientY+window.pageYOffset);	
				//self.amebas[element].eventHandler(event);
				
				return true;
			}
		})){
			self.zOrder.reverse();
		}		


		self.setOnMouseEventListener("mousemove",function(e){

			self.eventTargetList.forEach(function(elem,index){

				self.sync_drag_move(elem,e.clientX+window.pageXOffset,e.clientY+window.pageYOffset);
				//self.amebas[elem].moveTo(e.clientX+window.pageXOffset,e.clientY+window.pageYOffset,"mousemove");
			});
		});
		self.setOnMouseEventListener("mouseup",function(e){
			self.eventTargetList.forEach(function(elem,index){
				//self.amebas[elem].moveTo(e.clientX+window.pageXOffset,e.clientY+window.pageYOffset,"mousemove");
				self.sync_drag_move(elem,e.clientX+window.pageXOffset,e.clientY+window.pageYOffset);
			});
			 // console.log(element);
			
			self.clearOnMouseEventListener("mousemove");
			self.clearOnMouseEventListener("mouseleave");
			self.clearOnMouseEventListener("mouseup");
			self.eventTargetList = [];

		});


		self.setOnMouseEventListener("mouseleave",function(e){
			//console.log("mouseleave")
			self.clearOnMouseEventListener("mousemove");
			self.clearOnMouseEventListener("mouseleave");
			self.clearOnMouseEventListener("mouseup");
			self.eventTargetList = [];
			
		});
	
	});

	self.setOnMouseEventListener("mousemove",function(e){
		var revOrder = self.zOrder.reverse();
		if(!revOrder.some(function(element){
			if(self.amebas[element].isCollision(e.clientX+window.pageXOffset-self.x,e.clientY+window.pageYOffset-self.y)){
					if(!self.amebas[element].mouseover){
						//mouseover
						var eventobj = {
						altKey:e.altKey,
						bubles:e.bubles,
						button:e.button,
						buttons:e.buttons,
						cancelBubble:e.cancelBubble,
						cancelable:e.cancelable,
						clientX:e.clientX,
						ctrlKey:e.ctrlKey,
						currentTarget:e.currentTarget,
						defaultPrevented:e.defaultPrevented,
						detail:e.detail,
						eventPhase:e.eventPhase,
						fromElement:e.fromElement,
						isTrusted:e.isTrusted,
						layerX:e.layerX,
						layerY:e.layerY,
						metaKey:e.metaKey,
						movementX:e.movementX,
						movementY:e.movementY,
						offsetX:e.offsetX,
						offsetY:e.offsetY,
						pageX:e.pageX,
						pageY:e.pageY,
						path:e.path,
						relatedTarget:e.relatedTarget,
						returnValue:e.returnValue,
						screenX:e.screenX,
						screenY:e.screenY,
						shiftKey:e.shiftKey,
						sourceCapabilities:e.sourceCapabilities,
						srcElement:e.srcElement,
						target:e.target,
						timeStamp:e.timeStamp,
						toElement:e.toElement,
						type:'mouseover',
						view:e.view,
						which:e.which,
						x:e.x,
						y:e.y						
					};	
						self.amebas[element].mouseover = true;
						self.amebas[element].eventHandler(eventobj);

					}
				 				
					//TODO mosueenter

				return true;
			}
		})){
			self.zOrder.reverse();
			revOrder.forEach(function(elm,index){
					if(self.amebas[elm].mouseover){
						var eventobj = {
							altKey:e.altKey,
							bubles:e.bubles,
							button:e.button,
							buttons:e.buttons,
							cancelBubble:e.cancelBubble,
							cancelable:e.cancelable,
							clientX:e.clientX,
							ctrlKey:e.ctrlKey,
							currentTarget:e.currentTarget,
							defaultPrevented:e.defaultPrevented,
							detail:e.detail,
							eventPhase:e.eventPhase,
							fromElement:e.fromElement,
							isTrusted:e.isTrusted,
							layerX:e.layerX,
							layerY:e.layerY,
							metaKey:e.metaKey,
							movementX:e.movementX,
							movementY:e.movementY,
							offsetX:e.offsetX,
							offsetY:e.offsetY,
							pageX:e.pageX,
							pageY:e.pageY,
							path:e.path,
							relatedTarget:e.relatedTarget,
							returnValue:e.returnValue,
							screenX:e.screenX,
							screenY:e.screenY,
							shiftKey:e.shiftKey,
							sourceCapabilities:e.sourceCapabilities,
							srcElement:e.srcElement,
							target:e.target,
							timeStamp:e.timeStamp,
							toElement:e.toElement,
							type:'mouseleave',
							view:e.view,
							which:e.which,
							x:e.x,
							y:e.y						
						};					
						self.amebas[elm].mouseover = false;
						self.amebas[elm].eventHandler(eventobj);
					}
				

				//TODO mouseout
				
			});
		}else{
			self.zOrder.reverse();			
		}		
	});

	self.setOnMouseEventListener("click",function(e){
			//self.propagateMouseEvent(e,false);
	
	});
	self.setOnMouseEventListener("dblclick",function(e){
			console.log("dblclick");
			//self.propagateMouseEvent(e,false);
	});
	// self.setOnMouseEventListener("mouseover",function(e){
	// 		//self.propagateMouseEvent(e,false);
	// });
	// self.setOnMouseEventListener("mouseenter",function(e){
	// 		//self.propagateMouseEvent(e,false);
	// });
	// self.setOnMouseEventListener("mouseout",function(e){
	// 		//self.propagateMouseEvent(e,false);
	// });
	self.setOnMouseEventListener("show",function(e){
			//self.propagateMouseEvent(e,false);
	});
	self.setOnMouseEventListener("contextmenu",function(e){
       // console.log('aaaaa');

			//self.propagateMouseEvent(e,false);
	});

};

AmebaCanvas.prototype.setOnMouseEventListener = function(type,method,manyFlg){
	var self = this;
	manyFlg = manyFlg === undefined ? false : manyFlg;
	if(self.MOUSEEVENTTYPE.indexOf(type) !== -1){
		self.canvas.addEventListener(type,
			(function(ac){
			var event = function(e){
				//衝突したやつにイベント送る
				self.propagateMouseEvent(e,manyFlg);
				method(e);
			};
			ac.eventList[type] = event;
			return event;
			}(self))
		);
	}
};
AmebaCanvas.prototype.clearOnMouseEventListener = function(type){
	var self = this;
	if(self.MOUSEEVENTTYPE.indexOf(type) !== -1){
		//console.log("clear");

		self.canvas.removeEventListener(type,this.eventList[type]);
	 	self.eventList[type] = function(e){self.propagateMouseEvent(e,false);};
	}
};
AmebaCanvas.prototype.swapCard = function(id,amebaCard){
	var self = this;
	var index = self.zOrder.indexOf(id);
	if(index === -1){
		//追加処理or処理しない
	}else{
		amebaCard.width = self.amebas[amebaCard.id].width;
		amebaCard.height = self.amebas[amebaCard.id].height;
		amebaCard.x = self.amebas[amebaCard.id].x;
		amebaCard.y = self.amebas[amebaCard.id].y;
		delete self.amebas[id];
		self.zOrder.splice(index,1,amebaCard.id);
		self.amebas[amebaCard.id] = amebaCard;
	}
};

AmebaCanvas.prototype.updateListener = function(id){
	//再描画処理
	//idの蓄積
	var self = this;
	//console.log(id);
	//this.renderEndTime = new Date();
	this.updates[id]++;
	//this.updateList.push(id);

	this.divideLayer(id);


	//console.log(this.renderEndTime - this.renderStartTime);
	//var renderTime = self.drawAmebas(self);
	//console.log(renderTime);
	//this.renderStartTime = new Date();
};

/**
 *
 *	WebWorker通信
 *
 * 
 */
var counter = 0;
AmebaCanvas.prototype.initWebWorker = function(url,socket){
	var self = this;
	this.worker = new Worker(url);
	this.worker.addEventListener('message',function(e){
		var data = e.data;
		switch(data.act){
			case 'console' :
				console.log(data);
				break;
			case 'updateAmebas' :
				//console.log('update');
				Object.keys(data.data).forEach(function(elm,index){
					if(index === 0 && counter < 100){
						///console.log(data.data[elm]);
						counter++;
					}
					self.wSetAmebaStatusWithoutPreRender(data.data[elm]);
					socket.emit('sync_cluster_move',{id:id,x:x,y:y});
				});
				break;
			case 'updateAmeba' :
				break;
			case 'addAmebas' :
				break;
			case 'addAmeba' :
				break;
			case 'removeAmebas' :
				break;
			case 'removeAmeba' :
				break;
			default :
				console.log('not exist this command');
				break;
		}
	});
};

AmebaCanvas.prototype.sendMessage = function(){
	this.worker.postMessage({act:'console',data:'console'});
};

AmebaCanvas.prototype.wSetAmebaStatusWithoutPreRender = function(data){
	if(data.id != undefined){
		//console.log(data);
		if(this.amebas[data.id] != undefined){

			this.amebas[data.id].x = data.x === undefined ? this.amebas[data.id].x : data.x;
			this.amebas[data.id].y = data.y === undefined ? this.amebas[data.id].y : data.y;
			this.amebas[data.id].z = data.z === undefined ? this.amebas[data.id].z : data.z;
			this.amebas[data.id].vX = data.vX === undefined ? this.amebas[data.id].vX : data.vX;
			this.amebas[data.id].vY = data.vY === undefined ? this.amebas[data.id].vY : data.vY;
			this.amebas[data.id].aX = data.aX === undefined ? this.amebas[data.id].aX : data.aX;
			this.amebas[data.id].aY = data.aY === undefined ? this.amebas[data.id].aY : data.aY;
			this.amebas[data.id].fX = data.fX === undefined ? this.amebas[data.id].fX : data.fX;
			this.amebas[data.id].fY = data.fY === undefined ? this.amebas[data.id].fY : data.fY;
			this.amebas[data.id].lo_vX = data.lo_vX === undefined ? this.amebas[data.id].lo_vX : data.lo_vX;
			this.amebas[data.id].lo_vY = data.lo_vY === undefined ? this.amebas[data.id].lo_vY : data.lo_vY;
			this.amebas[data.id].lo_minX = data.lo_minX === undefined ? this.amebas[data.id].lo_minX : data.lo_minX;
			this.amebas[data.id].lo_minY = data.lo_minY === undefined ? this.amebas[data.id].lo_minY : data.lo_minY;
			this.amebas[data.id].lo_maxX = data.lo_maxX === undefined ? this.amebas[data.id].lo_maxX : data.lo_maxX;
			this.amebas[data.id].lo_maxY = data.lo_maxY === undefined ? this.amebas[data.id].lo_maxY : data.lo_maxY;
			this.amebas[data.id].lo_midX = data.lo_midX === undefined ? this.amebas[data.id].lo_midX : data.lo_midX;
			this.amebas[data.id].lo_midY = data.lo_midY === undefined ? this.amebas[data.id].lo_midY : data.lo_midY;
			this.amebas[data.id].lo_lenX = data.lo_lenX === undefined ? this.amebas[data.id].lo_lenX : data.lo_lenX;
			this.amebas[data.id].lo_lenY = data.lo_lenY === undefined ? this.amebas[data.id].lo_lenY : data.lo_lenY;
			this.amebas[data.id].cx = data.cx === undefined ? this.amebas[data.id].cx : data.cx;
			this.amebas[data.id].cy = data.cy === undefined ? this.amebas[data.id].cy : data.cy;
			this.amebas[data.id].circle = data.circle === undefined ? this.amebas[data.id].circle : data.circle;
			this.amebas[data.id].radian = data.radian === undefined ? this.amebas[data.id].radian : data.radian;
			this.amebas[data.id].radious = data.radious === undefined ? this.amebas[data.id].radious : data.radious;
			
			this.amebas[data.id].datas = data.datas === undefined ? this.amebas[data.id].datas : data.datas;
			this.amebas[data.id].name = data.name === undefined ? this.amebas[data.id].name : data.name;
			this.amebas[data.id].drawFlg = data.drawFlg === undefined ? this.amebas[data.id].drawFlg : data.drawFlg;
			this.amebas[data.id].tags = data.tags === undefined ? this.amebas[data.id].tags : data.tags;
			this.amebas[data.id].weight = data.weight === undefined ? this.amebas[data.id].seight : data.weight;
			this.amebas[data.id].updateNotification();

		}
	}
};

AmebaCanvas.prototype.wSetCardEventListener = function(data){
	if(data.id != undefined != undefined){
		if(this.amebas[data.id] != undefined){
			this.amebas[data.id].eventList.mousedown = data.mousedown === undefined ? this.amebas[data.id].eventList.mousedown : data.mousedown;
			this.amebas[data.id].eventList.mousemove = data.mousemove === undefined ? this.amebas[data.id].eventList.mousemove : data.mousemove;
			this.amebas[data.id].eventList.mouseup = data.mouseup === undefined ? this.amebas[data.id].eventList.mouseup : data.mouseup;
			this.amebas[data.id].eventList.mouseleave = data.mouseleave === undefined ? this.amebas[data.id].eventList.mouseleave : data.mouseleave;
			this.amebas[data.id].eventList.mouseout = data.mouseout === undefined ? this.amebas[data.id].eventList.mouseout : data.mouseout;
			this.amebas[data.id].eventList.mouseenter = data.mouseenter === undefined ? this.amebas[data.id].eventList.mouseenter : data.mouseenter;
			this.amebas[data.id].eventList.mouseover = data.mouseover === undefined ? this.amebas[data.id].eventList.mouseover : data.mouseover;
			this.amebas[data.id].eventList.click = data.click === undefined ? this.amebas[data.id].eventList.click : data.click;
			this.amebas[data.id].eventList.dblclick = data.dblclick === undefined ? this.amebas[data.id].eventList.dblclick : data.dblclick;
			this.amebas[data.id].eventList.contextmenu = data.contextmenu === undefined ? this.amebas[data.id].eventList.contextmenu : data.contextmenu;
			this.amebas[data.id].eventList.show = data.show === undefined ? this.amebas[data.id].eventList.show : data.show;
		}
	}
};

AmebaCanvas.prototype.wSetAmebaStatusWithPreRender = function(data){
	//データ型変えたら変更する
	if(data.id != undefined){
		if(this.amebas[data.id] != undefined){
			this.amebas[data.id].width = data.width === undefined ? this.amebas[data.id].width : data.width;
			this.amebas[data.id].height = data.height === undefined ? this.amebas[data.id].height : data.height;

			this.amebas[data.id].cardType = data.cardType === undefined ? this.amebas[data.id].cardType : data.cardType;
			
			this.amebas[data.id].text = data.text === undefined ? this.amebas[data.id].text : data.text;
			this.amebas[data.id].textSize = data.textSize === undefined ? this.amebas[data.id].textSize : data.textSize;
			this.amebas[data.id].textFont = data.textFont === undefined ? this.amebas[data.id].textFont : data.textFont;
			this.amebas[data.id].color = data.color === undefined ? this.amebas[data.id].color : data.color;

			this.amebas[data.id].url = data.url === undefined ? this.amebas[data.id].url : data.url;
			this.amebas[data.id].scale = data.scale === undefined ? this.amebas[data.id].scale : data.scale;

			this.amebas[data.id].graphicType = data.graphicType === undefined ?this.amebas[data.id].graphicType : data.graphicType;
			this.amebas[data.id].radious = data.radious === undefined ? this.amebas[data.id].radious :data.radious;
			this.amebas[data.id].canvas = null;
			this.amebas[data.id].preRender();
		}
	}
};



AmebaCanvas.prototype.wAddAmeba = function(data){
	if(data.id != undefined){
		var nAmeba = new AmebaCard(data);
		this.addCard(nAmeba);
	}
}

AmebaCanvas.prototype.wRemoveAmeba = function(data){
	if(data.id != undefiend){
		this.removeAmeba(data.id);
	}
}

AmebaCanvas.prototype.wProcessSendAllDatas = function(callback){
	var self = this;
	var amebas = self.amebas;
	var sendObj = {};
	Object.keys(amebas).forEach(function(elm,index){
		sendObj[elm] = {};
		sendObj[elm].id = amebas[elm].id;
		sendObj[elm].x = amebas[elm].x;
		sendObj[elm].y = amebas[elm].y;
		sendObj[elm].z = amebas[elm].z;
		sendObj[elm].vX = amebas[elm].vX;
		sendObj[elm].vY = amebas[elm].vY;
		sendObj[elm].aX = amebas[elm].aX;
		sendObj[elm].aY = amebas[elm].aY;
		sendObj[elm].fX = amebas[elm].fX;
		sendObj[elm].fY = amebas[elm].fY;
		sendObj[elm].lo_vX = amebas[elm].lo_vX;
		sendObj[elm].lo_vY = amebas[elm].lo_vY;
		sendObj[elm].lo_minX = amebas[elm].lo_minX;
		sendObj[elm].lo_minY = amebas[elm].lo_minY;
		sendObj[elm].lo_maxX = amebas[elm].lo_maxX;
		sendObj[elm].lo_maxY = amebas[elm].lo_maxY;
		sendObj[elm].lo_midX = amebas[elm].lo_midX;
		sendObj[elm].lo_midY = amebas[elm].lo_midY;
		sendObj[elm].lo_lenX = amebas[elm].lo_lenX;
		sendObj[elm].lo_lenY = amebas[elm].lo_lenY;
		sendObj[elm].tags = amebas[elm].tags;	

		sendObj[elm].width = amebas[elm].width;
		sendObj[elm].height = amebas[elm].height;

		sendObj[elm].weight = amebas[elm].weight;

		sendObj[elm].cardType = amebas[elm].cardType;

		sendObj[elm].text = amebas[elm].text;
		sendObj[elm].textSize = amebas[elm].textSize;
		sendObj[elm].textFont = amebas[elm].textFont;
		sendObj[elm].color = amebas[elm].color;

		sendObj[elm].url = amebas[elm].url;
		sendObj[elm].scale = amebas[elm].scale;

		sendObj[elm].graphicType = amebas[elm].graphicType;
		sendObj[elm].radious = amebas[elm].radious;

		sendObj[elm].drawFlg = amebas[elm].drawFlg;
		sendObj[elm].datas = amebas[elm].datas;
	});
	callback(sendObj);
	//self.worker.postMessage(message,sendObj);
};

AmebaCanvas.prototype.wProcessSendAllDatasWithoutPreRender = function(callback){
	var self = this;
	var amebas = self.amebas;
	var sendObj = {};
	//console.log('update');
	Object.keys(amebas).forEach(function(elm,index){
		sendObj[elm] = {};
		sendObj[elm].id = amebas[elm].id;		
		sendObj[elm].x = amebas[elm].x;
		sendObj[elm].y = amebas[elm].y;
		sendObj[elm].z = amebas[elm].z;
		sendObj[elm].vX = amebas[elm].vX;
		sendObj[elm].vY = amebas[elm].vY;
		sendObj[elm].aX = amebas[elm].aX;
		sendObj[elm].aY = amebas[elm].aY;
		sendObj[elm].fX = amebas[elm].fX;
		sendObj[elm].fY = amebas[elm].fY;
		sendObj[elm].lo_vX = amebas[elm].lo_vX;
		sendObj[elm].lo_vY = amebas[elm].lo_vY;
		sendObj[elm].lo_minX = amebas[elm].lo_minX;
		sendObj[elm].lo_minY = amebas[elm].lo_minY;
		sendObj[elm].lo_maxX = amebas[elm].lo_maxX;
		sendObj[elm].lo_maxY = amebas[elm].lo_maxY;
		sendObj[elm].lo_midX = amebas[elm].lo_midX;
		sendObj[elm].lo_midY = amebas[elm].lo_midY;
		sendObj[elm].lo_lenX = amebas[elm].lo_lenX;
		sendObj[elm].lo_lenY = amebas[elm].lo_lenY;	
		sendObj[elm].drawFlg = amebas[elm].drawFlg;
		sendObj[elm].tags = amebas[elm].tags;	
		sendObj[elm].weight = amebas[elm].weight;
		sendObj[elm].width = amebas[elm].width;
		sendObj[elm].height = amebas[elm].height;
		sendObj[elm].cardType = amebas[elm].cardType;

		sendObj[elm].cx = amebas[elm].cx;
		sendObj[elm].cy = amebas[elm].cy;
		sendObj[elm].circle = amebas[elm].circle;
		sendObj[elm].radian = amebas[elm].radian;
		sendObj[elm].radious = amebas[elm].radious;
		sendObj[elm].datas = amebas[elm].datas;
			
	});
	callback(sendObj);
//	self.worker.postMessage(message,sendObj);
};

AmebaCanvas.prototype.wProcessSendAllDatasWithPreRender = function(callback){
	var self = this;
	var amebas = self.amebas;
	var sendObj = {};
	Object.keys(amebas).forEach(function(elm,index){
		sendObj[elm].id = amebas[elm].id;

		sendObj[elm].width = amebas[elm].width;
		sendObj[elm].height = amebas[elm].height;

		sendObj[elm].cardType = amebas[elm].cardType;

		sendObj[elm].text = amebas[elm].text;
		sendObj[elm].textSize = amebas[elm].textSize;
		sendObj[elm].textFont = amebas[elm].textFont;
		sendObj[elm].color = amebas[elm].color;

		sendObj[elm].url = amebas[elm].url;
		sendObj[elm].scale = amebas[elm].scale;

		sendObj[elm].weight = amebas[elm].weight;


		sendObj[elm].graphicType = amebas[elm].graphicType;
		sendObj[elm].radious = amebas[elm].radious;
		sendObj[elm].datas = amebas[elm].datas;

	});
		callback(sendObj);
//	self.worker.postMessage(message,sendObj);
};


AmebaCanvas.prototype.wProcessSendData = function(id,callback){
	var self = this;
	if(self.amebas[id] != undefined){
		var ameba = self.amebas[id];
		var sendObj = {};
		sendObj.id = id;
		sendObj.x = ameba.x;
		sendObj.y = ameba.y;
		sendObj.z = ameba.z;
		sendObj.vX = ameba.vX;
		sendObj.vY = ameba.vY;
		sendObj.aX = ameba.aX;
		sendObj.aY = ameba.aY;
		sendObj.fX = amebas.fX;
		sendObj.fY = amebas.fY;
		sendObj.lo_vX = ameba.lo_vX;
		sendObj.lo_vY = ameba.lo_vY;
		sendObj.lo_minX = ameba.lo_minX;
		sendObj.lo_minY = ameba.lo_minY;
		sendObj.lo_maxX = ameba.lo_maxX;
		sendObj.lo_maxY = ameba.lo_maxY;
		sendObj.lo_midX = ameba.lo_midX;
		sendObj.lo_midY = ameba.lo_midY;
		sendObj.lo_lenX = ameba.lo_lenX;
		sendObj.lo_lenY = ameba.lo_lenY;	
		sendObj[elm].tags = amebas[elm].tags;	

		sendObj.width = ameba.width;
		sendObj.height = ameba.height;

		sendObj.cardType = ameba.cardType;

		sendObj.text = ameba.text;
		sendObj.textSize = ameba.textSize;
		sendObj.textFont = ameba.textFont;
		sendObj.color = ameba.color;

		sendObj.url = ameba.url;
		sendObj.scale = ameba.scale;
		sendObj[elm].weight = amebas[elm].weight;

		sendObj.graphicType = ameba.graphicType;
		sendObj.radious = ameba.radious;

		sendObj.drawFlg = ameba.drawFlg;
	//	self.worker.postMessage(message,sendObj);
		sendObj[elm].datas = amebas[elm].datas;

		callback(sendObj);		
	}
};

AmebaCanvas.prototype.wProcessSendDataWithoutPreRender = function(id,callback){
	var self = this;
	if(self.amebas[id] != undefined){
		var ameba = self.amebas[id];
		var sendObj = {};
		sendObj.id = id;
		sendObj.x = ameba.x;
		sendObj.y = ameba.y;
		sendObj.z = ameba.z;
		sendObj.vX = ameba.vX;
		sendObj.vY = ameba.vY;
		sendObj.aX = ameba.aX;
		sendObj.aY = ameba.aY;
		sendObj.fX = amebas.fX;
		sendObj.fY = amebas.fY;
		sendObj.lo_vX = ameba.lo_vX;
		sendObj.lo_vY = ameba.lo_vY;
		sendObj.lo_minX = ameba.lo_minX;
		sendObj.lo_minY = ameba.lo_minY;
		sendObj.lo_maxX = ameba.lo_maxX;
		sendObj.lo_maxY = ameba.lo_maxY;
		sendObj.lo_midX = ameba.lo_midX;
		sendObj.lo_midY = ameba.lo_midY;
		sendObj.lo_lenX = ameba.lo_lenX;
		sendObj.lo_lenY = ameba.lo_lenY;	
		sendObj[elm].tags = amebas[elm].tags;	

		sendObj.drawFlg = ameba.drawFlg;
		sendObj[elm].weight = amebas[elm].weight;
		sendObj[elm].datas = amebas[elm].datas;

		callback(sendObj);
//		self.worker.postMessage(message,sendObj);
	}
};

AmebaCanvas.prototype.wProcessSendDataWithPreRender = function(message,id){
	var self = this;
	if(self.amebas[id] != undefined){
		sendObj.width = ameba.width;
		sendObj.height = ameba.height;

		sendObj.cardType = ameba.cardType;

		sendObj.text = ameba.text;
		sendObj.textSize = ameba.textSize;
		sendObj.textFont = ameba.textFont;
		sendObj.color = ameba.color;

		sendObj.url = ameba.url;
		sendObj.scale = ameba.scale;

		sendObj.graphicType = ameba.graphicType;
		sendObj.radious = ameba.radious;
		sendObj[elm].weight = amebas[elm].weight;
		sendObj[elm].datas = amebas[elm].datas;

		callback(sendObj);
	//	self.worker.postMessage(message,sendObj);
	}
};

/**
 * Created by masatow on 2016/04/12.
 */
/*************************************************************************
 AmebaCanvas Telepathy Server 対応用コード added by masatow
 *************************************************************************/

AmebaCanvas.prototype.connect = function( option ){

  this.telepathyClient = new TelepathyClient();

  this.host = option.host === undefined ? 'ws://apps.wisdomweb.net:64260/ws/mik' : this.host;

  this.site = option.site === undefined ? 'masatow' : option.site;

  this.token = option.token === undefined ? 'Pad:5538' : option.token;

  this.setTelepathyEvent();

  this.telepathyClient.connect( this.host, this.site, this.token, function (event) {

    console.log('connect:callback', arguments);
  });
};

// テレパシーサーバとの接続が完了した時に
AmebaCanvas.prototype.connected = function () {
  var self = this;
  this.telepathyClient.hello({from: this.id }, function (req, res) {
    console.log('hello:callback', arguments);
    if (res.status == 200) {
      self.heartBeat();
      self.isConnected = true;
      console.log('hello ok');
    }else{
      console.log('hello ng');
    }
  });
  return true;
};
AmebaCanvas.prototype.close = function (){

  this.telepathyClient.bye();
};

AmebaCanvas.prototype.setTelepathyEvent = function(){

  var self = this;

  this.telepathyClient.on('connect',  function(event){
    console.log('connect', arguments);
    self.connected('test');
  });

  this.telepathyClient.on('error', function (event) {
    console.log('error', arguments);
    self.isConnected = false;
  });

  this.telepathyClient.on('close', function (event) {
    console.log('close', arguments);
    self.isConnected = false;
  });

  this.telepathyClient.on('message', function (event) {
    console.log('message', arguments);
    self._receivedSyncMessage( event );
  });

  this.telepathyClient.on('response', function (event) {
    console.log('response', arguments);
  });
};

// AmebaCanvas.js の利用者が，独自にメッセージを送りたい時に用いる
AmebaCanvas.prototype.sendCustomMessage = function( messageBody, callback ){

  this.telepathyClient.send({
    from: this.id,
    site: this.site,
    body: messageBody
  },function( mag ){

    if(typeof callback == 'function'){

      callback(arguments);
    }
  });
};

// AmebaCard の追加・移動・削除 を 共有するためのメッセージを送るのに用いる
AmebaCanvas.prototype._sendMessage = function( messageBody, callback ){

  if( !this.isConnected ) return;
  // console.log( 'messageBody', messageBody,this.telepathyClient );

  this.telepathyClient.send({
    from: this.id,
    site: this.site,
    body: messageBody
  },function( mag ){

    if(typeof callback == 'function'){

      callback(arguments);
    }
  });
};

// AmebaCanvas.js の利用者が，独自にメッセージ受信時の処理を書きたい時に用いる
AmebaCanvas.prototype.receivedCustomMessage = function ( message ){

};

// AmebaCard の追加・移動・削除 を 共有するためのメッセージ受信時の処理
AmebaCanvas.prototype._receivedSyncMessage = function ( message ) {

  var body = message['body'];

  if ( !this.isAmebaCanvasMessageBody( body ) ) return;

  if ( this.syncId != body['syncAmebaCanvasId'] ) return;

  if ( this.id == body['sender'] ) return;

  this._switchingMessageBody( body );

  this.receivedCustomMessage( message );
};

AmebaCanvas.prototype._switchingMessageBody = function ( body ) {

  var self = this;

  switch ( body['command'] ){
    // 'addedAmebaSync' と 'removedAmebaSync' と 'amebaMoveToSync' は 結局やること同じなので break させずに case 'amebaMoveToSync': に任せる．
    case 'addedAmebaSync':

    case 'removedAmebaSync':

    case 'amebaMoveToSync':

    case 'syncAmebaCanvas':

      this.zOrder = body['zOrder'];

      var keys = Object.keys( body['amebas'] );

      keys.forEach(function( key, index){

        var ameba = new AmebaCard( body['amebas'][key] );

        ameba.department = self;

        self.amebas[key] = ameba;

        self.amebas[key].preRender();
      });

      break;
    case 'amebaMouseDownSync':
      break;
    case 'amebaMouseUpSync':
      break;
    case 'amebaMouseLeaveSync':
      break;
    case 'amebaClickSync':
      break;
    default :
      break;
  }
};

// AmebaCanvas用のmessageBodyかどうかチェック 未完成
AmebaCanvas.prototype.isAmebaCanvasMessageBody = function ( body ) {

  if( body.sender  === undefined ) return false;
  if( body.command === undefined ) return false;

  return true;
};

AmebaCanvas.prototype.heartBeat = function () {
  var obj = this.telepathyClient;
  setInterval(function(){
    obj.send({});
    console.log('heartBeat');
  },30000);
};

AmebaCanvas.prototype.syncAmebaCanvas = function ( self ) {

  var sendAmebasData = generateSendAmebasData( self.amebas );

  var messageBody = {
    'sender' : self.id,
    'command': 'syncAmebaCanvas',
    'amebaId': '',
    'syncAmebaCanvasId' : self.syncId,
    'x'      : '',
    'y'      : '',
    'amebas' : sendAmebasData,
    'zOrder' : self.zOrder
  };

  self._sendMessage(messageBody);
};
/*************************************************************************
便利メソッド群
*************************************************************************/

var generateRandomID = function(){
	return String(Math.random().toString(36).slice(-8));
};


var generateRandomInt = function(min,max){
	return Math.floor( Math.random() * (max - min + 1) ) + min;
};

var generateSendAmebasData = function ( amebas ){

	var sendAmebasData = {};

	var keys = Object.keys( amebas );

	keys.forEach(function( key, index){

		sendAmebasData[key] = generateJSONfromAmeba( amebas[key] );
	});

	return sendAmebasData;
};

var generateJSONfromAmeba = function ( ameba ){

  if ( ameba === undefined ) ameba = {};

  var json = {};

  json.id = ameba.id === undefined ? generateRandomID() : ameba.id;
  json.cardType = ameba.cardType === undefined ? "graphic" : ameba.cardType;
  json.weight = ameba.weight === undefined ? 0 : ameba.weight;
  json.name = ameba.name === undefined ? generateRandomID() : ameba.name;
  // json.department = ameba.department === undefined ? null : ameba.department;
  json.tags = ameba.tags === undefined ? [] : ameba.tags;
  // //当たり判定
  json.collisionType = ameba.collisionType === undefined ? "rect" : ameba.collisionType;
  json.width = ameba.width === undefined ? 100 : ameba.width;
  json.height = ameba.height === undefined ? 100 : ameba.height;
  json.x = ameba.x === undefined ? generateRandomInt(0,json.width) : ameba.x;
  json.y = ameba.y === undefined ? generateRandomInt(0,json.height) : ameba.y;
  // json.z = 0;
  // //プリレンダリング
  // //テキスト
  json.text = ameba.text === undefined ? "honahona" : ameba.text;
  json.textSize = ameba.textSize === undefined ? "15px" : ameba.textSize;
  json.color = ameba.color === undefined ? "black" : ameba.color;
  json.textFont = ameba.textFont === undefined ? "Century Gothic" : ameba.textFont;
  // //イメージ
  json.url = ameba.url === undefined ? "" : ameba.url;
  json.scale = ameba.scale === undefined ? 1.0 : ameba.scale;
  // json.img = ameba.img === undefined ? null : ameba.img;
	json.img = null;
		
  // //グラフィック TODO
  json.graphicType = ameba.graphicType === undefined ? "rect" : ameba.graphicType;
  json.radious = ameba.radious === undefined ? 50 : ameba.radious;
  //
  // //クリック箇所
  json.clickX = ameba.clickX === undefined ? 0 : ameba.clickX;
  json.clickY = ameba.clickY === undefined ? 0 : ameba.clickY;

  return json;
};

/*
 *  AmebaCardへの操作イベントハンドラ added by masatow
 * */
AmebaCanvas.prototype.addedAmeba = function( ameba ){
  console.log('default addedAmeba', ameba);
};
AmebaCanvas.prototype._addedAmebaSync = function( ameba ){

	var sendAmebasData = generateSendAmebasData( this.amebas );

  // var json = generateJSONfromAmeba(ameba);
  var messageBody = {
    'sender' : this.id,
    'command': 'addedAmebaSync',
    'amebaId': ameba.id,
    'syncAmebaCanvasId' : this.syncId,
    'x'      : '',
    'y'      : '',
		'amebas' : sendAmebasData,
		'zOrder' : this.zOrder
    // 'ameba'  : JSON.stringify(json)
  };

	console.log('sendAmebasData', sendAmebasData);

	this._sendMessage(messageBody);
};

/*
*  Canvas上でのマウスイベントハンドラ added by masatow
* */
AmebaCanvas.prototype.amebaMouseDown = function( amebaId ){
  console.log('default amebaMouseDown');
};
AmebaCanvas.prototype._amebaMouseDownSync = function( amebaId ){
  var messageBody = {
    'sender' : this.id,
    'command': 'amebaMouseDownSync',
    'amebaId': amebaId,
    'syncAmebaCanvasId' : this.syncId,
    'x'      : '',
    'y'      : '',
    'ameba'  : ''
  };
  this._sendMessage(messageBody);
};
AmebaCanvas.prototype.amebaMoveTo = function( amebaId ){
  console.log('default amebaMoveTo');
};

AmebaCanvas.prototype._amebaMoveToSync = function( amebaId, x, y ){

	var sendAmebasData = generateSendAmebasData( this.amebas );

  var messageBody = {
    'sender' : this.id,
    'command': 'amebaMoveToSync',
    'amebaId': amebaId,
    'syncAmebaCanvasId' : this.syncId,
		'x'      : x,
		'y'      : y,
		'clickX' : this.amebas[amebaId].clickX,
		'clickY' : this.amebas[amebaId].clickY,
		'ameba'  : '',
		'amebas' : sendAmebasData,
		'zOrder' : this.zOrder
  };

	console.log('sendAmebasData', sendAmebasData);

  this._sendMessage(messageBody);
};
AmebaCanvas.prototype.amebaMouseUp = function( amebaId ){
  console.log('default amebaMouseUp');
};
AmebaCanvas.prototype._amebaMouseUpSync = function( amebaId, x, y ){
  var messageBody = {
    'sender' : this.id,
    'command': 'amebaMouseUpSync',
    'amebaId': amebaId,
    'syncAmebaCanvasId' : this.syncId,
    'x'      : x,
    'y'      : y,
    'ameba'  : ''
  };
  this._sendMessage(messageBody);
};
AmebaCanvas.prototype.amebaMouseLeave = function( amebaId ){
  console.log('default amebaMouseLeave');
};
AmebaCanvas.prototype._amebaMouseLeaveSync = function( amebaId, x, y ){
  var messageBody = {
    'sender' : this.id,
    'command': 'amebaMouseLeaveSync',
    'amebaId': amebaId,
    'syncAmebaCanvasId' : this.syncId,
    'x'      : x,
    'y'      : y,
    'ameba'  : ''
  };
  this._sendMessage(messageBody);
};
AmebaCanvas.prototype.amebaClick = function( amebaId ){
  console.log('default amebaClick');
};
AmebaCanvas.prototype._amebaClickSync = function( amebaId ){
  var messageBody = {
    'sender' : this.id,
    'command': 'amebaClickSync',
    'amebaId': amebaId,
    'syncAmebaCanvasId' : this.syncId,
    'x'      : '',
    'y'      : '',
    'ameba'  : ''
  };
  this._sendMessage(messageBody);
};












/*************************************************************************


*************************************************************************/

/*
	テストコード
 */




// var ameba4 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:100,y:100,color:"blue"});
// ameba4.addTag("blue");
// //ameba4.changeDrawFlg();
// //ameba4.drawFlg = false;
// amebaCanvas.addCard(ameba4);

// var ameba6 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:400,y:400,color:"blue"});
// ameba6.addTag("blue");
// amebaCanvas.addCard(ameba6);
// var ameba7 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:200,y:200,color:"blue"});
// ameba7.addTag("blue");
// amebaCanvas.addCard(ameba7);
// var ameba8 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:400,y:100,color:"blue"});
// ameba8.addTag("blue");
// amebaCanvas.addCard(ameba8);

// var ameba9 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:400,y:150,color:"blue"});
// ameba9.addTag("blue");
// amebaCanvas.addCard(ameba9);
// var ameba81 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:0,y:0,color:"blue"});
// ameba81.addTag("blue");
// amebaCanvas.addCard(ameba81);
// var ameba82 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:100,y:600,color:"blue"});
// ameba82.addTag("blue");
// amebaCanvas.addCard(ameba82);

// var ameba83 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:300,y:100,color:"blue"});
// ameba83.addTag("blue");
// amebaCanvas.addCard(ameba83);
// var ameba84 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:700,y:700,color:"blue"});
// ameba84.addTag("blue");
// amebaCanvas.addCard(ameba84);
// var ameba85 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:300,y:800,color:"blue"});
// ameba85.addTag("blue");
// amebaCanvas.addCard(ameba85);





// var ameba5 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:100,y:100,color:"green"});
// ameba5.addTag("blue");
// ameba5.addTag("red");
// amebaCanvas.addCard(ameba5);


function clickAddImage(){
	var ameba1 = new AmebaCard({url:"yjimage.png",cardType:"image",x:0,y:0,scale:2.0});
	ameba1.setOnMouseEventListener("dblclick",function(e){
	console.log("image");
	}); 
	amebaCanvas.addCard(ameba1);
}
function clickAddRect(){
	var ameba3 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:100,y:100,color:"red"});
	ameba3.addTag('red');
	amebaCanvas.addCard(ameba3);
	//console.log(ameba3.isCollision(0,100,130,50));
}

function clickConnect(){
	amebaCanvas.connect({
  	host: this.host,
 	site: this.site,
 	token: this.token
 	});
	 var messageBody = {
      'sender' : amebaCanvas.id,
      'command': 'syncTrumpIDArray',
      'ameba'  : '',
      'amebaId': '',
      'x'      : '',
      'y'      : '',
      'trumpIDArray' : trumpIDArray,
      'syncAmebaCanvasId' : amebaCanvas.syncId
    };

    amebaCanvas.sendCustomMessage( messageBody, function(){

      for(var i = 0; i < 52; i++){

        console.log( 120*(i / 14), (i / 14));

        var trumpCard = new AmebaCard({
          id      : 'trump'+i,
          url     : 'images/trump/back.png',
          cardType: 'image',
          x       : 80*(i % 13) + 10,
          y       : 120*Math.floor(i / 13) + 30,
          width   : 80,
          height  : 120,
          scale   : 0.4
        });

        trumpCard.addTag('back');

        amebaCanvas.addCard(trumpCard);
      }
    });

};

function clickAddBlackHole(){
	var ameba = new AmebaCard({cardType:"cluster"});
	ameba.addTag(document.getElementById("inputTag").value);
	amebaCanvas.addCard(ameba);
	//TODO
	//ブラックホールカード
	//.addCard()処理分岐->繰り返し計算処理イベント
	//.同じタグを持つやつに対して移動イベントを発生させる

}


function clickChangeEventSetDrag(){
	amebaCanvas.setDragEventListener();
}

