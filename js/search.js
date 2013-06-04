$( document ).ready(function() {

// Añade/quita la clase selected al pasar el puntero por encima de un enlace
$("body").on("mouseover", "#resultados-busqueda li", function(e) {
	$(this).addClass('selected');	
});

$("body").on("mouseout", "#resultados-busqueda li", function(e) {
	$(this).removeClass('selected');
});


$("#nav-search").click(function() {
	$("#busqueda").removeClass("hide");
	$(".busqueda-layer").removeClass("hide");
	$("#nav-search").addClass("current");
	$(".busqueda-input").focus();
});


$("body").on("click", ".resultado-enlace, .result-link", function (e) {
	$("#busqueda").addClass("hide");
	$(".busqueda-layer").addClass("hide");
	$("#nav-search").removeClass("current");	
	
});

$(".busqueda-layer").click(function() {
	$("#busqueda").addClass("hide");
	$(".busqueda-layer").addClass("hide");
	$("#nav-search").removeClass("current");
});


///////////////////////////////////////////////////////////////////
// BUSCADOR //
////////////////////////////////////////////////////////////////// 

var delay = (function(){
  var timer = 0;
  return function(callback, ms){
    clearTimeout (timer);
    timer = setTimeout(callback, ms);
  };
})();







 //Recoge lo introducido por el teclado y se lo pasa a la función de busqueda.
  $("body").on("keyup", "#busqueda", function(e) {
	delay(function(){
  		var query="";
  		query = $(".busqueda-input").val();
  		if (query != ""){
  			$("#busqueda-vacia").addClass('hide');
  			$("#resultados-busqueda").removeClass('hide');
  			busquedaLive(query);
  			$("#busqueda-no-encontrado").addClass('hide'); //?  			
  		}
  		else {
  			$("#busqueda-vacia").removeClass('hide');
  			$("#resultados-busqueda").addClass('hide');
  			$("#sugerir-artistas").html(""); 
  			$("#sugest-albums").html(""); 
  			$("#busqueda-no-encontrado").addClass('hide');
  		}
	}, 400 );
	});

function busquedaLive(query) {
	$.ajax({
	
		url:''+serverURL+'/rest/search2.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&query='+query,
	    type :'GET',
	    crossDomain : true,
	    timeout : 60 * 60 * 1000,
	    dataType :format,
	    success: function(data){
	     	
			// Comprobamos que la busqueda nos devuelva algo	
			if(data["subsonic-response"].searchResult2.length != ""){ 
	        	var resultados=data["subsonic-response"].searchResult2;  		
	        	
	        	// Parte donde se gestiona los artistas que devuelve la busqueda.
	        	
	        	// Miramos que exista el array album, donde se encuentran los albumes que devuelve la busqueda
	        	// También miramos si se devuelve mas de un album.
	        	// Si hay mas de un album de ese artista entramos en la condición.
	        	if (resultados.album != undefined && $.isArray(resultados.album)) {
	        		var string="";
	        		var artista="";
	        		var artistas_mostrados = new Array();					
					// Recorremos cada album recibido por la busqueda
	        		$.each(resultados.album, function(index, value) {
	        			artista = resultados.album[index].artist;
	        			
	        			// Para que no salgan resultados repetidos guardamos en un array 
	        			//los artistas que ya se estan mostrando y así poder controlar cuales se vuelven a dibujar
	        			// y cuales no.
	        			if ($.inArray(artista,artistas_mostrados) == -1 ) {
	        				var coverart= resultados.album[index].coverArt;
	        				var artist_id = resultados.album[index].parent;
		        			string += "<li class=''>";
		        			string +="<div class='img'>";
		        			string +="<img src='"+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+coverart+"&size=160'>";
							string +="</div>";
							string+="<a href='#' class='resultado-enlace' data-id='"+artist_id+"'>";
							string+="<span class='result-nombre'>"+artista+"</span>";
							string+="</a>";
							string+="</li>";
							if (artista !=""){artistas_mostrados[index]=artista;}	
						}
					});
	        		$("#sugerir-artistas").html(string);
	        	}
	        	// Si no es un array es que solo hay un album
	        	else if (resultados.album != undefined ){
	        		var coverart= resultados.album.coverArt; 
	        		var artist_id = resultados.album.parent;      		
    				var string = "<li class=''>";
        			string +="<div class='img'>";
        			string +="<img src='"+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+coverart+"&size=160'>";
					string +="</div>";
					string+="<a href='#' class='resultado-enlace' data-id='"+artist_id+"'>";
					string+="<span class='result-nombre'>"+resultados.album.artist+"</span>";
					string+="</a>";
					string+="</li>";
					$("#sugerir-artistas").html(string);
	        	}
	        	
	        	// A partir de aquí se gestiona los álbumes que devuelve la búsqueda.
	        	if (resultados.album != undefined && (!$.isArray(resultados.album))) {	
	        		var coverart= resultados.album.coverArt;
	        		var album_id = resultados.album.id;	
	        		var string1= "<li>";
	        		string1 += "<div class='img'>";
	        		string1 +="<img src='"+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+coverart+"&size=160'>";
	        		string1+= "</div>";
	        		string1+="<a href='#' class='result-link' data-id='"+album_id+"'>";
	        		string1+= "<span class='sp-suggest-name'>"+resultados.album.album+"</span>";
	        		string1+="</a>";
	        		string+="</li>";
	        		$("#suggest-albums").html(string1);
	        		} 
	        		else if (resultados.album != undefined && ($.isArray(resultados.album))) {
	        			var string1 ="";
	        		
	        			$.each(resultados.album, function(index, value) {
	        				var coverart= resultados.album[index].coverArt;
	        				var album_id = resultados.album[index].id;
		        			string1+= "<li>";
		        			string1 += "<div class='img'>";
		        			string1 +="<img src='"+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+coverart+"&size=160'>";
		        			string1+= "</div>";
		        			string1+="<a href='#' class='result-link' data-id='"+album_id+"'>";
		        			string1+= "<span class='sp-suggest-name'>"+resultados.album[index].album+"</span>";
		        			string1+="</a>";
		        			string+="</li>";
						});
						$("#suggest-albums").html(string1);	
	        		}
	        	
			}else{
				 $("#resultados-busqueda").addClass("hide");
				 $("#busqueda-no-encontrado").removeClass('hide');
				}	
	      },
	      error : function(xhr,v,e){
	          console.log("Error al conectarse al servidor");
	      }
	    });
}














////////////////////////////////////////////////////////////////// 
// FIN BUSCADOR //
////////////////////////////////////////////////////////////////// 	        





// $(window).resize(function() {
	// var height = $("#albumes").height();
    // $('#navigation').css('height',height);
    // console.log(height);
// });







});

