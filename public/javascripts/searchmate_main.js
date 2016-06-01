

var socket = new io.connect('http://133.68.112.180:50000');
var query_box = document.getElementById('query');


var amebaCanvas = new AmebaCanvas({id:"monkeypark",width:1920,height:1080});

// var amebaBH = new AmebaCard({cardType:"cluster",text:"opacity",color:"white",textSize:"50px",x:300,y:500});
// var ameba3 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:100,y:100,color:"red"});
// amebaBH.addTag("red");
// ameba3.addTag("red");
// ameba3.setOnMouseEventListener('mouseover',function(e,card){
// 	console.log('mouseover');
// });
// ameba3.setOnMouseEventListener('mouseleave',function(e,card){
// 	console.log('mouseleave');
// });
// ameba3.setOnMouseEventListener('mousemove',function(e,card){
// 	console.log('mousemove');
// });
// amebaCanvas.addCard(amebaBH);
// amebaCanvas.addCard(ameba3);

// var ameba4 = new AmebaCard({cardType:"graphic",graphicType:"rect",x:201,y:100,color:"blue"});
// ameba4.addTag("blue");
// ameba4.addTag("red");
// amebaCanvas.addCard(ameba4);

// var amebaBH2 = new AmebaCard({cardType:"cluster",text:"blue",color:"white",textSize:"50px",x:700,y:500});
// amebaBH2.addTag("blue");
//amebaCanvas.addCard(amebaBH2);






var search_for = function (e) {
    if (e.keyCode == 13) {
        blurflg = false;
        query_word = query_box.value;
        query_box.value = "";
        if (query_word != null && query_word != "") {
            
            var reg1 = /.*git/;
            var reg2 = /http.*/;
            var reg3 = /query:(.*)/;
            if(reg1.test(query_word)){
                socket.emit('join',{});
            }else if(reg2.test(query_word)){
                socket.emit('webshot',{url:query_word});
            }else if(reg3.test(query_word)){
                var match = query_word.match(reg3);
                console.log(match[1]);
                socket.emit('query',{query:match[1],count:10});
           }else{
                socket.emit('snipet',{str:query_word});
            }


           // socket.emit('query', {query: query_word, count: 10});


            console.log(query_word);
        }
    }
}


query_box.addEventListener('keydown',function(event) {
	/* Act on the event */
	search_for(event);
});
query_box.addEventListener('focus',function(event){
        var div = document.getElementById("preview");
        var h1 = document.getElementById("prev-title");
        var h4 = document.getElementById("prev-url");
        var p = document.getElementById("prev-sunipet");
        var image = document.getElementById("prev-image");
        h1.innerHTML = "";
        h4.innerHTML = "";
        p.innerHTML = "";
        image.src = null;
});









/*
socket.io
 */



socket.on('initialize',function(message){
    // var amebaFavoriteCard = new AmebaCard({cardType:"cluster",url:"./images/favorite.png",text:"favorite",x:0,y:984});
    //     amebaFavoriteCard.addTag("favorite");
    //     amebaFavoriteCard.addTag("_control");
    //     amebaFavoriteCard.width=96;
    //     amebaFavoriteCard.height=96;
    //     amebaFavoriteCard.preRenderCanvas = null;
    //     amebaFavoriteCard.grobalAlpha=0.8;
    //     amebaFavoriteCard.preRenderCanvas = amebaFavoriteCard.renderImage();
    //     amebaFavoriteCard.setOnMouseEventListener('dblclick',function(e,card){
    //         var targetCardId = card.department.focusCard;
    //         console.log(targetCardId);
    //         var targetCard = card.department.amebas[targetCardId];
    //         targetCard.changeTagSet('favorite');
    //     });
    //     amebaCanvas.addCard(amebaFavoriteCard);

    //     var amebaSyncCard = new AmebaCard({cardType:"cluster",url:"./images/sync.png",text:"sync",x:0,y:0});
    //     amebaSyncCard.addTag("sync");
    //     amebaSyncCard.addTag("_control");
    //     amebaSyncCard.width=96;
    //     amebaSyncCard.height=96;
    //     amebaSyncCard.preRenderCanvas = null;
    //     amebaSyncCard.grobalAlpha=0.8;
    //     amebaSyncCard.preRenderCanvas = amebaSyncCard.renderImage();
    //     amebaSyncCard.setOnMouseEventListener('dblclick',function(e,card){
    //         var targetCardId = card.department.focusCard;
    //         var targetCard = card.department.amebas[targetCardId];
    //         targetCard.changeTagSet('sync');
    //     });
    //     amebaCanvas.addCard(amebaSyncCard);

    //     var amebaDeleteCard = new AmebaCard({cardType:"cluster",url:"./images/delete.png",text:"Delete",x:0,y:492});
    //     amebaDeleteCard.addTag("delete");
    //     amebaDeleteCard.addTag("_control");
    //     amebaDeleteCard.width=96;
    //     amebaDeleteCard.height=96;
    //     amebaDeleteCard.preRenderCanvas = null;
    //     amebaDeleteCard.grobalAlpha=0.8;
    //     amebaDeleteCard.preRenderCanvas = amebaDeleteCard.renderImage();
    //     amebaDeleteCard.setOnMouseEventListener('dblclick',function(e,card){
    //         var targetCardId = card.department.focusCard;
    //         card.department.removeAmeba(targetCardId);
    //     });
    //     amebaCanvas.addCard(amebaDeleteCard);


         var initVirtual = function(){
            console.log("aaa");
                 amebaCanvas.startAnimation(socket);
            amebaCanvas.wProcessSendAllDatas(function(data){
                socket.emit('initialize',data);
            });
        };
    $.ajax({
      type: 'GET',
      url: 'https://api.github.com/repos/KeisukeSugiura/SearchMate/branches',
      dataType: 'json',
      success: function(json){
        var count =0;
        console.log(json);
        // var len = json.length;
        // for(var i=0; i < len; i++){
        //   $("#a").append(json[i].version + ' ' + json[i].codename + '<br>');
        // }
        json.forEach(function(elm,index){
            var amebaBranchCard = new AmebaCard({cardType:"cluster",text:elm.name,textSize:"50px",color:'white',x:960-(index-1)*480,y:300});
            amebaBranchCard.addTag(elm.name);
            console.log(elm.commit.url);
            amebaBranchCard.datas['url'] = elm.commit.url;
           // amebaDeleteCard.datas['name'] = elm.name;
            amebaBranchCard.datas['branch']= elm.name;
            amebaBranchCard.addTag("_control");
           // amebaDeleteCard.width=96;
            //amebaDeleteCard.height=96;
           // amebaDeleteCard.preRenderCanvas = null;
            amebaBranchCard.grobalAlpha=0.8;
           // amebaDeleteCard.preRenderCanvas = amebaDeleteCard.renderImage();
            amebaBranchCard.setOnMouseEventListener('dblclick',function(e,card){
                //var targetCardId = card.department.focusCard;
                //card.department.removeAmeba(targetCardId);
                //mokkai ajax
                //とりあえず最新
                
                $.ajax({
                  type: 'GET',
                  url: String(elm.commit.url),
                  dataType: 'json',
                  beforeSend:function(req){
                    //console.log(req);
                  },
                  success: function(json2){
                    console.log(json2);
                    // var len = json.length;
                    // for(var i=0; i < len; i++){
                    //   $("#a").append(json[i].version + ' ' + json[i].codename + '<br>');
                    // }
                    
                    var name = json2.commit.author.name;
                    var message = json2.commit.message;
                    var url = json2['html_url'];
                    var branch = amebaBranchCard.datas['branch'];
                    var x = amebaBranchCard.x;
                    var y = amebaBranchCard.y;
                    createPopupBranchCard({x:x,y:y,branchs:[{name:name,message:message,url:url,branch:branch}]});
                    
                    }
                });

            });

            amebaCanvas.addCard(amebaBranchCard);
            count++;
                    console.log(count);
                    console.log(json.length);
                    if(count == json.length){

                        initVirtual();
                    }   

        });


       
      }
    });

        



        //amebaCanvas.initWebWorker('/javascripts/AmebaCanvasWebWorker.js',socket);
        
       // amebaCanvas.startAnimation();
});

socket.on('sync_virtual',function(message){
   console.log(message);
   Object.keys(message).forEach(function(elm,index){
    console.log(message[elm]);

    var card = new AmebaCard(message[elm]);
    console.log(card.tags);
    if(card.hasTag('_control')){
       // card.preRenderCanvas = null;
        card.grobalAlpha=0.8;
        //card.preRenderCanvas = card.renderImage();
       
       card.setOnMouseEventListener('dblclick',function(e,card){
                //var targetCardId = card.department.focusCard;
                //card.department.removeAmeba(targetCardId);
                //mokkai ajax
                //とりあえず最新
                
                $.ajax({
                  type: 'GET',
                  url: card.datas['url'],
                  dataType: 'json',
                  beforeSend:function(req){
                    //console.log(req);
                  },
                  success: function(json2){
                    console.log(json2);
                    // var len = json.length;
                    // for(var i=0; i < len; i++){
                    //   $("#a").append(json[i].version + ' ' + json[i].codename + '<br>');
                    // }
                    
                    var name = json2.commit.author.name;
                    var message = json2.commit.message;
                    var url = json2['html_url'];
                    var branch = card.datas['branch'];
                    var x = card.x;
                    var y = card.y;
                    createPopupBranchCard({x:x,y:y,branchs:[{name:name,message:message,url:url,branch:branch}]});
                    
                    }
                });
    });

    }else if(card.datas["link"] != undefined){
        amebaCanvas.webCardEventSet(card);
    }

    amebaCanvas.addCard(card);
   });
   amebaCanvas.startAnimation();
    //amebaCanvas.startAnimation();
});


AmebaCanvas.prototype.webCardEventSet = function(wAmeba){
    wAmeba.setOnMouseEventListener("click",function(e,card){
       card.width = card.width*1.10;
       card.height = card.height*1.10;
        card.department.focusCard = card.id;
        console.log(card.department.focusCard);
       card.preRender();
    });
   
    wAmeba.setOnMouseEventListener("dblclick",function(e,card){
        window.open(ameba.datas['link']);
    });
    wAmeba.setOnMouseEventListener("mouseover",function(e,card){
         // var htmlsrc =  '<div style="position:absolute;left:500px;top:300px;">' +
        // "<h1>"+obj.title+"</h1>"+
        // "<h4>"+obj.link+"</h4>"+
        // "<p>"+obj.snipet+"</p>"+
        // '<img url="'+obj.image+'">'+
        //  "</div>";
        //  document.body.appendChild(htmlsrc);
        var div = document.getElementById("preview");
        var h1 = document.getElementById("prev-title");
        var h4 = document.getElementById("prev-url");
        var p = document.getElementById("prev-sunipet");
        var image = document.getElementById("prev-image");
        h1.innerHTML = wAmeba.datas['title'];
        h4.innerHTML = wAmeba.datas['link'];
        p.innerHTML = wAmeba.datas['sunipet'];
        image.src = wAmeba.datas['image'];
    });
    wAmeba.setOnMouseEventListener("mouseleave",function(e,card){

    });
    wAmeba.setOnMouseEventListener("contextmenu",function(e,card){
        //console.log('aaaaa');
        //var targetCardId = card.department.focusCard;
        //card.department.removeAmeba(targetCardId);
        //card.removeAmeba(card.id);
    });
};


AmebaCanvas.prototype.sync_add = function(ameba){
     var card = new AmebaCard(ameba);

     if(card.hasTag('_control')){

     }else if(card.datas['link'] != undefined){
        card.webCardEventSet(card);
     };

};
AmebaCanvas.prototype.sync_delete = function(ameba){

};

AmebaCanvas.prototype.sync_drag_move = function(id,x,y){
    socket.emit('sync_drag_move',{
        id:id,
        x:x,
        y:y
    });
};

socket.on('sync_snipet',function(data){
    /*
    
     */
    var ameba = new AmebaCard(data);

    amebaCanvas.addCard(ameba);

    ameba.setOnMouseEventListener('dblclick',function(e){
        createPopupSunipetCard({x:ameba.x,y:ameba.y,snipet:ameba.datas['snipet']});
    });

    //amebaCanvas.drawAmebas(amebaCanvas);

});

socket.on('sync_add',function(data){

});

socket.on('sync_delete',function(data){

});

socket.on('sync_drag_move',function(data){
    amebaCanvas.amebas[data.id].moveTo(data.x,data.y,"mousemove");
});

socket.on('sync_cluster_move',function(data){
   // console.log(data);
    //console.log(amebaCanvas.amebas[data.id]);
        if(amebaCanvas.amebas[data.id] != undefined){
            amebaCanvas.amebas[data.id].setPosition(data.x,data.y);

        }
});

socket.on('sync_result_image',function(data){
        //    console.log(data);
    /*
     linksdataArray.push({
        title: titlearray[i],
        link: linkarray[i],
        sunipet: suniarray[i],
        image: './images/sunagitune.jpeg'//ロード画像url
       });
     */
    
    var ameba = new AmebaCard(data);
    

    ameba.setOnMouseEventListener("click",function(e,card){
      // card.width = card.width*1.10;
      // card.height = card.height*1.10;
        card.department.focusCard = card.id;
        console.log(card.department.focusCard);
       card.preRender();
    });
   
    ameba.setOnMouseEventListener("dblclick",function(e,card){
        window.open(ameba.datas['link']);
    });
    ameba.setOnMouseEventListener("mouseover",function(e,card){
         // var htmlsrc =  '<div style="position:absolute;left:500px;top:300px;">' +
        // "<h1>"+obj.title+"</h1>"+
        // "<h4>"+obj.link+"</h4>"+
        // "<p>"+obj.snipet+"</p>"+
        // '<img url="'+obj.image+'">'+
        //  "</div>";
        //  document.body.appendChild(htmlsrc);
        var div = document.getElementById("preview");
        var h1 = document.getElementById("prev-title");
        var h4 = document.getElementById("prev-url");
        var p = document.getElementById("prev-sunipet");
        var image = document.getElementById("prev-image");
        h1.innerHTML = ameba.datas['title'];
        h4.innerHTML = ameba.datas['link'];
        p.innerHTML = ameba.datas['sunipet'];
        image.src = ameba.datas['image'];
    });
    ameba.setOnMouseEventListener("mouseleave",function(e,card){

    });
    ameba.setOnMouseEventListener("contextmenu",function(e,card){
        //console.log('aaaaa');
        //var targetCardId = card.department.focusCard;
        //card.department.removeAmeba(targetCardId);
        //card.removeAmeba(card.id);
    });




    amebaCanvas.addCard(ameba);
   // amebaCanvas.drawAmebas(amebaCanvas);

});




socket.on('autoUpdateWithCluster',function(data){
    //console.log(data);
    Object.keys(data).forEach(function(elm,index){
        if(index === 0 && counter < 100){
            ///console.log(data.data[elm]);
            counter++;
        }
      //  console.log(elm);
       // console.log(data[elm].x);
        amebaCanvas.wSetAmebaStatusWithoutPreRender(data[elm]);
    });

});



socket.on('result', function (data) {
	console.log(data);
	var ameba = new AmebaCard(data);
    ameba.setOnMouseEventListener('dblclick',function(e,card){
    //    card.department.removeAmebas(card.id);
    });
	ameba.addTag(data.title);
	amebaCanvas.addCard(ameba);
});


AmebaCard.prototype.changeTagSet = function(type){
    var self = this;
  console.log(self.tags);

    switch(type){
        case 'favorite' :
            if(-1 != self.tags.indexOf(self.datas.originalTag[0])){
//            console.log(self.datas.originalTag);
                console.log('A');
                self.tags = [];
                self.tags.push('favorite');    
            }else{

           // console.log(self.datas.originalTag[0]);
                self.tags = self.datas['originalTag'];
            }
        break;
        case 'sync' :
         if(-1 != self.tags.indexOf(self.datas.originalTag[0])){
                console.log('a')
                self.tags = [];
                self.tags.push('sync');    
            }else{
                self.tags = self.datas['originalTag'];
            }
        break;
        case 'origin' :
            self.tags = self.datas['originalTag'];

        break;
    }
  console.log(self.tags);

};

socket.on('result_image', function (obj) {
	console.log(obj);
    /*
   	 linksdataArray.push({
        title: titlearray[i],
        link: linkarray[i],
        sunipet: suniarray[i],
        image: './images/sunagitune.jpeg'//ロード画像url
       });
     */
    //var ameba = new AmebaCard({cardType:"image",url:obj.image,scale:0.1});
    var ameba = new AmebaCard(obj);
    //ameba.addTag(obj.query);
   // ameba.datas['originalTag'] = [];
   // ameba.datas['originalTag'].push(obj.query);


    ameba.setOnMouseEventListener("click",function(e,card){
       card.width = card.width*1.10;
       card.height = card.height*1.10;
        card.department.focusCard = card.id;
        console.log(card.department.focusCard);
       card.preRender();
    });
   
    ameba.setOnMouseEventListener("dblclick",function(e,card){
        window.open(obj.link);
    });
    ameba.setOnMouseEventListener("mouseover",function(e,card){
         // var htmlsrc =  '<div style="position:absolute;left:500px;top:300px;">' +
        // "<h1>"+obj.title+"</h1>"+
        // "<h4>"+obj.link+"</h4>"+
        // "<p>"+obj.snipet+"</p>"+
        // '<img url="'+obj.image+'">'+
        //  "</div>";
        //  document.body.appendChild(htmlsrc);
        var div = document.getElementById("preview");
        var h1 = document.getElementById("prev-title");
        var h4 = document.getElementById("prev-url");
        var p = document.getElementById("prev-sunipet");
        var image = document.getElementById("prev-image");
        h1.innerHTML = obj.title;
        h4.innerHTML = obj.link;
        p.innerHTML = obj.sunipet;
        image.src = obj.image;
    });
    ameba.setOnMouseEventListener("mouseleave",function(e,card){

    });
    ameba.setOnMouseEventListener("contextmenu",function(e,card){
        //console.log('aaaaa');
        //var targetCardId = card.department.focusCard;
        //card.department.removeAmeba(targetCardId);
        //card.removeAmeba(card.id);
    });




    amebaCanvas.addCard(ameba);
   // amebaCanvas.drawAmebas(amebaCanvas);
 
});


var createPopupSunipetCard = function(data){
    /*
        sunipet,x,y
     */
    var div = document.createElement('div');
    div.classList.add("well");
    div.classList.add("well-lg");
    div.style.position = "absolute";
    div.style.zIndex = 11;
    div.style.padding = "5px";
    div.style.width = "400px";
    div.style.height = "600px";
    div.style.left = String(data.x)+"px";
    div.style.top = String(data.y)+"px";
    var p = document.createElement('p');
    var h3 = document.createElement('h3');

    p.classList.add('lead');

    p.style.wordWrap='break-word';
    p.innerHTML = data.snipet;
    h3.innerHTML = "snippet";

    div.appendChild(h3);
    div.appendChild(p);

    document.body.appendChild(div);

    div.addEventListener('mouseleave',function(e){
        div.parentNode.removeChild(div);
    });

};

var createPopupBranchCard = function(data){
    /*
        x,y,branchs[branch,name,url]
     */
    
    data.branchs.forEach(function(elm,index){

        var div = document.createElement('div');
        div.classList.add("well");
        div.classList.add("well-lg");
        div.style.position = "absolute";
        div.style.zIndex = 11;
        div.style.padding = "5px";
        div.style.width = "600px";
        div.style.height = "400px";
        div.style.left = String(data.x)+"px";
        div.style.top = String(data.y+ index*40)+"px";

        var branch = document.createElement('p');
        var name = document.createElement('p');
        var url = document.createElement('a');
        var message = document.createElement('p');

        branch.classList.add('lead');
        name.classList.add('lead');

        var h3b = document.createElement('h3');
        var h3n = document.createElement('h3');
        var h3u = document.createElement('h3');
        var h3m = document.createElement('h3');

        h3b.innerHTML = "Branch";
        h3n.innerHTML = "Name";
        h3u.innerHTML = "Url";
        h3m.innerHTML = "Message";

        branch.style.wordWrap='break-word';
        name.style.wordWrap='break-word';
        url.style.wordWrap='break-word';
        message.style.wordWrap='break-word';

        branch.innerHTML = elm.branch;
        name.innerHTML = elm.name;
        url.innerHTML = elm.url;
        message.innerHTML = elm.message;

        div.appendChild(h3b);
        div.appendChild(branch);
        div.appendChild(h3m);
        div.appendChild(message);
        div.appendChild(h3n);
        div.appendChild(name);
        div.appendChild(h3u);
        div.appendChild(url);

        document.body.appendChild(div);

        url.addEventListener('click',function(e){
             window.open(elm.url);
        });
        div.addEventListener('mouseleave',function(e){
            div.parentNode.removeChild(div);
        });

    });



};


// $(function(){
//    $.ajax({
//       type: 'GET',
//       url: 'https://api.github.com/repos/KeisukeSugiura/SearchMate/branches',
//       dataType: 'json',
//       success: function(json){
//         console.log(json);
//         // var len = json.length;
//         // for(var i=0; i < len; i++){
//         //   $("#a").append(json[i].version + ' ' + json[i].codename + '<br>');
//         // }
        
//       }
//     });

//    $.ajax({
//       type: 'GET',
//       url: 'https://api.github.com/repos/KeisukeSugiura/SearchMate/events',
//       dataType: 'json',
//       success: function(json){
//         console.log(json);
//         // var len = json.length;
//         // for(var i=0; i < len; i++){
//         //   $("#a").append(json[i].version + ' ' + json[i].codename + '<br>');
//         // }
        
//       }
//     });
// });
