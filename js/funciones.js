
// Primera parte que se encarga de dibujar las novedades
function novedades_start() {
	string ="<h2 class='novedades_home'>Novedades</h2>";
	string+="<div class='novedades_wrapper'>";
	// string += "<ul class='thumbnails' style='text-align:center;'>";
	string+="<div id='discos-wrapper'>";
}

// Parte que se encarga de dibujar cada album
function novedades_add(id, artista, album, coverArt, parent) {
	string+="<div class='disco-wrapper'>";
	string+="<div class='imagen-disco-wrapper'>";
	string+="<div class='inner-imagen-disco'>";
	string+="<a href='#'><img class='imagen-disco' data-id='"+id+"' src='"+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+coverArt+"&size=160' /></a>";
	string+="</div>";
	string+="</div>";
	string+="<div class='detalles-disco'>";
	string+="<div class='titulo-disco'><a class='cd_title' data-id='"+id+"' href='#'>"+album+"</a></div>";
	string+="<div class='subtitulo-artista'><a class='artist_title' data-id='"+parent+"' href='#'>"+artista+"</a></div>";
	string+="</div>";
	string+="</div>";
}


// Parte final del codigo de novedades
function novedades_end() {
	// string +="</ul>";
	string +="</div>";
	string +="<script> $('#home').waitForImages(function() {$('#carga').addClass('hide'); novedades_ctl(); loading=false; }); </script>";

	$("#home").html(string);


}

//Funciones que controlan los anchos y altos para que todo se vea OK.

//Funcion que controla el alto del navigation en el home.
function alto_nav(){
		
		if($("#nav-home").hasClass('current')) {
			var home_h = $("#home").height();
		}
		else if($("#nav-artists").hasClass('current')){
			var home_h =$(".artistas-wrapper").height();
			home_h+=65;
		}
		else if ($("#nav-albumes").hasClass('current')){
			var home_h = $("#albumes").height();
		}
	
		var menu_h = $("#main-nav").height();

		
		if( home_h > menu_h){
			home_h = home_h-10;
			$('#navigation').css('height',home_h);
		}
		else{
			menu_h = menu_h-10;
			$('#navigation').css('height',menu_h);
		}
}


//Funcion que controla el margen de las novedades en el home
function novedades_ctl(){
	var home_w = $("#home").width();
	var menu_h = $("#main-nav").height();
	menu_h = menu_h - 40;
	
	var covers_row = Math.floor(home_w/186)
	var row_number = Math.floor(menu_h/250);
	
	var num_covers = covers_row*row_number;	
	var total_w = covers_row*186;
	var total_h = row_number*250;
	var margen_left = (home_w-total_w)/2;

	$("#home > .novedades_wrapper").css('margin-left',margen_left);
}

//Funcion que devuelve el numero de novedades que caben en el home.
function novedades_num(){
	
	var main_w = $("#home").width();
	var menu_h = $("#main-nav").height();
	menu_h = menu_h - 40;
	
	var covers_row = Math.floor(main_w/184.5)
	var row_number = Math.floor(menu_h/250);
	var num_covers = covers_row*row_number;

	return num_covers;
}


function artists_start(){
	string ="<h2 class='novedades_home'>Artistas</h2>";
	string +="<div id='artist_tiles' style='position: absolute; width: 100%;'>";
	// string +="<ul class='thumbnails inline'  id='tiles' style='margin-left:20px;'>";
	string +="<div class='artistas-wrapper'>";
}


function artistas_images_load(){
	$('#artistas').waitForImages(function(){
		setTimeout(function(){
			$('#artistas').removeClass('hide');
			setTimeout(function(){
				$('#carga').addClass('hide');
				$('#artistas').removeClass('effect');
				string="";
				loading=false;
			},20);
		},300);
	 });
}


function artists_end(){
	
	string+="</div>";
	string+="</div>";
	string+="<script type='text/javascript'>artistas_images_load();</script>";
	$("#artistas").html(string);

}

//Función que genera una página de album especifico
function dibujaAlbum(artist, album_title, coverArt_id, year, songs_arr, parent){

	playlist_tmp = new Array();

	string ='<div id="disco-container" style="">';
	string+='<div class="disco-header cf">';
	string+='<div class="wrapper-coverArt">';
	string+='<img class="cover-cd" src="'+serverURL+'/rest/getCoverArt.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&id='+coverArt_id+'&size=250" />';
	string+='</div>';
	if(year!=undefined){
		string+='<div class="disco-album">'+album_title+' ('+year+')</div>';
	}
	else{
		string+='<div class="disco-album">'+album_title+'</div>';
	}
	string+='<div class="disco-artist"><a href="#" class="artista-cd" data-id="'+parent+'">'+artist+'</a></div>';
	string+='</div>';
	string+='<span class="num-disco">Disco: 1</span>';
	string+='<table class="table" style="width:98%;">';
	string+='<tr>';
	string+='<th>#</th>';
	string+='<th>Canción</th>';
	string+='<th>Artista</th>';
	string+='<th>Duración</th>';
	string+='</tr>';
	
	var disco_num = 1;
	playlist_tmp = new Array();
	$.each(songs_arr, function(key) {
		if(songs_arr[key].discNumber > disco_num){
			disco_num++;
			string+='</table>';
			string+='<span class="num-disco">Disco: '+disco_num+'</span>';
			string+='<table class="table" style="width:98%;">';
			string+='<tr>';
			string+='<th>#</th>';
			string+='<th>Canción</th>';
			string+='<th>Artista</th>';
			string+='<th>Duración</th>';
			string+='</tr>';
		}
		
		string+='<tr data-song-id="'+songs_arr[key].id+'">';
		string+='<td>'+songs_arr[key].track+'</td>';
		string+='<td>'+songs_arr[key].title+'</td>';
		string+='<td>'+songs_arr[key].artist+'</td>';
		
		//Añadimos al array de playlist temporal todas las canciones.
		playlist_tmp.push(songs_arr[key].id);
		
		var duracion_seg = songs_arr[key].duration;
		var d=new Date(duracion_seg*1000);
		var minutos = d.getMinutes();
		var segundos = (d.getSeconds()<=9)?"0"+d.getSeconds():d.getSeconds();
		string+='<td>'+minutos+':'+segundos+'</td>';
		string+='</tr>';
	});
	
	//console.log(playlist_tmp);
	
	string+='</table>';
	string += '<br />';
	string+='</div>';
	string += "<script>alto_nav(); </script>"
	//if (disco_num == 1){ console.log("entro"); $(".num-disco").hide(); }
	$("#navigation").html(string);
	
	loadNavigation();
}






//Función que genera una página de artista con sus albumes. CABECERA
function dibujaAlbumes_start(artist_name, bio, artist_img, yearformed){
	string = '<div id="artista-container">';
	string += '<div class="artist-header cf">';
	string += '<div class="wrapper-coverArt">';
	string += '<img class="cover-cd-big" src="'+artist_img+'" />';
	string += '</div>';

	if(yearformed != undefined){
		string += '<div class="disco-artist-playlist">'+artist_name+' ('+yearformed+')</div> ';
	}
	else{
		string += '<div class="disco-album">'+artist_name+'</div>';
	}
	string += '<div class="descripcion-artista">';
	string += '<p>'+bio+'</p>'; 
	string += '</div>';
	string += '</div>';
	string += '<div id="discos">';
	string += '<ul class="lista-todos-discos">';
	playlist_tmp = new Array();
}


//Función que añade CDs a la página del artista.
function dibujaAlbumes_addCD(cd_title, year, img_cd, songs_arr){
	string += '<li class="cf">';
	string += '<div class="cover-album-wrapper">';
	string += '<div class="cover-album">';
	string += '<a href="#">';
	string += '<div class="imagen-wrapper">';
	string += '<img src="'+serverURL+'/rest/getCoverArt.view?&u='+user+'&p=enc:'+passenc+'&v='+api+'&c='+clientName+'&f='+format+'&id='+img_cd+'&size=160" />';
	string += '</div>';
	string += '</a>';
	string += '</div>';
	string += '</div>';
	string += '<div class="info-album">';
	string += '<h2 class="titulo-album">';
	string += '<a href="#" class="album-title-text">'+cd_title+'</a>';
	string += '<span class="ano-album">'+year+'</span>';
	string += '</h2>';
	string += '</div>';
	string += '<div class="playlist-album">';
	string += '<div class="lista playlist-album-wrapper">';
	string += '<div class="">';
	string += '<span class="num-disco">Disco: 1</span>';
	string += '<div class="tabla-disco-wrapper">';
	string += '<table class="table">';
	string += '<colgroup>';
	string += '<col style="width:21px;">';
	string += '<col style="">';
	string += '<col style="width:58px;">';
	string += '</colgroup>';
	string += '<tr>';
	string += '<th>#</th>';
	string += '<th>Canción</th>';
	string += '<th>Duración</th>';
	string += '</tr>';
	
	var disco_num = 1;
	
	$.each(songs_arr, function(key) {
		if(songs_arr[key].discNumber > disco_num){
			disco_num++;
			string += '</table>';
			string += '</div>';
			string += '</div>';
			string += '<div class="">';
			string += '<span class="num-disco">Disco: '+disco_num+'</span>';
			string += '<div class="tabla-disco-wrapper">';
			string += '<table class="table">';
			string += '<colgroup>';
			string += '<col style="width:21px;">';
			string += '<col style="">';
			string += '<col style="width:58px;">';
			string += '</colgroup>';
			string += '<tr>';
			string += '<th>#</th>';
			string += '<th>Canción</th>';
			string += '<th>Duración</th>';
			string += '</tr>';
		}
		
		string += '<tr data-song-id="'+songs_arr[key].id+'">';
		string+='<td>'+songs_arr[key].track+'</td>';
		string+='<td>'+songs_arr[key].title+'</td>';
		playlist_tmp.push(songs_arr[key].id);
		// string+='<td>'+songs_arr[key].artist+'</td>';
		var duracion_seg = songs_arr[key].duration;
		var d=new Date(duracion_seg*1000);
		var minutos = d.getMinutes();
		var segundos = (d.getSeconds()<=9)?"0"+d.getSeconds():d.getSeconds();
		string+='<td>'+minutos+':'+segundos+'</td>';
		string += '</tr>';
	
	});
		string += '</table>';
		string += '</div>';
		string += '</div>';
		string += '</div>';
		string += '</div>';
		string += '</li>';
};

function dibujaAlbumes_end(){
		string +="</ul>";	  		
		string+="</div>";
		string+="</div>";
		string += "<script>alto_nav(); </script>"
		$("#navigation").html(string);
		loadNavigation();
		
}

//////////////////////////////////////////////////
// Seccion: albumes 
/////////////////////////////////////////////////
function albumes_inicio() {
	string = "<h2 class='novedades_home'>Todos los álbumes</h2>";
	// string += "<ul class='thumbnails' style='margin-left:20px;'>";
	string+="<div class='novedades_wrapper'>";
	// string += "<ul class='thumbnails' style='text-align:center;'>";
	string+="<div id='discos-wrapper'>";
	
}

function album_add(id, artista, album, coverArt, parent){
	string+="<div class='disco-wrapper'>";
	string+="<div class='imagen-disco-wrapper'>";
	string+="<div class='inner-imagen-disco'>";
	string+="<a href='#'><img class='imagen-disco' data-id='"+id+"' src='"+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+coverArt+"&size=160' /></a>";
	string+="</div>";
	string+="</div>";
	string+="<div class='detalles-disco'>";
	string+="<div class='titulo-disco'><a class='cd_title' data-id='"+id+"' href='#'>"+album+"</div>";
	string+="<div class='subtitulo-artista'><a class='artist_title' data-id='"+parent+"' href='#'>"+artista+"</a></div>";
	string+="</div>";
	string+="</div>";
}



function albumes_final(){
	// string +="</ul>";
	string +="</div>";
	string+="<script type='text/javascript'>albumes_images_load(); albumes_ctl();</script>";
	$("#albumes").html(string);
}

function albumes_ctl(){
	var album_w = $("#albumes").width();
	var covers_row = Math.floor(album_w/184.5)
	var total_w = covers_row*184.5;
	var margen = (album_w-total_w)/2;
	$("#albumes > .novedades_wrapper").css('margin-left',margen);	
}

function albumes_images_load(){
	$('#albumes').waitForImages(function(){
		setTimeout(function(){
			$('#albumes').removeClass('hide');
			setTimeout(function(){
				$('#carga').addClass('hide');
				$('#albumes').removeClass('effect');
			setTimeout(function(){
				loading=false;
				
			},300);
			},20);
		},300);
	});
}


//Funcion que añade opacidad al abrir el navigation.
function loadNavigation(){
	if(navigation){
		$('#navigation').removeClass('hide');
		$('#navigation').waitForImages(function(){		
			setTimeout(function(){
				$("#carga").addClass('hide');
				setTimeout(function(){
					$("#navigation").addClass('navigation-effect');
					setTimeout(function(){
						if($("#main").scrollTop()){
							$("#main").animate({scrollTop: 0}, "slow");
						}
					},320);
				},50);
				
									
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
				
				$("#volver").removeClass('hide').fadeTo('slow',1);
				loading=false;
				string="";
			},50);
		});
	}
	navigation=false;
	
}
