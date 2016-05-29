//importScripts("Telepathy-client/telepathy-client.js");
//importScripts("Telepathy-client/lib/bson/bson.js");
//importScripts("Telepathy-client/lib/crypto-js/md5.js");
//importScripts("Telepathy-client/lib/EventEmitter/EventEmitter.js");
//importScripts("Telepathy-client/lib/node-uuid/uuid.js");

self.addEventListener('message',function(e){
	/*
		data={
			act:処理名
			sync:true or false 同期するかどうかフラグ
			data:送られてきたオブジェクト
		}
	*/
	var data = e.data;
	switch(data.act){
		case 'stop' :
			self.close();
			break;
		case 'console' :
			var sendObj = {
				act : 'console',
				data:data
			};
			self.postMessage(sendObj);
			break;
		case 'updatePositionWithClustering' :
			updatePositionsWithClustering(data.data,function(result){
				//if(sync){
					//同期送信処理
				//}
				self.postMessage({act:'updateAmebas',data:result});
			});
			break;

		default :
			var sendObj = {
				act : 'console',
				data : 'not exist this command'
			};
			self.postMessage(sendObj);
			break;
	}
});




var updatePositionsWithClustering = function(data,callback){

	//var self = this;
	var W = data.canvas.width;
	var H = data.canvas.height;

	var N = Object.keys(data.amebas).length;
	var G = 1;
	var vlimit = 2.0;
	var amList = data.canvas.zOrder;

	var tagList = [];
	amList.forEach(function(elm,index){
		if(data.amebas[elm].cardType == "cluster"){
			Array.prototype.push.apply(tagList,data.amebas[elm].tags);
		}
	});

	var hasTag = function(ameba,tag){
		var search = ameba.tags.indexOf(tag);
		  if(search == -1) {    
		    return false;
		  } else {
		    return true;
		  }
		return true;
	};

	//console.log(tagList);
	tagList.forEach(function(tag,index){
		amList.forEach(function(elm,index){
			data.amebas[elm].midX = data.amebas[elm].x;
			data.amebas[elm].lenX = data.amebas[elm].width;
			data.amebas[elm].minX = data.amebas[elm].midX - data.amebas[elm].lenX / 2;
			data.amebas[elm].maxX = data.amebas[elm].midX + data.amebas[elm].lenX / 2;
			data.amebas[elm].midY = data.amebas[elm].y;
			data.amebas[elm].lenY = data.amebas[elm].height;
			data.amebas[elm].minY = data.amebas[elm].midY - data.amebas[elm].lenY / 2;
			data.amebas[elm].maxY = data.amebas[elm].midY + data.amebas[elm].lenY / 2;
			
			if (data.amebas[elm].cardType != "cluster") {
				data.amebas[elm].weight = data.amebas[elm].lenX * data.amebas[elm].lenY; //重さ
			}

			data.amebas[elm].fX = 0;
			data.amebas[elm].fY = 0;
			data.amebas[elm].hitcount = 0;
		});
			var N = amList.length;
		for (var i = 0; i <= N - 2; i++) {
			for (var j = i + 1; j <= N - 1; j++) {
				if (!(hasTag(data.amebas[amList[i]],tag) && hasTag(data.amebas[amList[j]],tag))) continue;
				var dX = data.amebas[amList[i]].midX - data.amebas[amList[j]].midX;
				var dY = data.amebas[amList[i]].midY - data.amebas[amList[j]].midY;
				var dXdX = dX * dX;
				var dYdY = dY * dY;
				var dRdR = dXdX + dYdY;
				var dR = Math.max(1, Math.sqrt(dRdR));
				var dD = Math.atan2(dY, dX);
				var udX = dX / dR;
				var udY = dY / dR;
				var fX = ((G * data.amebas[amList[i]].weight * data.amebas[amList[j]].weight) / (dRdR)) * udX;
				var fY = ((G * data.amebas[amList[i]].weight * data.amebas[amList[j]].weight) / (dRdR)) * udY;
				var sX = (data.amebas[amList[i]].maxX < data.amebas[amList[j]].maxX ? data.amebas[amList[i]].maxX : data.amebas[amList[j]].maxX) - (data.amebas[amList[i]].minX > data.amebas[amList[j]].minX ? data.amebas[amList[i]].minX : data.amebas[amList[j]].minX);
				var sY = (data.amebas[amList[i]].maxY < data.amebas[amList[j]].maxY ? data.amebas[amList[i]].maxY : data.amebas[amList[j]].maxY) - (data.amebas[amList[i]].minY > data.amebas[amList[j]].minY ? data.amebas[amList[i]].minY : data.amebas[amList[j]].minY);
				var s = (sX > 0 ? sX : 0) * (sY > 0 ? sY : 0);
				var hit = (s > 0);
					var mag = ((data.amebas[amList[i]].cardType == "cluster" || data.amebas[amList[j]].cardType == "cluster") && (hasTag(data.amebas[amList[i]],tag) && hasTag(data.amebas[amList[j]],tag)) ? -1 : 0);
					//console.log("mag : "+ mag);
					if (dR < data.amebas[amList[i]].lenX * 2) {
						

						// if(data.amebas[amList[i]].cardType != "cluster"){
						// 	if(data.amebas[amList[i]].circle){

						// 	}else{

						// 	data.amebas[amList[i]].circle = true;
						// 	data.amebas[amList[i]].radian =  Math.asin(dYdY / dRdR);
						// 	data.amebas[amList[i]].radious = dR;
						// 	data.amebas[amList[i]].cx = data.amebas[amList[j]].x;
						// 	data.amebas[amList[i]].cy = data.amebas[amList[j]].y;
						// 	console.log('circld');	
						// 	}
						// }
						data.amebas[amList[i]].fX += mag * fX;
						data.amebas[amList[i]].fY += mag * fY;
						data.amebas[amList[j]].fX -= mag * fX;
						data.amebas[amList[j]].fY -= mag * fY;
					} else {
						//data.amebas[amList[i]].circle = false;

						data.amebas[amList[i]].fX -= mag * fX;
						data.amebas[amList[i]].fY -= mag * fY;
						data.amebas[amList[j]].fX += mag * fX;
						data.amebas[amList[j]].fY += mag * fY;
					}

					if (data.amebas[amList[i]].cardType != "cluster" && data.amebas[amList[j]].cardType != "cluster") {
						if (hit) {
							var mag = -1;
							data.amebas[amList[i]].fX -= mag * fX;
							data.amebas[amList[i]].fY -= mag * fY;
							data.amebas[amList[j]].fX += mag * fX;
							data.amebas[amList[j]].fY += mag * fY;
						}
					}
			}
		}
		for (var i = 0; i <= N - 1; i++) {
			//jissiai no atai henkou 
		//	if(!data.amebas[amList[i]].circle){

				if (data.amebas[amList[i]].width < 1) data.amebas[amList[i]].width = 1;
				if (data.amebas[amList[i]].height < 1) data.amebas[amList[i]].height = 1; 
				data.amebas[amList[i]].aX = data.amebas[amList[i]].fX / data.amebas[amList[i]].weight;
				data.amebas[amList[i]].aY = data.amebas[amList[i]].fY / data.amebas[amList[i]].weight;
				data.amebas[amList[i]].vX += data.amebas[amList[i]].aX;
				data.amebas[amList[i]].vY += data.amebas[amList[i]].aY;
				data.amebas[amList[i]].vX = Math.max(-vlimit, Math.min(+vlimit, data.amebas[amList[i]].vX));
				data.amebas[amList[i]].vY = Math.max(-vlimit, Math.min(+vlimit, data.amebas[amList[i]].vY));
			
				if (data.amebas[amList[i]].cardType != "cluster" && hasTag(data.amebas[amList[i]],tag)) {
					 //data.amebas[amList[i]].setPosition(data.amebas[amList[i]].x+data.amebas[amList[i]].vX,data.amebas[amList[i]].y+data.amebas[amList[i]].vY);
					data.amebas[amList[i]].x = data.amebas[amList[i]].x+data.amebas[amList[i]].vX;
					data.amebas[amList[i]].y = data.amebas[amList[i]].y+data.amebas[amList[i]].vY;
				}
				//壁当たり判定
				if (data.amebas[amList[i]].x < 0) { data.amebas[amList[i]].x = 0; data.amebas[amList[i]].vX *= -1;}
				if (data.amebas[amList[i]].x + data.amebas[amList[i]].width > W) { data.amebas[amList[i]].x = W - data.amebas[amList[i]].width; data.amebas[amList[i]].vX *= -1;}
				if (data.amebas[amList[i]].y < 0) { data.amebas[amList[i]].y = 0; data.amebas[amList[i]].vY *= -1;}
				if (data.amebas[amList[i]].y + data.amebas[amList[i]].height > H) { data.amebas[amList[i]].y = H - data.amebas[amList[i]].height; data.amebas[amList[i]].vY *= -1;}
				data.amebas[amList[i]].midX = data.amebas[amList[i]].x;
				data.amebas[amList[i]].lenX = data.amebas[amList[i]].width;
				data.amebas[amList[i]].minX = data.amebas[amList[i]].midX - data.amebas[amList[i]].lenX / 2;
				data.amebas[amList[i]].maxX = data.amebas[amList[i]].midX + data.amebas[amList[i]].lenX / 2;
				data.amebas[amList[i]].midY = data.amebas[amList[i]].y;
				data.amebas[amList[i]].lenY = data.amebas[amList[i]].height;
				data.amebas[amList[i]].minY = data.amebas[amList[i]].midY - data.amebas[amList[i]].lenY / 2;
				data.amebas[amList[i]].maxY = data.amebas[amList[i]].midY + data.amebas[amList[i]].lenY / 2;
				if (data.amebas[amList[i]].cardType != "cluster") {
					data.amebas[amList[i]].weight = data.amebas[amList[i]].lenX * data.amebas[amList[i]].lenY;
				}

				var alpha = 0.05;
				data.amebas[amList[i]].lo_vX += (data.amebas[amList[i]].vX - data.amebas[amList[i]].lo_vX) * alpha;
				data.amebas[amList[i]].lo_vY += (data.amebas[amList[i]].vY - data.amebas[amList[i]].lo_vY) * alpha;
				data.amebas[amList[i]].lo_minX += (data.amebas[amList[i]].minX - data.amebas[amList[i]].lo_minX) * alpha;
				data.amebas[amList[i]].lo_minY += (data.amebas[amList[i]].minY - data.amebas[amList[i]].lo_minY) * alpha;
				data.amebas[amList[i]].lo_maxX += (data.amebas[amList[i]].maxX - data.amebas[amList[i]].lo_maxX) * alpha;
				data.amebas[amList[i]].lo_maxY += (data.amebas[amList[i]].maxY - data.amebas[amList[i]].lo_maxY) * alpha;
				data.amebas[amList[i]].lo_midX += (data.amebas[amList[i]].midX - data.amebas[amList[i]].lo_midX) * alpha;
				data.amebas[amList[i]].lo_midY += (data.amebas[amList[i]].midY - data.amebas[amList[i]].lo_midY) * alpha;
				data.amebas[amList[i]].lo_lenX += (data.amebas[amList[i]].lenX - data.amebas[amList[i]].lo_lenX) * alpha;
				data.amebas[amList[i]].lo_lenY += (data.amebas[amList[i]].lenY - data.amebas[amList[i]].lo_lenY) * alpha;
			// }else{
			// 	//enidou
			// 	console.log("");
			// 	data.amebas[amList[i]].x = data.amebas[amList[i]].cx+data.amebas[amList[i]].radious*Math.cos(data.amebas[amList[i]].radian);
			// 	data.amebas[amList[i]].y = data.amebas[amList[i]].cy+data.amebas[amList[i]].radious*Math.sin(data.amebas[amList[i]].radian)/2
			// 	//this._xscale = this._yscale=this._alpha=this._y;
			// 	//degree += 5;
			// 	data.amebas[amList[i]].radian +=1;
			// }
		}
	});
	callback(data.amebas);

};