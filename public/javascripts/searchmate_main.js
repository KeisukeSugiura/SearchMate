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



var amebaFavoriteCard = new AmebaCard({cardType:"cluster",url:"./images/favorite.png",text:"favorite",x:0,y:984});
amebaFavoriteCard.addTag("favorite");
amebaFavoriteCard.width=96;
amebaFavoriteCard.height=96;
amebaFavoriteCard.preRenderCanvas = null;
amebaFavoriteCard.grobalAlpha=0.8;
amebaFavoriteCard.preRenderCanvas = amebaFavoriteCard.renderImage();
amebaFavoriteCard.setOnMouseEventListener('dblclick',function(e,card){
    var targetCardId = card.department.focusCard;
    console.log(targetCardId);
    var targetCard = card.department.amebas[targetCardId];
    targetCard.changeTagSet('favorite');
});
amebaCanvas.addCard(amebaFavoriteCard);

var amebaSyncCard = new AmebaCard({cardType:"cluster",url:"./images/sync.png",text:"sync",x:0,y:0});
amebaSyncCard.addTag("sync");
amebaSyncCard.width=96;
amebaSyncCard.height=96;
amebaSyncCard.preRenderCanvas = null;
amebaSyncCard.grobalAlpha=0.8;
amebaSyncCard.preRenderCanvas = amebaSyncCard.renderImage();
amebaSyncCard.setOnMouseEventListener('dblclick',function(e,card){
    var targetCardId = card.department.focusCard;
    var targetCard = card.department.amebas[targetCardId];
    targetCard.changeTagSet('sync');
});
amebaCanvas.addCard(amebaSyncCard);

var amebaDeleteCard = new AmebaCard({cardType:"cluster",url:"./images/delete.png",text:"Delete",x:0,y:492});
amebaDeleteCard.addTag("delete");
amebaDeleteCard.width=96;
amebaDeleteCard.height=96;
amebaDeleteCard.preRenderCanvas = null;
amebaDeleteCard.grobalAlpha=0.8;
amebaDeleteCard.preRenderCanvas = amebaDeleteCard.renderImage();
amebaDeleteCard.setOnMouseEventListener('dblclick',function(e,card){
    var targetCardId = card.department.focusCard;
    card.department.removeAmeba(targetCardId);
});
amebaCanvas.addCard(amebaDeleteCard);


var search_for = function (e) {
    if (e.keyCode == 13) {
        blurflg = false;
        query_word = query_box.value;
        query_box.value = "";
        if (query_word != null && query_word != "") {
            

            socket.emit('query', {query: query_word, count: 10});


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

socket.on('result', function (data) {
	console.log(data);
	var ameba = new AmebaCard({cardType:"cluster",text:data.title,textSize:"50px",color:'white',x:810,y:565});
    ameba.setOnMouseEventListener('dblclick',function(e,card){
        card.department.removeAmebas(card.id);
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
    var ameba = new AmebaCard({cardType:"image",url:obj.image,scale:0.1});
    ameba.addTag(obj.query);
    ameba.datas['originalTag'] = [];
    ameba.datas['originalTag'].push(obj.query);


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

});
