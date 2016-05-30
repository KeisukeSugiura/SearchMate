/**
 * アメーバキャンバス（描画キャンバス）
 * @param {[type]} option [description]
 */
var FRAME_PER_SEC = 60; // [frames/s]
var FRAME_TIME    = 16; // [ms/frame]
var AmebaCanvas = function(option){
	var self = this;
	option = option === undefined ? {} : option;
	this.id = option.id === undefined ? generateRandomID() : option.id; 
	this.width = option.width === undefined ? 1000 : option.width;
	this.height = option.height === undefined ? 1000 : option.height;
	
	//this.canvas = document.getElementById(this.id) === null ? (function(id){var elem = document.createElement("canvas"); elem.setAttribute("id",id); return elem;}(this.id)) : document.getElementById(this.id);
	// this.x = option.x === undefined ? (function(style){return style.left === "" ? 0 : parseFloat(style.left);}(this.canvas.style)) : option.x;
	// this.y = option.y === undefined ? (function(style){return style.top === "" ? 0 : parseFloat(style.top);}(this.canvas.style)) : option.y;
	//this.canvas.style.position = "absolute";
	//this.canvas.style.top ="30px";
	//this.canvas.style.left = "0px";
	// this.canvas.style.zIndex=10;
	// this.canvas.style.top =this.y+"px";
	// this.canvas.style.left = this.x+"px";
	// this.ctx = this.canvas.getContext("2d");

	//console.log(this.ctx);
	//描画オブジェクトの蓄積
	this.amebas = {};
	this.zOrder = [];
	this.render = {};//render target key-value
	this.updates = {};

	// this.layers = {
	// 	layer0:self.createLayer(0)
	// };

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
	//this.setEventListener();

//	this.initWebWorker('/javascripts/AmebaCanvasWebWorker.js');

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
	this.timer = Date.now();


	// this.startAnimation(this);

	// window.onunload = function() {
	// 	self.stopAnimation();
	// };

};
AmebaCanvas.prototype.MOUSEEVENTTYPE = ["click","mousedown","mousemove","mouseup","dblclick","mouseover","mouseenter","mouseleave","mouseout","show","contextmenu"];

AmebaCanvas.prototype.startAnimation = function(client){
	 var self = this;

	// //self.drawAmebas(self); 	// this.animationId = setInterval(function(){self.drawAmebas(self)},1);

	// self.currentFrame++;

	// if( self.currentFrame >= self.animationKeyFrame ){

	// 	//console.log('syncAmebaCanvas', this.id, this.syncId);

	// 	//self.syncAmebaCanvas(self);

	// 	self.currentFrame = 0;
	// }

//	self.drawAnimation = requestAnimationFrame( function () {
		// self.wProcessSendAllDatasWithoutPreRender(function(sendObj){
		// 	console.log('update');
		// 	self.worker.postMessage(
		// 		{act:'updatePositionWithClustering',
		// 		data:{
		// 			canvas:{width:self.width,height:self.height,zOrder:self.zOrder},
		// 			amebas:sendObj
		// 			}
		// 		});
		// });
	//	self.drawAmebas(self);
	//		self.startAnimation();
//	});
//	
	 // var now = Date.now();
	 //  if (now - self.timer > FRAME_TIME) {
	 //    console.log(now);
	 //    self.timer = now;
	 //  }
	 //  
	 //  
      setInterval(function() {
		self.updatePositionsWithClustering();
        self.wProcessSendAllDatas(function(obj){
          client.emit('autoUpdateWithCluster',obj);
          client.broadcast.emit('autoUpdateWithCluster',obj);
          //console.log('update');
          });
        }, FRAME_TIME);
  
	  
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





/*


 */


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

	//this.divideLayer(id);


	//console.log(this.renderEndTime - this.renderStartTime);
	//var renderTime = self.drawAmebas(self);
	//console.log(renderTime);
	//this.renderStartTime = new Date();
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
		sendObj[elm].datas = amebas[elm].datas;

		sendObj[elm].drawFlg = amebas[elm].drawFlg;
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
		sendObj[elm].datas = amebas[elm].datas;
		sendObj[elm].cardType = amebas[elm].cardType;

		sendObj[elm].cx = amebas[elm].cx;
		sendObj[elm].cy = amebas[elm].cy;
		sendObj[elm].circle = amebas[elm].circle;
		sendObj[elm].radian = amebas[elm].radian;
		sendObj[elm].radious = amebas[elm].radious;
			
	});
	callback(sendObj);
//	self.worker.postMessage(message,sendObj);
};

AmebaCanvas.prototype.wProcessSendAllDatasWithPreRender = function(callback){
	var self = this;
	var amebas = self.amebas;
	var sendObj = {};

	if(self.amebas != undefined){
	Object.keys(amebas).forEach(function(elm,index){
		sendObj[elm] = {};
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

		sendObj[elm].datas = amebas[elm].datas;

		sendObj[elm].graphicType = amebas[elm].graphicType;
		sendObj[elm].radious = amebas[elm].radious;

	});
	}
		callback(sendObj);
//	self.worker.postMessage(message,sendObj);
};


AmebaCanvas.prototype.wProcessSendData = function(id,callback){
	var self = this;
	if(self.amebas[id] != undefined){
		var ameba = self.amebas[id];
		var sendObj = {};
		sendObj.id = ameba.id;
		sendObj.x = ameba.x;
		sendObj.y = ameba.y;
		sendObj.z = ameba.z;
		sendObj.vX = ameba.vX;
		sendObj.vY = ameba.vY;
		sendObj.aX = ameba.aX;
		sendObj.aY = ameba.aY;
		sendObj.fX = ameba.fX;
		sendObj.fY = ameba.fY;
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
		sendObj.tags = ameba.tags;	

		sendObj.width = ameba.width;
		sendObj.height = ameba.height;

		sendObj.cardType = ameba.cardType;

		sendObj.text = ameba.text;
		sendObj.textSize = ameba.textSize;
		sendObj.textFont = ameba.textFont;
		sendObj.color = ameba.color;

		sendObj.url = ameba.url;
		sendObj.scale = ameba.scale;
		sendObj.weight = ameba.weight;

		sendObj.graphicType = ameba.graphicType;
		sendObj.radious = ameba.radious;
		sendObj.datas = ameba.datas;

		sendObj.drawFlg = ameba.drawFlg;
	//	self.worker.postMessage(message,sendObj);

		callback(sendObj);		
	}
};

AmebaCanvas.prototype.wProcessSendDataWithoutPreRender = function(id,callback){
	var self = this;
	if(self.amebas[id] != undefined){
		var ameba = self.amebas[id];
		var sendObj = {};
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
		sendObj.tags = ameba.tags;	
		sendObj.datas = ameba.datas;

		sendObj.drawFlg = ameba.drawFlg;
		sendObj.weight = amebas[elm].weight;

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
		sendObj.datas = ameba.datas;

		sendObj.graphicType = ameba.graphicType;
		sendObj.radious = ameba.radious;
		sendObj.weight = ameba.weight;

		callback(sendObj);
	//	self.worker.postMessage(message,sendObj);
	}
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




module.exports = AmebaCanvas;