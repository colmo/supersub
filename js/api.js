/*
    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/


$(document).ready(function() {
	
	
//LOGIN SECTION
	//Seguridad login
	if($.localStorage.getItem('user')!=null || $.localStorage.getItem('auth')!=null){
		$("#login-page").addClass('hide');
		//$("#wrapper").fadeIn("slow");
		//$("#wrapper").removeClass('hide');
	  	setTimeout(function(){
       		$("#wrapper").fadeIn("slow");
       		$("#carga").removeClass('hide');
       	 	novedades_load();
		},200);
		
		user=$.localStorage.getItem('user');
		passenc=$.localStorage.getItem('auth');
		novedades_load();

	}
			
	
$("#usuario").focus();	 
  function loginSubsonic(user_l,pass_l){
      $.ajax({
        url:''+serverURL+'/rest/ping.view?u='+user_l+'&p=enc:'+pass_l+'&v='+api+'&c='+clientName+'&f='+format,
        type :'GET',
        crossDomain : true,
        timeout : 60 * 60 * 1000,
        dataType :format,
        success: function(data){
          var status = data["subsonic-response"].status;

          if (status == "ok"){
                 
            //Guardamos con localstorage el user y las pass en hex.
            $.localStorage.setItem('user', user_l);
           	$.localStorage.setItem('auth', pass_l);
           	$("#login-page").fadeOut('slow');
           	setTimeout(function(){
           		$("#login-page").addClass("hide");
           		$("#wrapper").fadeIn("slow");
           		$("#carga").removeClass('hide');
           	 	novedades_load();
			},200);
         	user=$.localStorage.getItem('user');
			passenc=$.localStorage.getItem('auth');
			$(".username").text("Usuario: "+user);
		
          }
          else {
            $("#error").show();
            $(".login-container").effect("shake", {times:7, distance:3}, 500 );
          }
      },
      error : function(xhr,v,e){
          console.log("Error al conectarse al servidor");
      }
    });
  }


function strToHex(str) {
    var hex = '';
    for(var i=0;i<str.length;i++) {
        hex += ''+str.charCodeAt(i).toString(16);
    }
    return hex;
}

$('input').keydown(function(e) {
    if (e.keyCode == 13) {
    	$("#usuario, #passwd").click();
        $('#login').click();
        
    }
});


$("#login").click(function(e) {
	var user = $("#usuario").val();
	var passenc = strToHex($("#passwd").val());

  var ok = true;
  if(user==""){
    $(".control-grupo-usuario").removeClass("info");
    $(".control-grupo-usuario").addClass("error");
    
    $("#usuario").attr('data-original-title',"Usuario vacío");
    $('#usuario').tooltip("show");
    ok = false;
    }
   
   if (passenc ==""){
      $(".control-grupo-passwd").removeClass("info");
      $(".control-grupo-passwd").addClass("error");
      $("#passwd").attr('data-original-title',"Contraseña vacía");
      $('#passwd').tooltip("show");
      ok = false;
    }

    if (ok) {
      loginSubsonic(user,passenc);
    }

  });
  
  $("#usuario, #passwd").click(function () {
      $("#control-grupo-"+this.id).removeClass("error");
      $("#control-grupo-"+this.id).addClass("info");
      $(this).removeAttr('data-original-title');

  });
  
  
  
//SUPERSUB

$(document).ajaxStart(function() {
   if(!$("#nav-search, #nav-profile").hasClass('current')){
	   	$("#carga").removeClass('hide');
	   loading=true;
   }
 });
 
 
 // $(document).ajaxStop(function() {
     // loading=false;
 // });
 
 

//HOME. Funcion que carga de la página principal con las últimas novedades.

function novedades_load() {
	$.getJSON(serverURL+'/rest/getAlbumList.view?type=newest&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&size=500', function(response){
		novedades_start();
		var num_novedades = novedades_num();
		var max_albums = response['subsonic-response'].albumList.album.length;
		
		if(max_albums > num_novedades){
			//console.log(num_novedades);
			for (var i=0; i<num_novedades; i++){
				var album = response['subsonic-response'].albumList.album[i].album;
				var artista = response['subsonic-response'].albumList.album[i].artist;
				var coverArt = response['subsonic-response'].albumList.album[i].coverArt;
				var id = response['subsonic-response'].albumList.album[i].id;
				var parent = response['subsonic-response'].albumList.album[i].parent;
				//console.log(id, artista, album, coverArt);
				novedades_add(id, artista, album, coverArt, parent);
			}
			novedades_end(); 
			
		}
		else{
			$.each( response["subsonic-response"].albumList.album, function( key, value ) {
				var album = response['subsonic-response'].albumList.album[key].album;
				var artista = response['subsonic-response'].albumList.album[key].artist;
				var coverArt = response['subsonic-response'].albumList.album[key].coverArt;
				var id = response['subsonic-response'].albumList.album[key].id;
				var parent = response['subsonic-response'].albumList.album[i].parent;
				novedades_add(id, artista, album, coverArt, parent);
				});
			novedades_end(); 
		}
	});
}

//Función que recupera un album especifico de un artista.
function recuperarAlbum(id_album){
	$.getJSON(serverURL+'/rest/getMusicDirectory.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&id='+id_album, function(data){
        	var album_title = data["subsonic-response"].directory.child[0].album;
        	var artist = data["subsonic-response"].directory.child[0].artist;
        	var coverArt_id = data["subsonic-response"].directory.child[0].coverArt;
        	var year = data["subsonic-response"].directory.child[0].year;
        	var songs_arr = data["subsonic-response"].directory.child;
        	var parent = data["subsonic-response"].directory.parent;
        	
        	dibujaAlbum(artist,album_title, coverArt_id, year, songs_arr, parent);
		}
	);
}


//Función que genera la pagina de un artista
function recuperaArtista(id_artista){
	$.getJSON(serverURL+'/rest/getMusicDirectory.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&id='+id_artista, function(data){
			var artist_name = data["subsonic-response"].directory.name;
			var artist_query = artist_name.replace(/ /g,"+");
			
			
			
			//API de Lastfm para obtener foto del grupo, biografia y fecha de formación.
			$.getJSON('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+artist_query+'&api_key=e62c224dee73ba9e1a3fdbf59a80b47a&format=json&lang=es', function (response) {
				var bio = response.artist.bio.summary;
				var url_image = response.artist.image[4]["#text"];
				var yearformed = response.artist.bio.yearformed;
				dibujaAlbumes_start(artist_name,bio,url_image, yearformed);

				
				//Cuando el artista tiene más de 1 cd.
				if($.isArray(data["subsonic-response"].directory.child)){
					var albums = data["subsonic-response"].directory.child;
					var albums_count = data["subsonic-response"].directory.child.length;
					items_loaded = 0;
					$.each(albums, function(index, value) {
						
						var id_album = albums[index].id;
						setTimeout(function(){
							$.getJSON(serverURL+'/rest/getMusicDirectory.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&id='+id_album, function(data_cd){
					   		var album_title = data_cd["subsonic-response"].directory.child[0].album;
				        	var year = data_cd["subsonic-response"].directory.child[0].year;
				        	var coverArt_id = data_cd["subsonic-response"].directory.child[0].coverArt;
				        	var songs_arr = data_cd["subsonic-response"].directory.child;
				           	dibujaAlbumes_addCD(album_title, year, coverArt_id, songs_arr);
				           	items_loaded++;
						});
						},200);
						
					});					
				}
				
				//Cuando el artista solo tiene 1 CD.
				else{
					
					var id_album=data["subsonic-response"].directory.child.id;
					var albums_count = 1;
					items_loaded = 0;
					$.getJSON(serverURL+'/rest/getMusicDirectory.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&id='+id_album, function(data_cd){
					   		var album_title = data_cd["subsonic-response"].directory.child[0].album;
				        	var year = data_cd["subsonic-response"].directory.child[0].year;
				        	var coverArt_id = data_cd["subsonic-response"].directory.child[0].coverArt;
				        	var songs_arr = data_cd["subsonic-response"].directory.child;
				        	dibujaAlbumes_addCD(album_title, year, coverArt_id, songs_arr);
				        	items_loaded ++;
					});				
				}
				
				$(document).ajaxStop(function() {
					 if(!$("#nav-search").hasClass('current')){
						if(items_loaded == albums_count){
							dibujaAlbumes_end();
							}
					   }
					  
				});

			});			
	});
}





//Función que genera la pagina con todos los artistas
function recuperarArtistas(){
	$.getJSON(''+serverURL+'/rest/getIndexes.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format, function(response){
		var artists = response["subsonic-response"].indexes.index;
		
		artists_start();
		
		$.each(artists,function(key, value){
			
			var letra = artists[key].name;
			var artists_l = artists[key].artist;
			
			
			if($.isArray(artists_l)){
	    		$.each(artists_l, function(index, value){
	    			var id_artist=artists_l[index].id;
	    			var artist_name=artists_l[index].name;
	    			recuperaFotoArtistaLastFM(id_artist, artist_name);
	       		});
			}
			else {
				var id_artist = artists_l.id;
				var artist_name = artists_l.name;
				recuperaFotoArtistaLastFM(id_artist, artist_name);
			}

		});
		
	});


	$(document).ajaxStop(function(){
		if(!$("#nav-search").hasClass('current')){
			if($("#artistas").html()=="") {
				artists_end();
			}
		}
	});
}



//Funcion que hace petición a la API externa de Lastfm que recupera la foto del artista y la biografia.
function recuperaFotoArtistaLastFM(id_artist, artist_name){
	var artist_query = artist_name.replace(/ /g,"+");
	$.getJSON('http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+artist_query+'&api_key=e62c224dee73ba9e1a3fdbf59a80b47a&format=json&lang=es', function (response) {
        	var url_image=response.artist.image[4]["#text"];
           	var bio = response.artist.bio.content;
			string+="<div class='caja-artista'>";
			string+="	<div class='imgartista-wrapper'>";
			string+="		<div class='imgartista-interior-wrapper'>";
			string+="			<a href='#'><img  data-id='"+id_artist+"' class='img-artista' src='"+url_image+"' /></a>";
			string+="		</div>";
			string+="		<div data-id='"+id_artist+"'  class='hover-layer'>";
			string+="			<div class='detalles-artista'>";
			string+="				<div class='nombre-artista'>"+artist_name+"</div>";
			string+="			</div>";
			string+="		</div>";
			string+="	</div>";
			string+="</div>";
  });

}



 ///////////////////////////////////////////////////////////////////
 // Seccion: albumes
 ///////////////////////////////////////////////////////////////////     

//Funcion que recupera todos los álbumes
 function recuperarAlbumes(){

 	$.getJSON(serverURL+'/rest/getAlbumList.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&type=alphabeticalByArtist&size=500', function(response){
 		albumes_inicio();
		$.each( response["subsonic-response"].albumList.album, function( key, value ) {
			var album = response['subsonic-response'].albumList.album[key].album;
			var artista = response['subsonic-response'].albumList.album[key].artist;
			var coverArt = response['subsonic-response'].albumList.album[key].coverArt;
			var id = response['subsonic-response'].albumList.album[key].id;
			var parent = response['subsonic-response'].albumList.album[key].parent;
			album_add(id, artista, album, coverArt, parent);
		});
		albumes_final();
	});
	
 }





//Funcion que permite hacer clic en las caratulas y cargar el disco en la pagina de navegación.
$("body").on("click", ".imagen-disco, .cd_title, .result-link", function() {
	var id_album=($(this).attr("data-id"));
	navigation=true;
	recuperarAlbum(id_album);
});


//Funcion que permite hacer click en artistas y cargar la pagina de artistas en navegación.
$("body").on("click", ".artist_title, .hover-layer, .resultado-enlace", function(){
	var id_artista=($(this).attr("data-id"));
	recuperaArtista(id_artista);
	navigation=true;	
	//loadNavigation();
});
	

//Funcion que permite hacer click en artistas y cargar la pagina de artistas en navegación.
$("body").on("click", ".artista-cd", function(){
	var id_artista=($(this).attr("data-id"));
	$("#navigation").removeClass("navigation-effect");
	setTimeout(function(){
		$("#navigation").addClass("hide");
		recuperaArtista(id_artista);
		navigation=true;
	},400);			
});

//funcion que se encarga de actualizar la lista de canciones si hemos cerrado el navigation y ha cambiado la cancion.
function updateSong(){
	var url_playing = $("#jquery_jplayer_1").data("jPlayer").status.src;
	var pos_id=url_playing.lastIndexOf("=");
	var idnow = url_playing.substring(pos_id+1, url_playing.length);
	$('table tbody tr').removeClass('playing');
	$('table tbody tr[data-song-id="'+idnow+'"]').addClass('playing');
	$(".imagen-player").attr("src",serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+idnow+"&size=250");
}
	

$("body").on("click", ".imagen-player, .img-player-placeholder", function(){

	// console.log(play_nav);
	// console.log($("#navigation").html());
	if((play_nav !="" ) && (play_nav!=undefined) && ($("#navigation").html() != play_nav)){
		if($("#navigation").hasClass("navigation-effect")){
			$("#navigation").removeClass("navigation-effect");
			setTimeout(function(){
				$("#navigation").html(play_nav);
				$("#navigation").addClass('navigation-effect');
				updateSong();
				setTimeout(function(){
					if($("#main").scrollTop()>0){
						$("#main").animate({scrollTop: 0}, "slow");
					}
				},350);
			},350);
		}
		else{
			$("#navigation").html(play_nav);
			$("#navigation").removeClass("hide");
			$("#volver").removeClass('hide').fadeTo('slow',1);
			
			if($("#nav-home").hasClass('current')){
				$("#home").fadeTo('slow', 0.3);
			}
			else if($("#nav-artists").hasClass('current')){
				$("#artistas").fadeTo('slow', 0.3);
			}
			else if ($("#nav-albumes").hasClass('current')){
				$("#albumes").fadeTo('slow', 0.3);
			}
			else if ($("#nav-profile").hasClass('current')){
				$("#cuenta").fadeTo('slow', 0.3);
			}
			
			
			
			setTimeout(function(){
				$("#navigation").addClass('navigation-effect');
				updateSong();
				setTimeout(function(){
					if($("#main").scrollTop()>0){
						$("#main").animate({scrollTop: 0}, "slow");
					}
				},350);
			},50);
		}
	}
		
		
	});
	
	
////////////////////////////////////////////////////////////////// 
// Control del menu //
////////////////////////////////////////////////////////////////// 



//Funcion que permite esconder navegacion.
$("#logo, #volver, #nav-home, #nav-artists, #nav-albumes, #nav-profile").click(function(e) {
	//console.log(this.getAttribute("id"));

	if($("#navigation").hasClass('navigation-effect')){
		$("#navigation").removeClass('navigation-effect');
		$("#volver").fadeTo('slow',0);
		setTimeout(function(){
			$("#navigation").addClass("hide");
			$("#home, #artistas, #artistas_tiles, #albumes, #cuenta").fadeTo('slow', 1);
			$("#home, #artistas, #artistas_tiles, #albumes, #cuenta").css("display","");
			
			
			if($("#nav-home").hasClass('current')){
				$("#artistas, #albumes").addClass('hide');
			}
			else if($("#nav-artists").hasClass('current')){
				$("#home, #albumes").addClass('hide');
			}
			else if ($("#nav-albumes").hasClass('current')){
				$("#artistas, #home").addClass('hide');
			}
			else if ($("nav-profile").hasClass('current')){
				$("#cuenta").addClass('hide');
			}
			$("#navigation").html("");
			$("#volver").addClass('hide');

		},300);
	}
});
  


	
//Funcion que controla el los eventos de menu y divs.
$("#logo, #nav-home,  #nav-artists, #nav-albumes, #nav-profile").click(function(e) {
	var accion = this.getAttribute("id");
	
	//console.log(loading);
	//Si no esta cargando nada permitimos usar el menu.
	if(!loading){
		$("#logo, #nav-home, #nav-artists, #nav-albumes, #nav-profile").removeClass('current');
	
	
	
	//Escondemos el div actual.
	if (!$("#home").hasClass('hide') && (accion != "nav-home" && accion != "logo")){
		$("#home").addClass('effect');
		setTimeout(function(){
			$("#home").addClass('hide');
			$("#home").css("display","");
			
		},300);

	}	
	else if (!$("#artistas").hasClass('hide') && accion != "nav-artists"){
		$("#artistas").addClass('effect');
		setTimeout(function(){
			$("#artistas").addClass('hide');
			$("#artistas").css("display","");
			
		},300);

	}		
	else if (!$("#albumes").hasClass('hide') && accion != "nav-albumes"){
		$("#albumes").addClass('effect');
		setTimeout(function(){
			$("#albumes").addClass('hide');
			$("#albumes").css("display","");
		},300);
		
	}
	
	else if (!$("#cuenta").hasClass('hide') && accion != "nav-profile"){
		$("#cuenta").addClass('effect');
		setTimeout(function(){
			$("#cuenta").addClass('hide');
			$("#cuenta").css("display","");
		},300);
		
	}
	
	
	switch(accion)
	{
	case "logo":
	case "nav-home":
			$("#nav-home").addClass('current');
			if($("#home").hasClass('hide')){
				setTimeout(function(){
					$("#home").removeClass("hide");
					setTimeout(function(){
						$("#home").removeClass("effect");
					},400);
				},20);
			};
			break;
			
	case "nav-artists":
			$("#nav-artists").addClass('current');
			if($("#artistas").html()==""){
				setTimeout(function(){
					recuperarArtistas();
				},300);
				
			}
			else{
				$("#artistas").removeClass('hide');
				setTimeout(function(){
					$("#artistas").removeClass('effect');
				},400);
			}
			
	 		break;
	 		
	case "nav-albumes":
			$("#nav-albumes").addClass('current');
			if($("#albumes").html()==""){
				setTimeout(function(){
					recuperarAlbumes();
				},300);
				
			}
			else{
				$("#albumes").removeClass('hide');
				setTimeout(function(){
					$("#albumes").removeClass('effect');
				},400);
			}
			
	 		break;
	 		
	case "nav-profile":
			$(".username").text("Usuario: "+user);
			$("#nav-profile").addClass('current');
			$("#cuenta").removeClass('hide');
				setTimeout(function(){
					$("#cuenta").removeClass('effect');
				},300);
			
	 		break;
	 		
	default:
	 		break;
	}
}
	
	
	
});



/* Control de mi cuenta*/


// Cambio de contraseña
$("#change-passwd").click(function() {
	if ($("#passwd1").val()=="" || $("#passwd2").val() == "" ) {
		// mostrar #error_samepass
		$("#error_samepass").removeClass('hide');

	}
	else if ($("#passwd1").val() != $("#passwd2").val()) {
		// mostar #error_samepass
		$("#error_samepass").removeClass('hide');
		
		
	}else {
		var password = $("#passwd1").val();
		$.getJSON(serverURL+'/rest/changePassword.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&username='+user+'&password='+password, function (response) { 
			if (response["subsonic-response"].status =="ok") {
				$("#success_changedpasswd").removeClass("hide");
				$("#error_samepass").addClass('hide');
				passenc = strToHex(password)
				$.localStorage.setItem('auth', passenc);
			
			}else {
				// mostrar #error_notchanged
				$("#error_samepass").addClass('hide');
				$("#error_notchanged").removeClass("hide");
			}	
		});
	}	
});

// Cerrar sesión y salir de subsonic
$("#cerrar-sesion").click(function() {
	$.localStorage.clear();
	$("#wrapper").fadeOut('slow');
	$("#jquery_jplayer_1").jPlayer("stop");
	setTimeout(function(){
		$("#login-page").removeClass('hide');
		$("#login-page").fadeIn('slow');
	},200);
	
});


/* Fin control de mi cuenta */	


  
});
