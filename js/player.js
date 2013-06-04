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


$(document).ready(function(){
	var player = new jPlayerPlaylist({
		jPlayer: "#jquery_jplayer_1",
		cssSelectorAncestor: "#jp_container_1",
	},
	[],
	{
		playlistOptions: {
			enableRemoveControls: true
		},
		swfPath: "js/player",
		nativeSupport: true,
		supplied: "mp3",
		smoothPlayBar: true,
		keyEnabled: false,
		audioFullScreen: false
	});

	
$("#jquery_jplayer_1").bind($.jPlayer.event.ended, function(event) {
	var url_playing = $("#jquery_jplayer_1").data("jPlayer").status.src;
	var pos_id=url_playing.lastIndexOf("=");
	var idnow = url_playing.substring(pos_id+1, url_playing.length);
	$('table tbody tr').removeClass('playing');
	$('table tbody tr[data-song-id="'+idnow+'"]').addClass('playing');
$(".imagen-player").css("background","url("+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+idnow+"&size=250)");
});


$(".jp-next, .jp-previous").click(function() {
	var url_playing = $("#jquery_jplayer_1").data("jPlayer").status.src;
	var pos_id=url_playing.lastIndexOf("=");
	var idnow = url_playing.substring(pos_id+1, url_playing.length);
	$('table tbody tr').removeClass('playing');
	$('table tbody tr[data-song-id="'+idnow+'"]').addClass('playing');
	$(".imagen-player").css("background","url("+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+idnow+"&size=250)");
});
	
	
$("body").on("dblclick", "table tbody tr td", function(e) {
	
	//Borramos cualquier cancion que esté marcada de amarillo y marcamos la nueva donde se ha hecho doble click.
	$('table tbody tr').removeClass('playing');
	
	// Marca de amarillo al hacer doblle click
	$(this).parent().attr("class","playing");
	
	playlist_pos=0;
	
	var id_song = $(this).parent().attr("data-song-id");
	var artist_id = $(".artista-cd").attr("data-id");
	var cover_art = $(".cover-cd").attr("src");
	id_song=parseInt(id_song);
	playlist = playlist_tmp;
	select_song_pos=$.inArray(id_song, playlist);
	playlist_pos = select_song_pos;
	
	$(".imagen-player").css("background","url("+serverURL+"/rest/getCoverArt.view?&u="+user+"&p=enc:"+passenc+"&v="+api+"&c="+clientName+"&f="+format+"&id="+id_song+"&size=250)");
	// $(".imagen-player-wrapper").css("background","");	
	// $(".img-player-placeholder").css("background","");	
	
	$("#jquery_jplayer_1").jPlayer("stop");
	var player_pl = "";
	player_pl = "player.setPlaylist([";
	
	var songs_num = playlist.length;
	for (var i=0; i<songs_num; i++){
		player_pl+="{mp3:'"+serverURL+"/rest/stream.view?&u="+user+"&p=enc:"+passenc+"&v=1.9.0&c=supersub&f=json&id="+playlist[i]+"'}";
		if((i+1) != songs_num){
			player_pl+=", ";
		}
	};
  	player_pl+="],{swfPath: 'js/player', nativeSupport: true,	supplied: 'mp3',smoothPlayBar: true,keyEnabled: false,	audioFullScreen: false });";
	eval(player_pl);
	

	setTimeout(function(){
		player.select(select_song_pos);
		$("#jquery_jplayer_1").jPlayer("play", 0);
	},700)
	
	
	play_nav = $("#navigation").html();
	
});	
	
	
	
	
	// $("body").on("click", "table tbody tr td", function(e) {
		// $(this).parent().attr("class","playing")
// 		
	// });

	
	
	
});


